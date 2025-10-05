// Unethiat Frops JavaScript

class UnethiatApp {
    constructor() {
        this.initializeEventListeners();
        this.initializeAnimations();
    }

    initializeEventListeners() {
        // Search functionality
        const searchInput = document.querySelector('.search-bar input');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch(e.target.value);
                }
            });
        }

        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(link);
            });
        });

        // Action button
        const actionButton = document.querySelector('.action-button');
        if (actionButton) {
            actionButton.addEventListener('click', () => {
                this.handleActionButton();
            });
        }

        // User profile
        const userProfile = document.querySelector('.user-profile');
        if (userProfile) {
            userProfile.addEventListener('click', () => {
                this.handleUserProfile();
            });
        }
    }

    initializeAnimations() {
        // Add subtle animations to the character
        const character = document.querySelector('.character');
        if (character) {
            // Blinking animation
            this.startBlinkingAnimation();
            
            // Occasional head movement
            this.startHeadMovement();
        }
    }

    startBlinkingAnimation() {
        const eyes = document.querySelectorAll('.eye');
        
        setInterval(() => {
            eyes.forEach(eye => {
                eye.style.transform = 'scaleY(0.1)';
                setTimeout(() => {
                    eye.style.transform = 'scaleY(1)';
                }, 150);
            });
        }, 3000 + Math.random() * 2000);
    }

    startHeadMovement() {
        const characterHead = document.querySelector('.character-head');
        
        setInterval(() => {
            const randomDelay = Math.random() * 5000 + 2000;
            setTimeout(() => {
                characterHead.style.transform = 'translateX(5px)';
                setTimeout(() => {
                    characterHead.style.transform = 'translateX(-5px)';
                    setTimeout(() => {
                        characterHead.style.transform = 'translateX(0)';
                    }, 200);
                }, 200);
            }, randomDelay);
        }, 8000);
    }

    handleSearch(query) {
        if (query.trim()) {
            console.log('Searching for:', query);
            // Add search functionality here
            this.showNotification(`Searching for "${query}"...`);
        }
    }

    handleNavigation(link) {
        // Remove active class from all links
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Handle navigation logic
        const linkText = link.textContent.trim();
        console.log('Navigating to:', linkText);
        
        this.showNotification(`Navigating to ${linkText}...`);
    }

    handleActionButton() {
        const button = document.querySelector('.action-button');
        const originalText = button.textContent;
        
        // Button press animation
        button.style.transform = 'scale(0.95)';
        button.textContent = 'Processing...';
        
            setTimeout(() => {
            button.style.transform = 'scale(1)';
            button.textContent = originalText;
            this.showNotification('Action completed successfully!');
        }, 1500);
    }

    handleUserProfile() {
        console.log('User profile clicked');
        this.showNotification('Opening user profile...');
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UnethiatApp();
});