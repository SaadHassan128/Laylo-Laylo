// Beach Scene Interactive JavaScript - Enhanced Responsive Version

class ResponsiveBeachScene {
    constructor() {
        this.isNightMode = false;
        this.particleCount = 0;
        this.maxParticles = this.getMaxParticles();
        this.touchStartY = 0;
        this.touchStartX = 0;
        this.isTouch = 'ontouchstart' in window;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createStars();
        this.createParticles();
        this.createBeachElements();
        this.startParticleAnimation();
        this.setupResponsiveHandlers();
        this.addLoadingAnimation();
    }

    getMaxParticles() {
        const width = window.innerWidth;
        if (width < 480) return 8;
        if (width < 768) return 12;
        if (width < 1024) return 15;
        return 20;
    }

    setupEventListeners() {
        // Theme toggle button
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
            themeToggle.addEventListener('touchstart', this.handleTouchStart.bind(this));
            themeToggle.addEventListener('touchend', this.handleTouchEnd.bind(this));
        }

        // Message button and modal
        const messageBtn = document.getElementById('messageBtn');
        const modal = document.getElementById('modal');
        const closeBtn = document.getElementById('closeModal');

        if (messageBtn) {
            messageBtn.addEventListener('click', () => this.showMessage());
            messageBtn.addEventListener('touchstart', this.handleTouchStart.bind(this));
            messageBtn.addEventListener('touchend', this.handleTouchEnd.bind(this));
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeMessage());
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeMessage();
                }
            });
        }

        // Keyboard accessibility
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));

        // Window resize handler
        window.addEventListener('resize', () => this.handleResize());

        // Orientation change handler
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.handleResize(), 100);
        });

        // Interactive elements
        this.setupInteractiveElements();

        // Mouse movement effects (desktop only)
        if (!this.isTouch) {
            document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        }

        // Visibility change handler for performance
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    }

    handleTouchStart(e) {
        this.touchStartY = e.touches[0].clientY;
        this.touchStartX = e.touches[0].clientX;
        e.target.style.transform = e.target.style.transform.replace('scale(1)', 'scale(0.95)');
    }

    handleTouchEnd(e) {
        setTimeout(() => {
            e.target.style.transform = e.target.style.transform.replace('scale(0.95)', 'scale(1)');
        }, 150);
        
        // Add haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }

    handleKeyDown(e) {
        switch(e.key) {
            case 'Escape':
                this.closeMessage();
                break;
            case 'Enter':
            case ' ':
                if (e.target.id === 'themeToggle') {
                    e.preventDefault();
                    this.toggleTheme();
                } else if (e.target.id === 'messageBtn') {
                    e.preventDefault();
                    this.showMessage();
                }
                break;
            case 'w':
            case 'W':
                this.simulateWaveSound();
                break;
        }
    }

    handleMouseMove(e) {
        const welcomeText = document.querySelector('.welcome-text');
        if (welcomeText) {
            const x = (e.clientX / window.innerWidth - 0.5) * 10;
            const y = (e.clientY / window.innerHeight - 0.5) * 10;
            welcomeText.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        }
    }

    handleVisibilityChange() {
        const body = document.body;
        if (document.hidden) {
            body.style.animationPlayState = 'paused';
        } else {
            body.style.animationPlayState = 'running';
        }
    }

    setupInteractiveElements() {
        // Beach ball interaction
        const beachBall = document.getElementById('beachBall');
        if (beachBall) {
            beachBall.addEventListener('click', () => this.animateBeachBall());
            if (this.isTouch) {
                beachBall.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.animateBeachBall();
                });
            }
        }

        // Seashell interactions
        setTimeout(() => {
            const seashells = document.querySelectorAll('.seashell');
            seashells.forEach((shell, index) => {
                shell.addEventListener('click', () => this.animateSeashell(shell));
                if (this.isTouch) {
                    shell.addEventListener('touchstart', (e) => {
                        e.preventDefault();
                        this.animateSeashell(shell);
                    });
                }
            });
        }, 1000);
    }

    animateBeachBall() {
        const beachBall = document.getElementById('beachBall');
        if (beachBall) {
            beachBall.style.animation = 'none';
            beachBall.offsetHeight; // Trigger reflow
            beachBall.style.animation = 'ballBounce 1s ease-in-out';
            setTimeout(() => {
                beachBall.style.animation = 'ballBounce 3s ease-in-out infinite';
            }, 1000);
        }
    }

    animateSeashell(shell) {
        shell.style.transform = 'scale(1.5) rotate(360deg)';
        shell.style.transition = 'transform 0.5s ease';
        
        setTimeout(() => {
            shell.style.transform = '';
            shell.style.transition = '';
        }, 500);
    }

    toggleTheme() {
        const body = document.body;
        this.isNightMode = !this.isNightMode;

        if (this.isNightMode) {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
        } else {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
        }

        // Animate starfish rotation
        const starfish = document.querySelector('.starfish-icon');
        if (starfish) {
            starfish.style.transform = 'rotate(360deg) scale(1.2)';
            setTimeout(() => {
                starfish.style.transform = 'rotate(0deg) scale(1)';
            }, 600);
        }

        // Update particle colors
        this.updateParticleColors();

        // Announce theme change for screen readers
        this.announceThemeChange();
    }

    announceThemeChange() {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        
        announcement.textContent = `Switched to ${this.isNightMode ? 'night' : 'day'} theme`;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            if (document.body.contains(announcement)) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }

    showMessage() {
        const modal = document.getElementById('modal');
        if (modal) {
            modal.style.display = 'block';
            
            // Focus management for accessibility
            const closeBtn = document.getElementById('closeModal');
            if (closeBtn) {
                closeBtn.focus();
            }
            
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
            
            // Create sparkle effect
            this.createSparkles();
        }
    }

    closeMessage() {
        const modal = document.getElementById('modal');
        if (modal) {
            modal.style.display = 'none';
            
            // Restore body scroll
            document.body.style.overflow = 'hidden'; // Keep original overflow for beach scene
            
            // Return focus to message button
            const messageBtn = document.getElementById('messageBtn');
            if (messageBtn) {
                messageBtn.focus();
            }
        }
    }

    createSparkles() {
        const sparkles = ['✨', '⭐', '🌟', '💫', '🐚', '🌊'];
        const numSparkles = window.innerWidth < 768 ? 8 : 15;
        
        for (let i = 0; i < numSparkles; i++) {
            const sparkle = document.createElement('div');
            sparkle.innerHTML = sparkles[Math.floor(Math.random() * sparkles.length)];
            sparkle.style.position = 'fixed';
            sparkle.style.left = Math.random() * window.innerWidth + 'px';
            sparkle.style.top = Math.random() * window.innerHeight + 'px';
            sparkle.style.fontSize = window.innerWidth < 768 ? '1.5rem' : '2rem';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '3000';
            sparkle.style.animation = 'sparkleFloat 3s ease-out forwards';
            document.body.appendChild(sparkle);
            
            setTimeout(() => {
                if (document.body.contains(sparkle)) {
                    document.body.removeChild(sparkle);
                }
            }, 3000);
        }
    }

    createStars() {
        const starsContainer = document.getElementById('stars');
        if (!starsContainer) return;

        const numStars = window.innerWidth < 768 ? 50 : 100;
        
        for (let i = 0; i < numStars; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 2 + 's';
            star.style.animationDuration = (Math.random() * 3 + 1) + 's';
            starsContainer.appendChild(star);
        }
    }

    createParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        // Clear existing particles
        particlesContainer.innerHTML = '';
        this.particleCount = 0;

        // Create initial particles
        for (let i = 0; i < this.maxParticles; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer || this.particleCount >= this.maxParticles) return;

        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random positioning and properties
        const startX = Math.random() * window.innerWidth;
        const animationDuration = 8 + Math.random() * 4; // 8-12 seconds
        const size = window.innerWidth < 768 ? 2 + Math.random() * 2 : 3 + Math.random() * 2;
        const opacity = 0.3 + Math.random() * 0.5;
        
        particle.style.left = startX + 'px';
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.opacity = opacity;
        particle.style.animationDuration = animationDuration + 's';
        particle.style.animationDelay = Math.random() * 2 + 's';
        
        // Set particle color based on theme
        this.setParticleColor(particle);
        
        particlesContainer.appendChild(particle);
        this.particleCount++;

        // Remove particle after animation completes
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
                this.particleCount--;
            }
        }, (animationDuration + 2) * 1000);
    }

    setParticleColor(particle) {
        if (this.isNightMode) {
            const nightColors = [
                'rgba(135, 206, 235, 0.8)',
                'rgba(255, 255, 255, 0.6)',
                'rgba(173, 216, 230, 0.7)',
                'rgba(245, 245, 220, 0.5)'
            ];
            particle.style.background = nightColors[Math.floor(Math.random() * nightColors.length)];
        } else {
            const dayColors = [
                'rgba(255, 107, 107, 0.6)',
                'rgba(255, 215, 0, 0.6)',
                'rgba(255, 182, 193, 0.7)',
                'rgba(255, 228, 181, 0.5)'
            ];
            particle.style.background = dayColors[Math.floor(Math.random() * dayColors.length)];
        }
    }

    updateParticleColors() {
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            this.setParticleColor(particle);
        });
    }

    createBeachElements() {
        const sandContainer = document.getElementById('sand');
        if (!sandContainer) return;
        
        const isMobile = window.innerWidth < 768;
        const numShells = isMobile ? 5 : 8;
        const numFootprints = isMobile ? 8 : 12;
        
        // Create seashells
        for (let i = 0; i < numShells; i++) {
            const shell = document.createElement('div');
            shell.className = 'seashell';
            shell.style.left = Math.random() * 90 + '%';
            shell.style.bottom = Math.random() * 80 + '%';
            shell.style.animationDelay = Math.random() * 4 + 's';
            sandContainer.appendChild(shell);
        }
        
        // Create footprints
        for (let i = 0; i < numFootprints; i++) {
            const footprint = document.createElement('div');
            footprint.className = 'footprint';
            footprint.style.left = (20 + i * (60 / numFootprints)) + '%';
            footprint.style.bottom = (30 + Math.random() * 20) + '%';
            if (i % 2 === 0) {
                footprint.style.transform = 'rotate(15deg)';
            }
            sandContainer.appendChild(footprint);
        }
    }

    startParticleAnimation() {
        const interval = window.innerWidth < 768 ? 1500 : 1000;
        
        setInterval(() => {
            if (this.particleCount < this.maxParticles && !document.hidden) {
                this.createParticle();
            }
        }, interval);
    }

    simulateWaveSound() {
        const waves = document.querySelectorAll('.wave');
        waves.forEach((wave, index) => {
            setTimeout(() => {
                wave.style.transform = 'scaleY(1.3)';
                setTimeout(() => {
                    wave.style.transform = 'scaleY(1)';
                }, 200);
            }, index * 100);
        });
    }

    handleResize() {
        // Update max particles based on new screen size
        const newMaxParticles = this.getMaxParticles();
        if (newMaxParticles !== this.maxParticles) {
            this.maxParticles = newMaxParticles;
            
            // Remove excess particles if screen got smaller
            const particlesContainer = document.getElementById('particles');
            if (particlesContainer) {
                const particles = particlesContainer.querySelectorAll('.particle');
                if (particles.length > this.maxParticles) {
                    for (let i = this.maxParticles; i < particles.length; i++) {
                        particles[i].remove();
                        this.particleCount--;
                    }
                }
            }
        }

        // Remove particles that might be outside the new viewport
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            const rect = particle.getBoundingClientRect();
            if (rect.left > window.innerWidth || rect.left < -50) {
                particle.remove();
                this.particleCount--;
            }
        });

        // Recreate beach elements if needed
        this.recreateBeachElements();
    }

    recreateBeachElements() {
        const sandContainer = document.getElementById('sand');
        if (!sandContainer) return;

        // Remove existing elements
        const existingShells = sandContainer.querySelectorAll('.seashell');
        const existingFootprints = sandContainer.querySelectorAll('.footprint');
        
        existingShells.forEach(shell => shell.remove());
        existingFootprints.forEach(footprint => footprint.remove());

        // Recreate with new responsive sizes
        setTimeout(() => {
            this.createBeachElements();
            this.setupInteractiveElements();
        }, 100);
    }

    setupResponsiveHandlers() {
        // Add periodic wave sound simulation
        const waveInterval = window.innerWidth < 768 ? 6000 : 4000;
        setInterval(() => {
            if (!document.hidden) {
                this.simulateWaveSound();
            }
        }, waveInterval);

        // Performance optimization for low-end devices
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            this.maxParticles = Math.floor(this.maxParticles / 2);
            
            // Reduce animation complexity
            const style = document.createElement('style');
            style.textContent = `
                .wave { animation-duration: 4s !important; }
                .seagull { animation-duration: 20s !important; }
                .floating-cloud { animation-duration: 25s !important; }
            `;
            document.head.appendChild(style);
        }
    }

    addLoadingAnimation() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 1s ease-in-out';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    }

    // Performance monitoring
    monitorPerformance() {
        if ('performance' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    if (entry.duration > 16) { // More than one frame
                        console.warn('Performance issue detected:', entry);
                    }
                });
            });
            
            observer.observe({ entryTypes: ['measure', 'navigation'] });
        }
    }
}

// Initialize the beach scene when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const beachScene = new ResponsiveBeachScene();
    
    // Add sparkle animation CSS
    const sparkleCSS = `
        @keyframes sparkleFloat {
            0% { 
                opacity: 1; 
                transform: translateY(0) rotate(0deg) scale(0.5); 
            }
            50% {
                transform: translateY(-50px) rotate(180deg) scale(1.2);
            }
            100% { 
                opacity: 0; 
                transform: translateY(-100px) rotate(360deg) scale(0.8); 
            }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = sparkleCSS;
    document.head.appendChild(style);
    
    // Start performance monitoring in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        beachScene.monitorPerformance();
    }
});

// Service Worker registration for offline capability (optional)
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Prevent zoom on double tap for iOS
document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

let lastTouchEnd = 0;

// Add gesture support for theme toggle
let touchStartTime = 0;
let touchStartPos = { x: 0, y: 0 };

document.addEventListener('touchstart', function(e) {
    touchStartTime = Date.now();
    touchStartPos.x = e.touches[0].clientX;
    touchStartPos.y = e.touches[0].clientY;
});

document.addEventListener('touchend', function(e) {
    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - touchStartTime;
    const touchEndPos = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
    };
    
    const deltaX = touchEndPos.x - touchStartPos.x;
    const deltaY = touchEndPos.y - touchStartPos.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Double tap to toggle theme (if not on interactive elements)
    if (touchDuration < 300 && distance < 10 && !e.target.closest('button, .modal')) {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            // Double tap detected
            const beachScene = window.beachSceneInstance;
            if (beachScene) {
                beachScene.toggleTheme();
            }
        }
        lastTouchEnd = now;
    }
});

// Export for global access
window.ResponsiveBeachScene = ResponsiveBeachScene;

