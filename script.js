// D-ID Chat JavaScript

class DIDChat {
    constructor() {
        this.isListening = false;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.voices = [];
        this.isProcessing = false;
        
        this.initializeEventListeners();
        this.initializeVoiceFeatures();
        this.updateCharCounter();
    }

    initializeEventListeners() {
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

        // Character counter update
        document.getElementById('messageInput').addEventListener('input', () => {
            this.updateCharCounter();
        });

        // Voice input button
        document.getElementById('voiceBtn').addEventListener('click', () => {
            this.toggleVoiceInput();
        });
    }

    initializeVoiceFeatures() {
        // Initialize speech recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('messageInput').value = transcript;
                this.updateCharCounter();
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.isListening = false;
                this.updateVoiceButton();
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.updateVoiceButton();
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

        this.synthesis.speak(utterance);
    }

    toggleVoiceInput() {
        if (!this.recognition) {
            alert('Voice recognition not supported in this browser');
            return;
        }

        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    }

    updateVoiceButton() {
        const voiceBtn = document.getElementById('voiceBtn');
        const icon = voiceBtn.querySelector('i');
        
        if (this.isListening) {
            voiceBtn.style.color = '#3b82f6';
            icon.className = 'fas fa-stop';
        } else {
            voiceBtn.style.color = '#6b7280';
            icon.className = 'fas fa-microphone';
        }
    }

    updateCharCounter() {
        const input = document.getElementById('messageInput');
        const counter = document.querySelector('.char-counter');
        const length = input.value.length;
        counter.textContent = `${length}/350`;
        
        if (length > 300) {
            counter.style.color = '#ef4444';
        } else {
            counter.style.color = '#9ca3af';
        }
    }

    sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        
        if (message) {
            // Add user message
            this.addMessage('user', message);
            
            // Clear input
            messageInput.value = '';
            this.updateCharCounter();
            
            // Simulate AI response
            setTimeout(() => {
                this.addMessage('ai', 'Thanks for your message! I\'m Alice, your AI assistant. How can I help you today?');
            }, 1000);
        }
    }

    addMessage(type, content) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        messageDiv.innerHTML = `
            <div class="message-content">${content}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DIDChat();
});