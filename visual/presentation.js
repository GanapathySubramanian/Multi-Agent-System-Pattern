/**
 * Multi-Agent System Patterns - Presentation Carousel
 * This script transforms the regular demo into a presentation-style carousel
 */

class PresentationCarousel {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 0;
        this.patterns = [
            'profile',
            'title',
            'intro',
            'profile',
            'route',
            'coordinate', 
            'collaborate',
            'loop',
            'network',
            'hierarchical',
            'thank-you'
        ];
        this.titles = {
            'title': 'Multi-Agent System Patterns',
            'profile': 'About the Presenter',
            'intro': 'Multi-Agent System Patterns - Introduction',
            'profile': 'Presenter',
            'route': 'Route Pattern - Smart Language Router',
            'coordinate': 'Coordinate Pattern - Content Creation Workflow',
            'collaborate': 'Collaborate Pattern - Vacation Planner',
            'competitive': 'Competitive Pattern - Task Auction System',
            'loop': 'Loop Pattern - Essay Improvement System',
            'network': 'Network Pattern - Party Planning Committee',
            'hierarchical': 'Hierarchical Pattern - Software Development Team',
            'thank-you': 'Thank You for Your Attention'
        };
        this.descriptions = {
            'title': 'An Interactive Demonstration of AI Collaboration Models',
            'profile': 'Presented by Ganapathy Subramanian S, Engineer at Presidio',
            'intro': 'Exploring different ways AI agents can work together to accomplish complex tasks.',
            'profile': 'About the presenter',
            'route': 'The Team Leader analyzes the query and routes it to the most appropriate specialist agent.',
            'coordinate': 'The Team Leader delegates tasks sequentially and synthesizes outputs into a cohesive response.',
            'collaborate': 'All team members respond simultaneously, then the coordinator synthesizes into a consensus.',
            'competitive': 'Agents compete by submitting bids, and the best offer wins the task.',
            'loop': 'Agents keep repeating and improving work based on feedback until the output is good enough.',
            'network': 'Agents freely communicate with each other in a web-like structure, making group decisions.',
            'hierarchical': 'Higher-level agents manage and assign tasks to lower-level agents, like managers and employees.',
            'thank-you': 'Multi-Agent System Patterns Presentation'
        };
        this.init();
    }

    
    init() {
        // Wait for the DOM to be fully loaded
        document.addEventListener('DOMContentLoaded', () => {
            // Skip creating intro slide since we already have it in HTML
            // this.createIntroSlide(); // Commented out to preserve the slide order defined in patterns array
            this.setupCarousel();
            this.setupNavigation();
            this.setupKeyboardShortcuts();
            this.showCurrentSlide();
            
            // Show keyboard shortcuts hint
            this.showKeyboardHint();
            
            // Re-initialize pattern demos
            if (window.MultiAgentDemo) {
                new MultiAgentDemo();
            }
        });
    }
    
    
    createIntroSlide() {
        // Create an introduction slide
        const introSection = document.createElement('section');
        introSection.id = 'intro-pattern';
        introSection.className = 'pattern-section';
        
        const patternHeader = document.createElement('div');
        patternHeader.className = 'pattern-header';
        patternHeader.innerHTML = `
            <h2>Multi-Agent System Patterns - Introduction</h2>
            <p>Exploring different ways AI agents can work together to accomplish complex tasks.</p>
        `;
        
        const demoContainer = document.createElement('div');
        demoContainer.className = 'demo-container';
        demoContainer.innerHTML = `
            <div class="intro-content">
                <div class="intro-section">
                    <h4>What Are Multi-Agent Systems?</h4>
                    <p>A multi-agent system is a group of AI agents working together to solve problems that are difficult or impossible for a single agent to solve.</p>
                </div>
                
                <div class="intro-section">
                    <h4>Why Patterns Matter</h4>
                    <p>Different collaboration patterns offer unique advantages for different types of tasks and challenges.</p>
                </div>
                
                <div class="intro-section">
                    <h4>6 Key Multi-Agent Patterns</h4>
                    <ol>
                        <li><strong>Route Pattern</strong>: Directing tasks to specialists</li>
                        <li><strong>Coordinate Pattern</strong>: Sequential workflows</li>
                        <li><strong>Collaborate Pattern</strong>: Parallel problem-solving</li>
                        <li><strong>Loop Pattern</strong>: Iterative improvement</li>
                        <li><strong>Network Pattern</strong>: Web-like communication</li>
                        <li><strong>Hierarchical Pattern</strong>: Manager-worker structure</li>
                    </ol>
                </div>
                
                <div class="intro-section">
                    <h4>Interactive Demos</h4>
                    <p>Each pattern includes a live demonstration showing how agents interact.</p>
                </div>
            </div>
        `;
        
        introSection.appendChild(patternHeader);
        introSection.appendChild(demoContainer);
        
        // Insert the intro section before the first pattern section
        const firstPatternSection = document.querySelector('.pattern-section');
        if (firstPatternSection && firstPatternSection.parentNode) {
            firstPatternSection.parentNode.insertBefore(introSection, firstPatternSection);
        } else {
            document.body.appendChild(introSection);
        }
    }
    
    createProfileSlide() {
        // Create a profile slide
        const profileSection = document.createElement('section');
        profileSection.id = 'profile-pattern';
        profileSection.className = 'pattern-section';
        
        const patternHeader = document.createElement('div');
        patternHeader.className = 'pattern-header';
        patternHeader.innerHTML = `
            <h2>About the Presenter</h2>
        `;
        
        const demoContainer = document.createElement('div');
        demoContainer.className = 'demo-container';
        demoContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; text-align: center; background-color: rgba(15, 23, 42, 0.95);">
                <div style="width: 250px; margin-bottom: 30px;">
                    <img src="presenter-profile.png" alt="Ganapathy Subramanian S" 
                         style="width: 100%; border-radius: 50%; box-shadow: 0 8px 30px rgba(0,0,0,0.3);">
                </div>
                
                <h2 style="font-size: 3rem; margin-bottom: 15px; color: white;">Ganapathy Subramanian S</h2>
                <p style="font-size: 1.8rem; margin-bottom: 40px; color: #e2e8f0;">Engineer at Presidio</p>
            </div>
        `;
        
        profileSection.appendChild(patternHeader);
        profileSection.appendChild(demoContainer);
        
        // Find the first pattern section (which should be the intro section we just created)
        const introSection = document.getElementById('intro-pattern');
        if (introSection && introSection.parentNode) {
            // Insert after the intro section
            if (introSection.nextSibling) {
                introSection.parentNode.insertBefore(profileSection, introSection.nextSibling);
            } else {
                introSection.parentNode.appendChild(profileSection);
            }
        } else {
            document.body.appendChild(profileSection);
        }
    }

    setupCarousel() {
        // Create the carousel container structure
        const body = document.body;
        const header = document.querySelector('header');
        const patternSections = document.querySelectorAll('.pattern-section');
        
        // Store the total number of slides
        this.totalSlides = patternSections.length;
        
        // Create presentation header
        const presentationHeader = document.createElement('div');
        presentationHeader.className = 'presentation-header';
        presentationHeader.innerHTML = `<h1>Multi-Agent System Patterns</h1>`;
        
        // Create carousel container
        const carouselContainer = document.createElement('div');
        carouselContainer.className = 'carousel-container';
        
        // Create carousel track
        const carouselTrack = document.createElement('div');
        carouselTrack.className = 'carousel-track';
        
        // Create slides from pattern sections
        patternSections.forEach(section => {
            // Create slide element
            const slide = document.createElement('div');
            slide.className = 'slide';
            
            // Create slide content wrapper
            const slideContent = document.createElement('div');
            slideContent.className = 'slide-content';
            
            // Get pattern ID
            const patternId = section.id.replace('-pattern', '');
            
            // Create slide header
            const slideHeader = document.createElement('div');
            slideHeader.className = 'slide-header';
            
            slideHeader.innerHTML = `
                <h2>${this.titles[patternId] || section.querySelector('h2').textContent}</h2>
                <p>${this.descriptions[patternId] || section.querySelector('.pattern-header p').textContent}</p>
            `;
            
            // Create slide body
            const slideBody = document.createElement('div');
            slideBody.className = 'slide-body';
            
            // Get the demo container content - important to MOVE not CLONE
            const demoContainer = section.querySelector('.demo-container');
            if (demoContainer) {
                // Move the actual demo container to maintain event handlers
                slideBody.appendChild(demoContainer);
            }
            
            // Assemble slide
            slideContent.appendChild(slideHeader);
            slideContent.appendChild(slideBody);
            slide.appendChild(slideContent);
            carouselTrack.appendChild(slide);
        });
        
        // Create navigation controls
        const navArrowPrev = document.createElement('div');
        navArrowPrev.className = 'arrow-nav prev';
        navArrowPrev.innerHTML = '&#10094;';
        navArrowPrev.addEventListener('click', () => this.prevSlide());
        
        const navArrowNext = document.createElement('div');
        navArrowNext.className = 'arrow-nav next';
        navArrowNext.innerHTML = '&#10095;';
        navArrowNext.addEventListener('click', () => this.nextSlide());
        
        // Create slide indicators and bottom navigation
        const carouselNav = document.createElement('div');
        carouselNav.className = 'carousel-nav';
        
        const slideIndicators = document.createElement('div');
        slideIndicators.className = 'slide-indicators';
        
        // Create individual indicators
        for (let i = 0; i < this.totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'slide-indicator';
            indicator.dataset.slide = i;
            indicator.addEventListener('click', () => this.goToSlide(i));
            slideIndicators.appendChild(indicator);
        }
        
        // Create slide counter
        const slideCounter = document.createElement('div');
        slideCounter.className = 'slide-counter';
        slideCounter.textContent = `Slide 1 of ${this.totalSlides}`;
        
        // Assemble navigation
        carouselNav.appendChild(slideIndicators);
        carouselNav.appendChild(slideCounter);
        
        // Add everything to the page
        carouselContainer.appendChild(carouselTrack);
        
        // Replace the existing content with the carousel
        body.insertBefore(presentationHeader, header);
        body.insertBefore(carouselContainer, header.nextSibling);
        body.appendChild(navArrowPrev);
        body.appendChild(navArrowNext);
        body.appendChild(carouselNav);
        
        // Hide the original header and pattern sections
        header.style.display = 'none';
        patternSections.forEach(section => {
            section.style.display = 'none';
        });
        
        // Store references to important elements
        this.carouselTrack = carouselTrack;
        this.slideCounter = slideCounter;
        this.slideIndicators = slideIndicators.children;
    }

    setupNavigation() {
        // Navigation event handlers are already set up in setupCarousel
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    this.prevSlide();
                    break;
                case 'ArrowRight':
                    this.nextSlide();
                    break;
                case ' ': // Spacebar
                    this.nextSlide();
                    break;
                case 'Home':
                    this.goToSlide(0);
                    break;
                case 'End':
                    this.goToSlide(this.totalSlides - 1);
                    break;
                case 'f':
                    this.toggleFullScreen();
                    break;
            }
        });
    }

    prevSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.showCurrentSlide();
        }
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.currentSlide++;
            this.showCurrentSlide();
        }
    }

    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides) {
            this.currentSlide = index;
            this.showCurrentSlide();
        }
    }

    showCurrentSlide() {
        // Update carousel track position
        this.carouselTrack.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        
        // Update slide counter
        this.slideCounter.textContent = `Slide ${this.currentSlide + 1} of ${this.totalSlides}`;
        
        // Update indicators
        for (let i = 0; i < this.slideIndicators.length; i++) {
            if (i === this.currentSlide) {
                this.slideIndicators[i].classList.add('active');
            } else {
                this.slideIndicators[i].classList.remove('active');
            }
        }
        
        // Activate the appropriate pattern's demo if not the intro slide
        if (this.currentSlide > 0) { // Skip for intro slide
            const currentPattern = this.patterns[this.currentSlide];
            if (currentPattern && window.MultiAgentDemo) {
                // Simulate clicking the appropriate nav button
                const navBtn = document.querySelector(`.nav-btn[data-pattern="${currentPattern}"]`);
                if (navBtn) {
                    navBtn.click();
                }
            }
        }
    }

    toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    showKeyboardHint() {
        const hint = document.createElement('div');
        hint.className = 'keyboard-hint';
        hint.innerHTML = `
            <div>Keyboard Shortcuts:</div>
            <div>→ or Space: Next slide</div>
            <div>←: Previous slide</div>
            <div>F: Toggle fullscreen</div>
            <div>Home/End: First/Last slide</div>
        `;
        document.body.appendChild(hint);
        
        // Fade out after 5 seconds
        setTimeout(() => {
            hint.classList.add('fade-out');
            setTimeout(() => {
                hint.remove();
            }, 6000);
        }, 5000);
    }
}

// Initialize the presentation carousel
new PresentationCarousel();
