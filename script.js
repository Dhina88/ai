// AI Hiring System JavaScript

class AIHiringSystem {
    constructor() {
        this.currentUser = null;
        this.interviewQuestions = [
            "Hello! Welcome to your AI interview. Let's start with a brief introduction. Can you tell me about yourself and your professional background?",
            "What interests you most about this position, and what motivated you to apply?",
            "Can you describe a challenging project you've worked on recently? What was your role and how did you handle any obstacles?",
            "How do you stay updated with the latest trends and technologies in your field?",
            "Tell me about a time when you had to work with a difficult team member. How did you handle the situation?",
            "What are your greatest strengths, and how do they contribute to your work?",
            "Can you describe a situation where you had to learn something new quickly? How did you approach it?",
            "Where do you see yourself in 5 years, and how does this role fit into your career goals?",
            "What questions do you have about our company or this position?",
            "Thank you for your time today. Is there anything else you'd like to add that we haven't covered?"
        ];
        this.currentQuestionIndex = 0;
        this.interviewStarted = false;
        this.isListening = false;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.voices = [];
        this.isContinuousMode = false;
        this.silenceTimeout = null;
        this.isProcessing = false;
        
        this.initializeEventListeners();
        this.initializeVoiceFeatures();
        this.showPage('loginPage');
    }

    initializeEventListeners() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Start interview button
        document.getElementById('startInterviewBtn').addEventListener('click', () => {
            this.startInterview();
        });

        // End interview button
        document.getElementById('endInterviewBtn').addEventListener('click', () => {
            this.endInterview();
        });

        // Send message button
        document.getElementById('sendBtn').addEventListener('click', () => {
            this.sendMessage();
        });

        // Enter key in message input
        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Voice input button (now for toggling continuous mode)
        document.getElementById('voiceBtn').addEventListener('click', () => {
            this.toggleContinuousMode();
        });
    }

    initializeVoiceFeatures() {
        // Initialize speech recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = true; // Enable continuous listening
            this.recognition.interimResults = true; // Get interim results
            this.recognition.lang = 'en-US';

            this.recognition.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }

                // Update input field with interim results
                if (interimTranscript) {
                    document.getElementById('messageInput').value = interimTranscript;
                }

                // Process final transcript
                if (finalTranscript && !this.isProcessing) {
                    this.processVoiceInput(finalTranscript);
                }
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                if (event.error === 'no-speech' || event.error === 'audio-capture') {
                    // Restart recognition for continuous mode
                    if (this.isContinuousMode && this.interviewStarted) {
                        setTimeout(() => {
                            this.startContinuousListening();
                        }, 1000);
                    }
                } else {
                    this.showNotification('Voice recognition error. Please try again.', 'error');
                    this.isContinuousMode = false;
                    this.updateVoiceButton();
                }
            };

            this.recognition.onend = () => {
                // Restart recognition for continuous mode
                if (this.isContinuousMode && this.interviewStarted) {
                    setTimeout(() => {
                        this.startContinuousListening();
                    }, 100);
                }
            };

            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateVoiceButton();
            };
        }

        // Load available voices
        this.loadVoices();
        if (this.synthesis.onvoiceschanged !== undefined) {
            this.synthesis.onvoiceschanged = () => this.loadVoices();
        }
    }

    loadVoices() {
        this.voices = this.synthesis.getVoices();
    }

    speak(text) {
        if (this.synthesis.speaking) {
            this.synthesis.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Try to find a good voice
        const preferredVoice = this.voices.find(voice => 
            voice.name.includes('Google') || 
            voice.name.includes('Microsoft') ||
            voice.lang.startsWith('en')
        );
        
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }
        
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;

        utterance.onstart = () => {
            document.getElementById('speakingIndicator').classList.add('show');
        };

        utterance.onend = () => {
            document.getElementById('speakingIndicator').classList.remove('show');
        };

        this.synthesis.speak(utterance);
    }

    toggleContinuousMode() {
        if (!this.recognition) {
            this.showNotification('Voice recognition not supported in this browser', 'error');
            return;
        }

        if (this.isContinuousMode) {
            this.stopContinuousListening();
        } else {
            this.startContinuousListening();
        }
    }

    startContinuousListening() {
        if (!this.interviewStarted) {
            this.showNotification('Please start an interview first', 'error');
            return;
        }

        this.isContinuousMode = true;
        this.isProcessing = false;
        
        try {
            this.recognition.start();
            this.showNotification('Voice call mode activated - AI is now listening continuously', 'success');
            document.getElementById('voiceCallStatus').classList.add('show');
        } catch (error) {
            console.error('Error starting continuous listening:', error);
            this.showNotification('Failed to start voice recognition', 'error');
        }
    }

    stopContinuousListening() {
        this.isContinuousMode = false;
        this.isListening = false;
        this.recognition.stop();
        this.updateVoiceButton();
        this.showNotification('Voice call mode deactivated', 'info');
        document.getElementById('voiceCallStatus').classList.remove('show');
    }

    processVoiceInput(transcript) {
        if (this.isProcessing) return;
        
        this.isProcessing = true;
        const cleanTranscript = transcript.trim();
        
        if (cleanTranscript.length > 0) {
            // Add user message
            this.addMessage('user', 'You', cleanTranscript);
            
            // Clear input
            document.getElementById('messageInput').value = '';
            
            // Move to next question after a short delay
            setTimeout(() => {
                this.currentQuestionIndex++;
                this.askQuestion();
                this.isProcessing = false;
            }, 2000);
        } else {
            this.isProcessing = false;
        }
    }

    updateVoiceButton() {
        const voiceBtn = document.getElementById('voiceBtn');
        const icon = voiceBtn.querySelector('i');
        
        if (this.isContinuousMode) {
            voiceBtn.classList.add('listening');
            icon.className = 'fas fa-phone-slash';
            voiceBtn.title = 'End Voice Call';
        } else {
            voiceBtn.classList.remove('listening');
            icon.className = 'fas fa-phone';
            voiceBtn.title = 'Start Voice Call';
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show the specified page
        document.getElementById(pageId).classList.add('active');
    }

    handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Admin credentials
        const adminCredentials = {
            email: 'admin@ai-hiring.com',
            password: 'admin123'
        };

        // Simple validation (in a real app, this would be server-side)
        if (email && password) {
            const isAdmin = email === adminCredentials.email && password === adminCredentials.password;
            this.currentUser = { 
                email, 
                isAdmin,
                role: isAdmin ? 'Administrator' : 'Candidate'
            };
            document.getElementById('userEmail').textContent = `${email} (${this.currentUser.role})`;
            this.showPage('dashboardPage');
            
            // Clear login form
            document.getElementById('loginForm').reset();
        } else {
            this.showNotification('Please enter both email and password', 'error');
        }
    }

    handleLogout() {
        this.currentUser = null;
        this.interviewStarted = false;
        this.currentQuestionIndex = 0;
        this.showPage('loginPage');
        
        // Clear chat messages
        document.getElementById('chatMessages').innerHTML = '';
        
        // Reset message input
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        messageInput.disabled = true;
        messageInput.value = '';
        sendBtn.disabled = true;
    }

    startInterview() {
        this.interviewStarted = true;
        this.currentQuestionIndex = 0;
        this.showPage('interviewPage');
        
        // Enable message input and voice controls
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        const voiceBtn = document.getElementById('voiceBtn');
        messageInput.disabled = false;
        sendBtn.disabled = false;
        voiceBtn.disabled = false;
        messageInput.focus();

        // Start with the first question
        this.askQuestion();
        
        // Show voice call option
        this.showNotification('Click the phone button to start voice call mode for continuous conversation', 'info');
    }

    endInterview() {
        this.interviewStarted = false;
        this.currentQuestionIndex = 0;
        
        // Stop continuous listening if active
        if (this.isContinuousMode) {
            this.stopContinuousListening();
        }
        
        this.showPage('dashboardPage');
        
        // Clear chat messages
        document.getElementById('chatMessages').innerHTML = '';
        
        // Disable message input and voice controls
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        const voiceBtn = document.getElementById('voiceBtn');
        messageInput.disabled = true;
        messageInput.value = '';
        sendBtn.disabled = true;
        voiceBtn.disabled = true;
    }

    askQuestion() {
        if (this.currentQuestionIndex < this.interviewQuestions.length) {
            const question = this.interviewQuestions[this.currentQuestionIndex];
            this.addMessage('ai', 'AI Interviewer', question);
            
            // Speak the question
            this.speak(question);
            
            // Show typing indicator
            this.showTypingIndicator();
            
            // Hide typing indicator after a delay
            setTimeout(() => {
                this.hideTypingIndicator();
            }, 1000);
        } else {
            const finalMessage = 'Thank you for completing the interview! We will review your responses and get back to you soon. Have a great day!';
            this.addMessage('ai', 'AI Interviewer', finalMessage);
            this.speak(finalMessage);
        }
    }

    sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        
        if (message) {
            // Add user message
            this.addMessage('user', 'You', message);
            
            // Clear input
            messageInput.value = '';
            
            // Move to next question after a short delay
            setTimeout(() => {
                this.currentQuestionIndex++;
                this.askQuestion();
            }, 1500);
        }
    }

    addMessage(type, sender, content) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        messageDiv.innerHTML = `
            <div class="message-header">${sender}</div>
            <div class="message-content">${content}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    showTypingIndicator() {
        document.getElementById('typingIndicator').classList.add('show');
    }

    hideTypingIndicator() {
        document.getElementById('typingIndicator').classList.remove('show');
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AIHiringSystem();
});
