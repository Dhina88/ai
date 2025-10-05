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
        
        this.initializeEventListeners();
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

        // Simple validation (in a real app, this would be server-side)
        if (email && password) {
            this.currentUser = { email };
            document.getElementById('userEmail').textContent = email;
            this.showPage('dashboardPage');
            
            // Clear login form
            document.getElementById('loginForm').reset();
        } else {
            alert('Please enter both email and password');
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
        
        // Enable message input
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        messageInput.disabled = false;
        sendBtn.disabled = false;
        messageInput.focus();

        // Start with the first question
        this.askQuestion();
    }

    endInterview() {
        this.interviewStarted = false;
        this.currentQuestionIndex = 0;
        this.showPage('dashboardPage');
        
        // Clear chat messages
        document.getElementById('chatMessages').innerHTML = '';
        
        // Disable message input
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        messageInput.disabled = true;
        messageInput.value = '';
        sendBtn.disabled = true;
    }

    askQuestion() {
        if (this.currentQuestionIndex < this.interviewQuestions.length) {
            const question = this.interviewQuestions[this.currentQuestionIndex];
            this.addMessage('ai', 'AI Interviewer', question);
            
            // Show typing indicator
            this.showTypingIndicator();
            
            // Hide typing indicator after a delay
            setTimeout(() => {
                this.hideTypingIndicator();
            }, 1000);
        } else {
            this.addMessage('ai', 'AI Interviewer', 'Thank you for completing the interview! We will review your responses and get back to you soon. Have a great day!');
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
