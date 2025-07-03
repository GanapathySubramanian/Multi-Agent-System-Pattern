/**
 * Multi-Agent System Patterns - Presentation Carousel
 * This script transforms the regular demo into a presentation-style carousel
 */

class PresentationCarousel {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 0;
        this.patterns = [
            'intro',
            'profile',
            'route',
            'coordinate', 
            'collaborate',
            'competitive',
            'loop',
            'aggregator',
            'network',
            'hierarchical'
        ];
        this.titles = {
            'intro': 'Multi-Agent System Patterns - Introduction',
            'profile': 'About the Presenter',
            'route': 'Route Pattern - Smart Language Router',
            'coordinate': 'Coordinate Pattern - Content Creation Workflow',
            'collaborate': 'Collaborate Pattern - Research Panel Discussion',
            'competitive': 'Competitive Pattern - Task Auction System',
            'loop': 'Loop Pattern - Essay Improvement System',
            'aggregator': 'Aggregator Pattern - Weather Forecast System',
            'network': 'Network Pattern - Party Planning Committee',
            'hierarchical': 'Hierarchical Pattern - Software Development Team'
        };
        this.descriptions = {
            'intro': 'Exploring different ways AI agents can work together to accomplish complex tasks.',
            'profile': 'Presented by Ganapathy Subramanian S, Engineer at Presidio',
            'route': 'The Team Leader analyzes the query and routes it to the most appropriate specialist agent.',
            'coordinate': 'The Team Leader delegates tasks sequentially and synthesizes outputs into a cohesive response.',
            'collaborate': 'All team members respond simultaneously, then the coordinator synthesizes into a consensus.',
            'competitive': 'Agents compete by submitting bids, and the best offer wins the task.',
            'loop': 'Agents keep repeating and improving work based on feedback until the output is good enough.',
            'aggregator': 'Multiple data sources provide inputs that are merged into one final result by a central aggregator.',
            'network': 'Agents freely communicate with each other in a web-like structure, making group decisions.',
            'hierarchical': 'Higher-level agents manage and assign tasks to lower-level agents, like managers and employees.'
        };
        this.init();
    }

    init() {
        // Wait for the DOM to be fully loaded
        document.addEventListener('DOMContentLoaded', () => {
            // Skip creating intro slide since we already have it in HTML
            this.createIntroSlide();
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
                <h3>Today's Webinar Agenda</h3>
                
                <div class="intro-section">
                    <h4>What Are Multi-Agent Systems?</h4>
                    <p>A multi-agent system is a group of AI agents working together to solve problems that are difficult or impossible for a single agent to solve.</p>
                </div>
                
                <div class="intro-section">
                    <h4>Why Patterns Matter</h4>
                    <p>Different collaboration patterns offer unique advantages for different types of tasks and challenges.</p>
                </div>
                
                <div class="intro-section">
                    <h4>8 Key Multi-Agent Patterns</h4>
                    <ol>
                        <li><strong>Route Pattern</strong>: Directing tasks to specialists</li>
                        <li><strong>Coordinate Pattern</strong>: Sequential workflows</li>
                        <li><strong>Collaborate Pattern</strong>: Parallel problem-solving</li>
                        <li><strong>Competitive Pattern</strong>: Contest-based selection</li>
                        <li><strong>Loop Pattern</strong>: Iterative improvement</li>
                        <li><strong>Aggregator Pattern</strong>: Multi-source data integration</li>
                        <li><strong>Network Pattern</strong>: Web-like communication</li>
                        <li><strong>Hierarchical Pattern</strong>: Manager-worker structure</li>
                    </ol>
                </div>
                
                <div class="intro-section">
                    <h4>Interactive Demos</h4>
                    <p>Each pattern includes a live demonstration showing how agents interact.</p>
                </div>
                
                <div class="intro-section">
                    <h4>Navigation Instructions</h4>
                    <p>Use the arrow buttons or your keyboard's arrow keys to navigate between patterns.</p>
                    <p>Press 'F' for fullscreen mode.</p>
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
