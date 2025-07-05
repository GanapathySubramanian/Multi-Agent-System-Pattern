// Multi-Agent System Patterns Interactive Demo
// JavaScript functionality for all pattern demonstrations

class MultiAgentDemo {
    constructor() {
        this.currentPattern = 'route';
        this.init();
    }

    init() {
        console.log("Initializing MultiAgentDemo...");
        
        try {
            this.setupNavigation();
            console.log("Navigation setup complete");
        } catch (e) {
            console.error("Error setting up navigation:", e);
        }
        
        // Set up each pattern independently with error handling
        // so one failure doesn't prevent others from initializing
        this.setupPatternWithErrorHandling('setupRoutePattern');
        this.setupPatternWithErrorHandling('setupCoordinatePattern');
        this.setupPatternWithErrorHandling('setupCollaboratePattern');
        this.setupPatternWithErrorHandling('setupCompetitivePattern');
        this.setupPatternWithErrorHandling('setupLoopPattern');
        this.setupPatternWithErrorHandling('setupNetworkPattern');
        this.setupPatternWithErrorHandling('setupHierarchicalPattern');
        
        console.log("All patterns initialization attempted");
    }
    
    // Helper method to safely set up each pattern with error handling
    setupPatternWithErrorHandling(patternMethod) {
        try {
            console.log(`Setting up ${patternMethod}...`);
            if (typeof this[patternMethod] === 'function') {
                this[patternMethod]();
                console.log(`${patternMethod} setup complete`);
            } else {
                console.error(`${patternMethod} is not a valid method`);
            }
        } catch (e) {
            console.error(`Error in ${patternMethod}:`, e);
        }
    }

    // Navigation between patterns
    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.pattern-section');

        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const pattern = btn.dataset.pattern;
                
                // Update active nav button
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update active section
                sections.forEach(s => s.classList.remove('active'));
                document.getElementById(`${pattern}-pattern`).classList.add('active');
                
                this.currentPattern = pattern;
            });
        });
    }

    // Route Pattern Implementation
    setupRoutePattern() {
        const languageButtons = document.querySelectorAll('.route-lang-btn');
        const routeInput = document.getElementById('route-input');
        const routeSubmit = document.getElementById('route-submit');

        // Language detection responses
        const responses = {
            'English': 'Hello! I am doing well, thank you for asking. How can I help you today?',
            'Spanish': '¡Hola! Estoy muy bien, gracias por preguntar. ¿Cómo puedo ayudarte hoy?',
            'French': 'Bonjour! Je vais très bien, merci de demander. Comment puis-je vous aider aujourd\'hui?',
            'Chinese': '你好！我很好，谢谢你的关心。今天我能为你做些什么吗？',
            'Japanese': 'こんにちは！元気です、ありがとうございます。今日はどのようにお手伝いできますか？'
        };

        languageButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const text = btn.dataset.text;
                const language = btn.dataset.lang;
                this.demonstrateRouting(text, language, responses[language]);
            });
        });

        routeSubmit.addEventListener('click', () => {
            const text = routeInput.value.trim();
            if (text) {
                const detectedLang = this.detectLanguage(text);
                this.demonstrateRouting(text, detectedLang, responses[detectedLang] || 'I can respond in English, Spanish, French, Chinese, or Japanese. Please try one of these languages.');
                routeInput.value = '';
            }
        });

        routeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                routeSubmit.click();
            }
        });
    }

    detectLanguage(text) {
        // Simple language detection based on character patterns
        if (/[\u4e00-\u9fff]/.test(text)) return 'Chinese';
        if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) return 'Japanese';
        if (/[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]/.test(text.toLowerCase())) return 'French';
        if (/[ñáéíóúü¿¡]/.test(text.toLowerCase())) return 'Spanish';
        return 'English';
    }

    async demonstrateRouting(message, targetLanguage, response) {
        // Use flexible selectors that work in both regular and presentation modes
        // The .agent-card elements might be in the original #route-pattern or in a slide-body
        const agents = document.querySelectorAll('.agent-card[data-lang]');
        const leaderStatus = document.querySelector('#leader-status, [id="leader-status"]');
        const messageBubble = document.querySelector('#route-message, [id="route-message"]');
        const resultBox = document.querySelector('#route-result, [id="route-result"]');

        if (!agents.length || !leaderStatus || !messageBubble || !resultBox) {
            console.warn('Route pattern elements not found');
            return;
        }

        agents.forEach(agent => {
            agent.classList.remove('active');
            const status = agent.querySelector('.status');
            if (status) status.textContent = 'Standby';
        });

        // Step 1: Show message
        messageBubble.textContent = message;
        
        // In presentation mode, show message without animation; otherwise animate
        if (document.querySelector('.slide-content')) {
            messageBubble.style.opacity = '1'; // Make visible without animation
            messageBubble.style.transform = 'translateY(0)';
        } else {
            messageBubble.classList.add('show');
        }
        
        leaderStatus.textContent = 'Analyzing...';
        leaderStatus.className = 'status processing';

        await this.delay(1000);

        // Step 2: Leader analysis
        leaderStatus.textContent = `Detected: ${targetLanguage}`;
        await this.delay(1000);

        // Step 3: Route to appropriate agent
        const targetAgent = document.querySelector(`.agent-card[data-lang="${targetLanguage}"]`);
        if (targetAgent) {
            targetAgent.classList.add('active');
            const agentStatus = targetAgent.querySelector('.status');
            if (agentStatus) {
                agentStatus.textContent = 'Processing';
                agentStatus.className = 'status processing';
            }
        }

        leaderStatus.textContent = `Routed to ${targetLanguage} Agent`;
        await this.delay(2000);

        // Step 4: Show response
        if (targetAgent) {
            const agentStatus = targetAgent.querySelector('.status');
            if (agentStatus) {
                agentStatus.textContent = 'Completed';
                agentStatus.className = 'status completed';
            }
        }

        leaderStatus.textContent = 'Ready';
        leaderStatus.className = 'status';
        
        resultBox.textContent = response;
        resultBox.className = 'result-box success';

        // Hide message bubble after delay
        // In presentation mode, keep it visible; otherwise hide with animation
        if (document.querySelector('.slide-content')) {
            // Keep the message visible in presentation mode
        } else {
            setTimeout(() => {
                messageBubble.classList.remove('show');
            }, 3000);
        }
    }

    // Coordinate Pattern Implementation
    setupCoordinatePattern() {
        const topicButtons = document.querySelectorAll('.coordinate-topic-btn');
        const coordinateInput = document.getElementById('coordinate-input');
        const coordinateSubmit = document.getElementById('coordinate-submit');

        topicButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const topic = btn.dataset.topic;
                this.demonstrateCoordination(topic);
            });
        });

        coordinateSubmit.addEventListener('click', () => {
            const topic = coordinateInput.value.trim();
            if (topic) {
                this.demonstrateCoordination(topic);
                coordinateInput.value = '';
            }
        });

        coordinateInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                coordinateSubmit.click();
            }
        });
    }

    async demonstrateCoordination(topic) {
        const steps = ['search', 'write', 'edit'];
        const stepCards = document.querySelectorAll('#coordinate-pattern .step-card');
        const resultBox = document.getElementById('coordinate-result');

        // Reset all steps
        stepCards.forEach(card => {
            card.classList.remove('active');
            const progress = card.querySelector('.progress');
            if (progress) progress.style.width = '0%';
        });

        resultBox.textContent = 'Creating article...';
        resultBox.className = 'result-box';

        // Execute each step
        for (let i = 0; i < steps.length; i++) {
            const stepCard = document.getElementById(`step-${i + 1}`);
            const progress = document.getElementById(`${steps[i]}-progress`);
            
            stepCard.classList.add('active');
            
            // Animate progress
            let progressValue = 0;
            const progressInterval = setInterval(() => {
                progressValue += 10;
                progress.style.width = `${progressValue}%`;
                
                if (progressValue >= 100) {
                    clearInterval(progressInterval);
                }
            }, 200);

            await this.delay(2000);
            stepCard.classList.remove('active');
        }

        // Show final result
        const articles = {
            'Artificial Intelligence': this.generateArticle('AI', topic),
            'Climate Change': this.generateArticle('Climate', topic),
            'Space Exploration': this.generateArticle('Space', topic),
            'Renewable Energy': this.generateArticle('Energy', topic)
        };

        const finalArticle = articles[topic] || this.generateArticle('General', topic);
        
        resultBox.innerHTML = finalArticle;
        resultBox.className = 'result-box success';
    }

    generateArticle(type, topic) {
        const articles = {
            'AI': `
                <h4>The Future of Artificial Intelligence: Trends and Implications</h4>
                <p><strong>Research Phase:</strong> Found 15 relevant sources from MIT, Stanford, and leading AI journals.</p>
                <p><strong>Writing Phase:</strong> Created comprehensive analysis covering machine learning advances, ethical considerations, and industry applications.</p>
                <p><strong>Editorial Phase:</strong> Polished content for clarity, fact-checked all claims, and ensured balanced perspective.</p>
                <p><em>Final Article:</em> A 2,500-word piece exploring how AI is reshaping industries, the importance of responsible development, and predictions for the next decade. The article synthesizes insights from academic research, industry reports, and expert interviews to provide readers with a comprehensive understanding of AI's current state and future trajectory.</p>
            `,
            'Climate': `
                <h4>Climate Change: Current Challenges and Innovative Solutions</h4>
                <p><strong>Research Phase:</strong> Analyzed latest IPCC reports, peer-reviewed studies, and policy documents.</p>
                <p><strong>Writing Phase:</strong> Developed narrative connecting scientific evidence with practical solutions.</p>
                <p><strong>Editorial Phase:</strong> Refined technical language for general audience while maintaining scientific accuracy.</p>
                <p><em>Final Article:</em> A compelling 2,200-word exploration of climate science, featuring breakthrough technologies in renewable energy, carbon capture, and sustainable agriculture. The piece balances urgency with optimism, highlighting both challenges and promising developments in the fight against climate change.</p>
            `,
            'Space': `
                <h4>Space Exploration: The New Frontier of Human Achievement</h4>
                <p><strong>Research Phase:</strong> Compiled data from NASA, ESA, SpaceX, and recent space missions.</p>
                <p><strong>Writing Phase:</strong> Crafted engaging narrative about humanity's journey to the stars.</p>
                <p><strong>Editorial Phase:</strong> Enhanced storytelling elements while ensuring technical accuracy.</p>
                <p><em>Final Article:</em> An inspiring 2,800-word journey through recent space achievements, from Mars rovers to private space companies. The article explores how space exploration drives innovation, international cooperation, and our understanding of the universe.</p>
            `,
            'Energy': `
                <h4>Renewable Energy Revolution: Powering a Sustainable Future</h4>
                <p><strong>Research Phase:</strong> Gathered data on solar, wind, hydro, and emerging energy technologies.</p>
                <p><strong>Writing Phase:</strong> Structured analysis of costs, benefits, and implementation challenges.</p>
                <p><strong>Editorial Phase:</strong> Balanced technical details with accessible explanations and real-world examples.</p>
                <p><em>Final Article:</em> A comprehensive 2,400-word analysis of renewable energy trends, featuring case studies from leading countries, breakthrough technologies, and economic implications of the clean energy transition.</p>
            `
        };

        return articles[type] || `
            <h4>${topic}: A Comprehensive Analysis</h4>
            <p><strong>Research Phase:</strong> Conducted thorough investigation using multiple authoritative sources.</p>
            <p><strong>Writing Phase:</strong> Developed well-structured content with clear arguments and supporting evidence.</p>
            <p><strong>Editorial Phase:</strong> Refined for clarity, accuracy, and engaging presentation.</p>
            <p><em>Final Article:</em> A professional-quality piece that synthesizes complex information into an accessible and informative article about ${topic}.</p>
        `;
    }

    // Collaborate Pattern Implementation
    setupCollaboratePattern() {
        console.log("Setting up Collaborate Pattern...");
        const questionButtons = document.querySelectorAll('.collaborate-question-btn');
        const collaborateInput = document.getElementById('collaborate-input');
        const collaborateSubmit = document.getElementById('collaborate-submit');

        console.log(`Found ${questionButtons.length} question buttons for collaborate pattern`);
        
        // Force reinitialize event listeners
        questionButtons.forEach(btn => {
            // Remove any existing click listeners
            const newBtn = btn.cloneNode(true);
            if (btn.parentNode) {
                btn.parentNode.replaceChild(newBtn, btn);
            }
            
            // Add click listener
            newBtn.addEventListener('click', () => {
                const question = newBtn.dataset.question;
                console.log(`Collaborate button clicked with question: ${question}`);
                this.demonstrateCollaboration(question);
            });
        });

        if (collaborateInput && collaborateSubmit) {
            collaborateSubmit.addEventListener('click', () => {
                const question = collaborateInput.value.trim();
                if (question) {
                    this.demonstrateCollaboration(question);
                    collaborateInput.value = '';
                }
            });

            collaborateInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    collaborateSubmit.click();
                }
            });
        }
    }

    async demonstrateCollaboration(question) {
        const panelists = ['reddit-researcher', 'academic-researcher', 'twitter-researcher'];
        const resultBox = document.getElementById('collaborate-result');
        const synthesisProgress = document.getElementById('synthesis-progress');

        // Reset all panelists
        panelists.forEach(id => {
            const card = document.getElementById(id);
            const indicator = card.querySelector('.thinking-indicator');
            const preview = card.querySelector('.response-preview');
            
            card.classList.remove('thinking', 'completed');
            indicator.classList.remove('active');
            preview.classList.remove('show');
            preview.textContent = '';
        });

        synthesisProgress.style.width = '0%';
        resultBox.textContent = 'Panel members are researching...';
        resultBox.className = 'result-box';

        // Start all panelists thinking simultaneously
        panelists.forEach(id => {
            const card = document.getElementById(id);
            const indicator = card.querySelector('.thinking-indicator');
            
            card.classList.add('thinking');
            indicator.classList.add('active');
        });

        // Simulate concurrent research with staggered completion
        const responses = this.generateCollaborativeResponses(question);
        const completionTimes = [2000, 2500, 3000, 3500]; // Staggered completion

        for (let i = 0; i < panelists.length; i++) {
            setTimeout(async () => {
                const card = document.getElementById(panelists[i]);
                const indicator = card.querySelector('.thinking-indicator');
                const preview = card.querySelector('.response-preview');
                
                // Complete this panelist's research
                card.classList.remove('thinking');
                card.classList.add('completed');
                indicator.classList.remove('active');
                
                preview.textContent = responses[i];
                preview.classList.add('show');
                
                // Update synthesis progress
                const progress = ((i + 1) / panelists.length) * 100;
                synthesisProgress.style.width = `${progress}%`;
                
                // If all completed, show final synthesis
                if (i === panelists.length - 1) {
                    setTimeout(() => {
                        const finalResponse = this.synthesizeResponses(question, responses);
                        resultBox.innerHTML = finalResponse;
                        resultBox.className = 'result-box success';
                    }, 1000);
                }
            }, completionTimes[i]);
        }
    }

    generateCollaborativeResponses(question) {
        const responseTemplates = {
            'Provide a complete vacation analysis for Kyoto, Japan - Historic city with temples and traditional culture': [
                '💰 Budget Advisor: Moderate to expensive destination. Flight costs from major cities range $800-1,500. Accommodations $100-300/night. Food $30-70/person/day. Public transportation efficient and affordable at $10/day. Save money with city passes and eating at local spots.',
                '🎭 Activities Recommender: Must-visit Fushimi Inari Shrine, Kinkaku-ji Temple, Arashiyama Bamboo Grove, and Gion District. Experience tea ceremony, traditional Japanese gardens, and seasonal festivals. Consider day trips to Nara or Osaka. Outstanding variety of cultural experiences.',
                '🧠 Local Expert: Best time to visit March-May (cherry blossoms) or October-November (autumn colors). Very crowded during these periods. Respectful dress required at temples. Learn basic Japanese phrases. Public transportation excellent with IC cards recommended. Tipping not customary.'
            ],
            'Provide a complete vacation analysis for Paris, France - City of lights and culture': [
                '💰 Budget Advisor: High-cost destination. Flight costs from major cities range $600-1,200. Accommodations $150-400/night. Food $40-100/person/day. Public transportation excellent at $15/day with visitor passes. Save by visiting museums on free days and staying outside central arrondissements.',
                '🎭 Activities Recommender: Must-see Eiffel Tower, Louvre Museum, Notre-Dame Cathedral, and Montmartre. Experience Seine River cruise, café culture, and local markets. Hidden gems include Canal Saint-Martin and covered passages. Outstanding variety of cultural and culinary experiences.',
                '🧠 Local Expert: Best time to visit April-June or September-October for mild weather and fewer tourists. Summer is crowded with long lines. Basic French phrases appreciated. Metro system comprehensive but watch for pickpockets. Most attractions closed on certain weekdays, plan accordingly.'
            ],
            'Provide a complete vacation analysis for Hawaii - Tropical island paradise': [
                '💰 Budget Advisor: Expensive destination. Flight costs from mainland US range $400-1,000. Accommodations $200-500/night. Food $50-100/person/day. Car rental recommended at $50-100/day. Save with condo rentals with kitchens and shopping at local markets instead of resort dining.',
                '🎭 Activities Recommender: Must-experience beaches like Waikiki, North Shore, and Kaanapali. Activities include snorkeling at Molokini Crater, hiking Diamond Head, Road to Hana drive, and authentic luaus. Adventure options include surfing lessons, whale watching, and volcano tours.',
                '🧠 Local Expert: Best time to visit April-May or September-October for great weather and fewer crowds. December-March offers whale watching but can bring rain. Respect local customs and environment. Island hopping requires planning. Sunscreen must be reef-safe by law.'
            ],
            'Provide a complete vacation analysis for New York City - Urban adventure destination': [
                '💰 Budget Advisor: Very expensive destination. Flight costs vary widely $200-1,000. Accommodations $200-500/night. Food $50-150/person/day. Subway excellent at $33 for weekly unlimited pass. Save with tourist passes, free museum days, and staying in outer boroughs like Queens or Brooklyn.',
                '🎭 Activities Recommender: Must-visit Times Square, Central Park, Empire State Building, and Metropolitan Museum of Art. Experience Broadway shows, diverse neighborhoods, and ferry to Statue of Liberty. Hidden gems include High Line, Roosevelt Island Tramway, and food markets.',
                '🧠 Local Expert: Best times to visit May-June or September-October for pleasant weather. December offers holiday magic but cold temperatures. Summer is hot and humid. Walk fast, stand right on escalators. Tipping expected (18-20%). Subway runs 24/7 but weekend service changes common.'
            ]
        };

        return responseTemplates[question] || [
            '💰 Budget Advisor: Analysis of typical costs including flights, accommodations, food, activities, and local transportation. Recommendations for saving money while enjoying the destination.',
            '🎭 Activities Recommender: Suggestions for must-see attractions, experiences, and hidden gems. Overview of available activities and their appeal to different interests.',
            '🧠 Local Expert: Insights on best times to visit, local customs, transportation tips, and common tourist mistakes to avoid. Practical advice for an authentic experience.'
        ];
    }

    synthesizeResponses(question, responses) {
        const syntheses = {
            'Provide a complete vacation analysis for Kyoto, Japan - Historic city with temples and traditional culture': `
                <h4>✈️ Your Personalized Kyoto Vacation Plan</h4>
                <p><strong>Overall Rating:</strong> Perfect Match for cultural exploration and authentic Japanese experience</p>
                <div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
                    <div style="flex: 1; min-width: 150px; margin-right: 10px;">
                        <p><strong>Best Time to Visit:</strong> Late March-April (cherry blossoms) or November (autumn colors)</p>
                        <p><strong>Ideal Trip Duration:</strong> 5-7 days</p>
                    </div>
                    <div style="flex: 1; min-width: 150px;">
                        <p><strong>Budget Expectations:</strong> $2,500-4,000 per person for one week</p>
                        <p><strong>Crowd Levels:</strong> Moderate to high during peak seasons</p>
                    </div>
                </div>
                <p><strong>Must-Do Experiences:</strong></p>
                <ul>
                    <li>Fushimi Inari Shrine (iconic red gates)</li>
                    <li>Arashiyama Bamboo Grove (early morning to avoid crowds)</li>
                    <li>Traditional tea ceremony experience</li>
                    <li>Day trip to Nara to see friendly deer and temples</li>
                    <li>Gion district for geisha spotting and traditional atmosphere</li>
                </ul>
                <p><strong>Pro Tips:</strong> Purchase a 1-day bus pass for efficient sightseeing. Respect temple dress codes. Consider staying in a ryokan for at least one night for an authentic experience. Use IC cards for convenient public transportation.</p>
            `,
            'Provide a complete vacation analysis for Paris, France - City of lights and culture': `
                <h4>✈️ Your Personalized Paris Vacation Plan</h4>
                <p><strong>Overall Rating:</strong> Perfect Match for art lovers, foodies, and romantics</p>
                <div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
                    <div style="flex: 1; min-width: 150px; margin-right: 10px;">
                        <p><strong>Best Time to Visit:</strong> April-June or September-October</p>
                        <p><strong>Ideal Trip Duration:</strong> 5-7 days</p>
                    </div>
                    <div style="flex: 1; min-width: 150px;">
                        <p><strong>Budget Expectations:</strong> $3,000-4,500 per person for one week</p>
                        <p><strong>Crowd Levels:</strong> High year-round, extreme in summer</p>
                    </div>
                </div>
                <p><strong>Must-Do Experiences:</strong></p>
                <ul>
                    <li>Louvre Museum (book tickets online in advance)</li>
                    <li>Eiffel Tower (consider dinner reservation or summit visit)</li>
                    <li>Seine River cruise at sunset</li>
                    <li>Explore Montmartre neighborhood and Sacré-Cœur</li>
                    <li>Morning visit to a local bakery and café experience</li>
                </ul>
                <p><strong>Pro Tips:</strong> Purchase a Paris Museum Pass for best value. Learn basic French phrases. Metro is fastest transportation but walking offers the best views. Stay in Le Marais or Saint-Germain-des-Prés neighborhoods for central location with character.</p>
            `,
            'Provide a complete vacation analysis for Hawaii - Tropical island paradise': `
                <h4>✈️ Your Personalized Hawaii Vacation Plan</h4>
                <p><strong>Overall Rating:</strong> Perfect Match for beach lovers, outdoor enthusiasts, and relaxation seekers</p>
                <div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
                    <div style="flex: 1; min-width: 150px; margin-right: 10px;">
                        <p><strong>Best Time to Visit:</strong> April-May or September-October</p>
                        <p><strong>Ideal Trip Duration:</strong> 7-10 days</p>
                    </div>
                    <div style="flex: 1; min-width: 150px;">
                        <p><strong>Budget Expectations:</strong> $3,500-5,000 per person for one week</p>
                        <p><strong>Crowd Levels:</strong> Highest during summer and Christmas season</p>
                    </div>
                </div>
                <p><strong>Must-Do Experiences:</strong></p>
                <ul>
                    <li>Snorkeling at Molokini Crater or Hanauma Bay</li>
                    <li>Road to Hana scenic drive (Maui)</li>
                    <li>Authentic luau experience</li>
                    <li>Hawaii Volcanoes National Park (Big Island)</li>
                    <li>North Shore beaches for surfing or spectating (Oahu)</li>
                </ul>
                <p><strong>Pro Tips:</strong> Consider island hopping but don't try to see too many islands in one trip. Rent a car for flexibility. Condo rentals offer best value for longer stays. Use reef-safe sunscreen only. Respect local customs and environment.</p>
            `
        };

        return syntheses[question] || `
            <h4>✈️ Your Personalized Vacation Plan</h4>
            <p><strong>Destination Analysis Complete!</strong></p>
            <div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
                <div style="flex: 1; min-width: 150px; margin-right: 10px;">
                    <p><strong>Budget Considerations:</strong></p>
                    <p>${responses[0].split(':')[1] || 'Analysis of costs including accommodations, food, and activities.'}</p>
                </div>
                <div style="flex: 1; min-width: 150px;">
                    <p><strong>Recommended Activities:</strong></p>
                    <p>${responses[1].split(':')[1] || 'Suggestions for attractions and experiences.'}</p>
                </div>
            </div>
            <p><strong>Local Insights:</strong></p>
            <p>${responses[2].split(':')[1] || 'Tips on timing, customs, and local knowledge.'}</p>
            <p><strong>Vacation Recommendation:</strong> Based on our analysis, this destination offers a compelling mix of experiences, with considerations for your budget and preferences. Plan according to the best timing and don't miss the top recommended activities!</p>
        `;
    }

    // Competitive Pattern Implementation
    setupCompetitivePattern() {
        const taskButtons = document.querySelectorAll('.competitive-task-btn');
        const competitiveInput = document.getElementById('competitive-input');
        const competitiveSubmit = document.getElementById('competitive-submit');
        const complexitySelect = document.getElementById('task-complexity');

        taskButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const task = btn.dataset.task;
                const complexity = btn.dataset.complexity;
                this.demonstrateCompetition(task, complexity);
            });
        });

        competitiveSubmit.addEventListener('click', () => {
            const task = competitiveInput.value.trim();
            const complexity = complexitySelect.value;
            if (task) {
                this.demonstrateCompetition(task, complexity);
                competitiveInput.value = '';
            }
        });

        competitiveInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                competitiveSubmit.click();
            }
        });
    }

    async demonstrateCompetition(task, complexity) {
        const bidders = ['freelancer-1', 'freelancer-2', 'freelancer-3', 'freelancer-4'];
        const currentTaskDiv = document.getElementById('current-task');
        const winnerDiv = document.getElementById('auction-winner');

        // Reset all bidders
        bidders.forEach(id => {
            const card = document.getElementById(id);
            card.classList.remove('bidding', 'winner');
            
            const status = card.querySelector('.bid-status');
            status.textContent = 'Preparing bid...';
            status.style.background = '#ffc107';
            status.style.color = '#856404';
        });

        // Show current task
        currentTaskDiv.innerHTML = `<strong>${task}</strong><br><small>Complexity: ${complexity}</small>`;
        winnerDiv.textContent = 'Auction in progress...';
        winnerDiv.className = 'winner-card';

        // Generate bids based on complexity and bidder characteristics
        const bids = this.generateBids(complexity);
        
        // Start bidding animation
        bidders.forEach((id, index) => {
            const card = document.getElementById(id);
            card.classList.add('bidding');
            
            setTimeout(() => {
                const bid = bids[index];
                const priceSpan = card.querySelector('.bid-price');
                const timeSpan = card.querySelector('.bid-time');
                const status = card.querySelector('.bid-status');
                
                priceSpan.textContent = bid.price;
                timeSpan.textContent = bid.time;
                
                status.textContent = 'Bid submitted';
                status.style.background = '#28a745';
                status.style.color = 'white';
                
                card.classList.remove('bidding');
            }, (index + 1) * 800);
        });

        // Determine winner after all bids are in
        setTimeout(() => {
            const winnerIndex = this.selectWinner(bids);
            const winnerCard = document.getElementById(bidders[winnerIndex]);
            const winnerBid = bids[winnerIndex];
            
            winnerCard.classList.add('winner');
            
            const winnerInfo = this.getBidderInfo(bidders[winnerIndex]);
            winnerDiv.innerHTML = `
                <h4>🏆 Auction Winner: ${winnerInfo.name}</h4>
                <div style="display: flex; justify-content: space-around; margin: 1rem 0;">
                    <div><strong>Price:</strong> $${winnerBid.price}</div>
                    <div><strong>Time:</strong> ${winnerBid.time} hours</div>
                    <div><strong>Quality:</strong> ${winnerInfo.quality}</div>
                </div>
                <p><strong>Why they won:</strong> ${winnerBid.reason}</p>
                <p><em>Task assigned and work begins immediately!</em></p>
            `;
            winnerDiv.className = 'winner-card';
        }, 4000);
    }

    generateBids(complexity) {
        const baseRates = {
            'low': { min: 50, max: 150, timeMin: 2, timeMax: 8 },
            'medium': { min: 150, max: 400, timeMin: 8, timeMax: 24 },
            'high': { min: 400, max: 1200, timeMin: 24, timeMax: 120 }
        };

        const rates = baseRates[complexity] || baseRates['medium'];
        
        // Bidder characteristics
        const bidderProfiles = [
            { name: 'Expert Freelancer', priceMultiplier: 1.2, timeMultiplier: 0.8, quality: 5 },
            { name: 'Budget Specialist', priceMultiplier: 0.6, timeMultiplier: 1.3, quality: 3 },
            { name: 'Speed Demon', priceMultiplier: 1.0, timeMultiplier: 0.5, quality: 4 },
            { name: 'Premium Pro', priceMultiplier: 1.5, timeMultiplier: 0.9, quality: 5 }
        ];

        return bidderProfiles.map(profile => {
            const basePrice = rates.min + Math.random() * (rates.max - rates.min);
            const baseTime = rates.timeMin + Math.random() * (rates.timeMax - rates.timeMin);
            
            const price = Math.round(basePrice * profile.priceMultiplier);
            const time = Math.round(baseTime * profile.timeMultiplier);
            
            return {
                price,
                time,
                quality: profile.quality,
                score: this.calculateBidScore(price, time, profile.quality),
                reason: this.getBidReason(profile, price, time)
            };
        });
    }

    calculateBidScore(price, time, quality) {
        // Lower price and time are better, higher quality is better
        // Normalize and weight the factors
        const priceScore = 1000 / price; // Lower price = higher score
        const timeScore = 100 / time;    // Lower time = higher score
        const qualityScore = quality * 20; // Higher quality = higher score
        
        return priceScore + timeScore + qualityScore;
    }

    selectWinner(bids) {
        // Find the bid with the highest score
        let bestScore = -1;
        let winnerIndex = 0;
        
        bids.forEach((bid, index) => {
            if (bid.score > bestScore) {
                bestScore = bid.score;
                winnerIndex = index;
            }
        });
        
        return winnerIndex;
    }

    getBidderInfo(bidderId) {
        const info = {
            'freelancer-1': { name: 'Expert Freelancer', quality: '★★★★★' },
            'freelancer-2': { name: 'Budget Specialist', quality: '★★★☆☆' },
            'freelancer-3': { name: 'Speed Demon', quality: '★★★★☆' },
            'freelancer-4': { name: 'Premium Pro', quality: '★★★★★' }
        };
        return info[bidderId];
    }

    getBidReason(profile, price, time) {
        const reasons = {
            'Expert Freelancer': `Best balance of quality and efficiency at $${price} in ${time} hours`,
            'Budget Specialist': `Most cost-effective option at $${price}, though takes ${time} hours`,
            'Speed Demon': `Fastest delivery in just ${time} hours for $${price}`,
            'Premium Pro': `Premium quality guaranteed for $${price} in ${time} hours`
        };
        return reasons[profile.name] || `Competitive bid of $${price} with ${time} hour delivery`;
    }

    // Utility function for delays
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Loop Pattern Implementation
    setupLoopPattern() {
        console.log("Setting up Loop Pattern...");
        const topicButtons = document.querySelectorAll('#loop-pattern .loop-topic-btn');
        const loopInput = document.getElementById('loop-input');
        const loopSubmit = document.getElementById('loop-submit');

        topicButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const topic = btn.dataset.topic;
                this.demonstrateLoop(topic);
            });
        });

        if (loopInput && loopSubmit) {
            loopInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    loopSubmit.click();
                }
            });
            
            loopSubmit.addEventListener('click', () => {
                const topic = loopInput.value.trim();
                if (topic) {
                    this.demonstrateLoop(topic);
                    loopInput.value = '';
                }
            });
        }
    }

    async demonstrateLoop(topic) {
        const steps = ['draft', 'review', 'improve'];
        const stepCards = document.querySelectorAll('#loop-pattern .loop-step-card, .slide-body .loop-step-card');
        const resultBox = document.getElementById('loop-result') || document.querySelector('[id="loop-result"]');
        const qualityProgress = document.getElementById('quality-progress') || document.querySelector('[id="quality-progress"]');
        const iterationCount = document.getElementById('iteration-count') || document.querySelector('[id="iteration-count"]');
        
        if (!stepCards.length || !resultBox || !qualityProgress || !iterationCount) {
            console.warn('Loop pattern elements not found');
            return;
        }
        
        // Reset all steps
        stepCards.forEach(card => {
            card.classList.remove('active');
            const progressBar = card.querySelector('.progress');
            if (progressBar) progressBar.style.width = '0%';
        });
        
        qualityProgress.style.width = '0%';
        resultBox.textContent = 'Creating essay...';
        resultBox.className = 'result-box';
        
        let quality = 0;
        let iterations = 0;
        const qualityThreshold = 85;
        const draftProgress = document.getElementById('draft-progress');
        
        // Initial Draft is created only once at the beginning
        // Execute draft step
        const draftCard = document.getElementById('draft-step');
        if (draftCard && draftProgress) {
            draftCard.classList.add('active');
            
            // Animate draft progress
            let progressValue = 0;
            const progressInterval = setInterval(() => {
                progressValue += 10;
                draftProgress.style.width = `${progressValue}%`;
                
                if (progressValue >= 100) {
                    clearInterval(progressInterval);
                }
            }, 100);
            
            await this.delay(1000);
            draftCard.classList.remove('active');
        }
        
        // Loop until quality threshold is met
        while (quality < qualityThreshold) {
            iterations++;
            iterationCount.textContent = `Iteration: ${iterations}`;
            
            // Execute only review and improve steps in subsequent iterations
            for (let i = 1; i < steps.length; i++) { // Start from index 1 to skip 'draft'
                const stepCard = document.getElementById(`${steps[i]}-step`);
                const progress = document.getElementById(`${steps[i]}-progress`);
                
                if (stepCard && progress) {
                    stepCard.classList.add('active');
                    
                    // Animate progress (reset to 0 first for review and improve steps)
                    progress.style.width = '0%';
                    let progressValue = 0;
                    const progressInterval = setInterval(() => {
                        progressValue += 10;
                        progress.style.width = `${progressValue}%`;
                        
                        if (progressValue >= 100) {
                            clearInterval(progressInterval);
                        }
                    }, 100);
                    
                    await this.delay(1000);
                    stepCard.classList.remove('active');
                }
            }
            
            // Increase quality with each iteration
            quality += Math.floor(Math.random() * 30) + 10;
            quality = Math.min(quality, 100);
            
            // Update quality meter
            qualityProgress.style.width = `${quality}%`;
            
            // Wait a moment before next iteration
            await this.delay(500);
        }
        
        // Show final essay
        resultBox.innerHTML = this.generateEssay(topic.toLowerCase(), topic, iterations);
        resultBox.className = 'result-box success';
    }

    generateEssay(type, topic, iterations) {
        const essays = {
            'climate change': `
                <h4>Climate Change: Challenges and Solutions</h4>
                <p><em>Final Version (Iteration ${iterations})</em></p>
                <p>Climate change represents one of the most significant challenges facing humanity in the 21st century. Rising global temperatures, changing precipitation patterns, and increasing frequency of extreme weather events are all symptoms of this growing crisis.</p>
                <p>The scientific consensus is clear: human activities, particularly the burning of fossil fuels and deforestation, are the primary drivers of climate change. According to the Intergovernmental Panel on Climate Change (IPCC), global temperatures have already increased by approximately 1.1°C above pre-industrial levels.</p>
                <p>Solutions to this crisis will require coordinated action at multiple levels:</p>
                <ul>
                    <li><strong>Policy Changes</strong>: Implementing carbon pricing, renewable energy incentives, and international agreements like the Paris Accord.</li>
                    <li><strong>Technological Innovation</strong>: Developing and deploying renewable energy sources, carbon capture technology, and energy-efficient systems.</li>
                    <li><strong>Individual Action</strong>: Reducing personal carbon footprints through sustainable consumption, transportation choices, and energy use.</li>
                </ul>
                <p>While the challenges are significant, there is reason for hope. Renewable energy costs continue to fall, public awareness is growing, and many countries and corporations are making commitments to carbon neutrality.</p>
                <p>The path forward requires both mitigation (reducing emissions) and adaptation (preparing for inevitable changes). By embracing this dual approach, we can work toward a more sustainable and resilient future for all.</p>
            `,
            'artificial intelligence ethics': `
                <h4>Artificial Intelligence Ethics: Balancing Progress and Responsibility</h4>
                <p><em>Final Version (Iteration ${iterations})</em></p>
                <p>As artificial intelligence continues to advance at a remarkable pace, important ethical questions have emerged about how these powerful technologies should be developed and deployed in society.</p>
                <p>AI systems are increasingly making or influencing decisions that affect human lives—from loan approvals to medical diagnoses to criminal sentencing recommendations. This growing influence raises significant concerns about fairness, transparency, privacy, and accountability.</p>
                <p>Key ethical challenges in AI include:</p>
                <ul>
                    <li><strong>Bias and Fairness</strong>: AI systems can perpetuate or amplify existing societal biases when trained on biased data.</li>
                    <li><strong>Privacy</strong>: Advanced AI enables unprecedented surveillance capabilities and personal data analysis.</li>
                    <li><strong>Autonomy</strong>: As AI makes more decisions, questions arise about maintaining human agency and control.</li>
                    <li><strong>Accountability</strong>: Determining responsibility when AI systems cause harm remains complex.</li>
                </ul>
                <p>Addressing these challenges requires a multifaceted approach involving technical solutions (like bias testing and explainable AI), policy frameworks (such as regulation and oversight), and broader societal engagement about AI's role in our future.</p>
                <p>By proactively addressing ethical considerations while fostering innovation, we can work toward AI systems that augment human capabilities while respecting fundamental values and rights.</p>
            `,
            'space exploration': `
                <h4>The New Era of Space Exploration</h4>
                <p><em>Final Version (Iteration ${iterations})</em></p>
                <p>We are witnessing a renaissance in space exploration, characterized by the entrance of private companies, international cooperation, and ambitious new missions to explore our solar system and beyond.</p>
                <p>After decades of space activities dominated by government agencies like NASA and Roscosmos, companies like SpaceX, Blue Origin, and others are transforming access to space through innovations like reusable rockets, dramatically reducing launch costs and increasing mission frequency.</p>
                <p>Current and upcoming space initiatives include:</p>
                <ul>
                    <li><strong>Mars Exploration</strong>: Multiple missions are underway to study the Red Planet, with human missions being planned for the 2030s.</li>
                    <li><strong>Lunar Return</strong>: The Artemis program aims to return humans to the Moon and establish a sustainable presence.</li>
                    <li><strong>Space Tourism</strong>: Companies are developing capabilities to take civilians to space, from suborbital flights to orbital stays.</li>
                    <li><strong>Asteroid Mining</strong>: Efforts to extract valuable resources from near-Earth asteroids are advancing.</li>
                </ul>
                <p>Beyond the scientific and commercial benefits, space exploration continues to inspire humanity and drive technological innovation with applications on Earth. Technologies initially developed for space missions have led to advances in medicine, communications, materials science, and computing.</p>
                <p>As we look to the stars, the question is no longer if humans will become a multiplanetary species, but when and how this transition will unfold.</p>
            `,
            'renewable energy': `
                <h4>Renewable Energy: Powering a Sustainable Future</h4>
                <p><em>Final Version (Iteration ${iterations})</em></p>
                <p>The transition to renewable energy represents one of the most significant technological and economic shifts of the 21st century. As climate concerns grow and renewable technologies become increasingly cost-competitive, the global energy landscape is undergoing a profound transformation.</p>
                <p>Renewable energy sources—including solar, wind, hydroelectric, geothermal, and bioenergy—now account for an increasing share of global electricity generation. In many regions, new renewable installations are now cheaper than new fossil fuel power plants.</p>
                <p>Key developments in the renewable energy sector include:</p>
                <ul>
                    <li><strong>Technological Advances</strong>: Continuous improvements in efficiency and manufacturing have dramatically reduced costs, particularly for solar photovoltaics and wind turbines.</li>
                    <li><strong>Energy Storage Solutions</strong>: Battery technology is advancing rapidly, addressing the intermittency challenge of solar and wind power.</li>
                    <li><strong>Grid Modernization</strong>: Smart grid technologies are enabling better integration of distributed renewable resources.</li>
                    <li><strong>Policy Support</strong>: Many countries have established ambitious renewable energy targets and supportive policies.</li>
                </ul>
                <p>Despite this progress, challenges remain, including the need for further cost reductions in energy storage, grid integration issues, and ensuring a just transition for communities and workers currently dependent on fossil fuel industries.</p>
                <p>The renewable energy revolution offers a path to address climate change while creating economic opportunities and improving energy access globally.</p>
            `,
        };
        
        const lowercaseTopic = topic.toLowerCase();
        
        return essays[lowercaseTopic] || `
            <h4>${topic}: A Comprehensive Analysis</h4>
            <p><em>Final Version (Iteration ${iterations})</em></p>
            <p>This essay explores the multifaceted topic of ${topic}, examining its key aspects, current developments, and future implications. Through careful analysis and research, it provides a balanced perspective on this important subject.</p>
            <p>The exploration of ${topic} reveals several important considerations:</p>
            <ul>
                <li><strong>Historical Context</strong>: Understanding the evolution of ${topic} over time provides essential insights into its current state.</li>
                <li><strong>Current Landscape</strong>: Today's developments in ${topic} are shaped by technological, social, and economic factors working in concert.</li>
                <li><strong>Future Directions</strong>: Emerging trends suggest several possible trajectories for ${topic} in the coming years.</li>
                <li><strong>Ethical Considerations</strong>: As with many complex topics, ${topic} raises important questions about values, priorities, and responsibilities.</li>
            </ul>
            <p>By examining these dimensions, we gain a more comprehensive understanding of ${topic} and its significance in our world today. This analysis suggests both challenges and opportunities that merit further exploration and engagement.</p>
            <p>As our understanding continues to evolve, ongoing research, dialogue, and critical thinking will be essential to navigating the complexities of ${topic} and realizing its potential benefits while mitigating potential risks.</p>
        `;
    }
 
    generateWeatherData(location) {
        const weatherData = {
            'New York': {
                temperature: Math.floor(Math.random() * 10) + 20, // 20-30°C
                precipitation: Math.floor(Math.random() * 10),    // 0-10mm
                wind: Math.floor(Math.random() * 15) + 5,        // 5-20km/h
                shortForecast: 'Partly Cloudy',
                detailedForecast: 'Partly cloudy conditions with a slight chance of afternoon showers. Temperatures will remain warm with moderate humidity. Evening will bring clearer skies and cooler temperatures.'
            },
            'London': {
                temperature: Math.floor(Math.random() * 8) + 15,  // 15-23°C
                precipitation: Math.floor(Math.random() * 15) + 5, // 5-20mm
                wind: Math.floor(Math.random() * 20) + 10,       // 10-30km/h
                shortForecast: 'Rainy',
                detailedForecast: 'Intermittent rain throughout the day with occasional breaks in cloud cover. Wind gusts may reach 30km/h in the afternoon. Umbrella recommended for outdoor activities.'
            },
            'Tokyo': {
                temperature: Math.floor(Math.random() * 10) + 25, // 25-35°C
                precipitation: Math.floor(Math.random() * 20),    // 0-20mm
                wind: Math.floor(Math.random() * 10) + 5,        // 5-15km/h
                shortForecast: 'Humid & Sunny',
                detailedForecast: 'Mostly sunny with high humidity levels. There is a small chance of isolated thunderstorms in the late afternoon. Temperatures will remain high throughout the day with minimal wind.'
            },
            'Sydney': {
                temperature: Math.floor(Math.random() * 10) + 18, // 18-28°C
                precipitation: Math.floor(Math.random() * 5),     // 0-5mm
                wind: Math.floor(Math.random() * 25) + 10,       // 10-35km/h
                shortForecast: 'Clear & Windy',
                detailedForecast: 'Clear skies with strong coastal winds. Perfect beach conditions but be aware of high UV index. Evening temperatures will drop significantly, so bring an extra layer if staying out late.'
            }
        };
        
        return weatherData[location] || {
            temperature: Math.floor(Math.random() * 15) + 15, // 15-30°C
            precipitation: Math.floor(Math.random() * 15),    // 0-15mm
            wind: Math.floor(Math.random() * 20) + 5,        // 5-25km/h
            shortForecast: 'Variable Conditions',
            detailedForecast: `Current conditions in ${location} show variable weather patterns. Please check local forecasts for more accurate information as conditions may change rapidly.`
        };
    }
    
    // Network Pattern Implementation
    setupNetworkPattern() {
        console.log("Setting up Network Pattern...");
        const partyButtons = document.querySelectorAll('#network-pattern .network-party-btn');
        const networkInput = document.getElementById('network-input');
        const networkSubmit = document.getElementById('network-submit');
        
        // Draw network connections
        this.drawNetworkConnections();

        partyButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const party = btn.dataset.party;
                this.demonstrateNetwork(party);
            });
        });

        if (networkInput && networkSubmit) {
            networkInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    networkSubmit.click();
                }
            });
            
            networkSubmit.addEventListener('click', () => {
                const party = networkInput.value.trim();
                if (party) {
                    this.demonstrateNetwork(party);
                    networkInput.value = '';
                }
            });
        }
    }

    drawNetworkConnections() {
        const connectionsDiv = document.getElementById('network-connections');
        if (!connectionsDiv) {
            console.warn('Network connections container not found');
            return;
        }
        
        // Clear existing lines
        connectionsDiv.innerHTML = '';
        
        // Create SVG element
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        
        // Define node positions (will be updated later)
        const nodes = {
            'venue-agent': { x: 0, y: 0 },
            'budget-agent': { x: 0, y: 0 },
            'catering-agent': { x: 0, y: 0 },
            'entertainment-agent': { x: 0, y: 0 }
        };
        
        // Update node positions based on actual layout
        Object.keys(nodes).forEach(id => {
            const element = document.getElementById(id);
            if (!element) {
                console.warn(`Network node ${id} not found`);
                return;
            }
            
            const rect = element.getBoundingClientRect();
            const containerRect = connectionsDiv.getBoundingClientRect();
            
            nodes[id].x = rect.left - containerRect.left + rect.width / 2;
            nodes[id].y = rect.top - containerRect.top + rect.height / 2;
        });
        
        // Draw lines between all nodes
        const connections = [
            ['venue-agent', 'budget-agent'],
            ['venue-agent', 'catering-agent'],
            ['venue-agent', 'entertainment-agent'],
            ['budget-agent', 'catering-agent'],
            ['budget-agent', 'entertainment-agent'],
            ['catering-agent', 'entertainment-agent']
        ];
        
        connections.forEach(connection => {
            const [from, to] = connection;
            if (!nodes[from] || !nodes[to]) return;
            
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', nodes[from].x);
            line.setAttribute('y1', nodes[from].y);
            line.setAttribute('x2', nodes[to].x);
            line.setAttribute('y2', nodes[to].y);
            line.setAttribute('stroke', '#667eea');
            line.setAttribute('stroke-width', '2');
            line.setAttribute('stroke-dasharray', '5,5');
            
            svg.appendChild(line);
        });
        
        connectionsDiv.appendChild(svg);
    }

    async demonstrateNetwork(partyType) {
        // Get DOM elements
        const nodes = ['venue-agent', 'budget-agent', 'catering-agent', 'entertainment-agent'];
        const resultBox = document.getElementById('network-result');
        const messageBubble = document.getElementById('network-message');
        const networkGrid = document.querySelector('#network-pattern .network-grid') || 
                           document.querySelector('.slide-body .network-grid');
        
        if (!networkGrid || !messageBubble || !resultBox) {
            console.warn('Network pattern elements not found');
            return;
        }
        
        // Reset all nodes
        nodes.forEach(id => {
            const node = document.getElementById(id);
            if (!node) {
                console.warn(`Network node ${id} not found`);
                return;
            }
            
            node.classList.remove('active', 'sender', 'receiver');
            const preview = node.querySelector('.message-preview');
            if (preview) preview.textContent = '';
        });
        
        resultBox.textContent = 'Planning in progress...';
        resultBox.className = 'result-box';
        
        // Generate party planning messages
        const messages = this.generateNetworkMessages(partyType);
        
        // Add visual indicator for connections
        const connections = document.querySelector('#network-connections svg') || 
                           document.querySelector('.slide-body #network-connections svg');
        
        if (!connections) {
            console.warn('Network connections SVG not found');
        }
        
        // Simulate network communication
        for (let i = 0; i < messages.length; i++) {
            const { from, to, message } = messages[i];
            
            const fromNode = document.getElementById(from);
            const toNode = document.getElementById(to);
            
            if (!fromNode || !toNode) {
                console.warn(`Network node ${from} or ${to} not found`);
                continue;
            }
            
            // Highlight sender and receiver
            fromNode.classList.add('active', 'sender');
            toNode.classList.add('active', 'receiver');
            
            // Highlight the connection line between these nodes
            if (connections) {
                this.highlightConnectionBetween(from, to, connections);
            }
            
            // Calculate message path
            const networkRect = networkGrid.getBoundingClientRect();
            const fromRect = fromNode.getBoundingClientRect();
            const toRect = toNode.getBoundingClientRect();
            
            const fromX = fromRect.left - networkRect.left + (fromRect.width / 2);
            const fromY = fromRect.top - networkRect.top + (fromRect.height / 2);
            const toX = toRect.left - networkRect.left + (toRect.width / 2);
            const toY = toRect.top - networkRect.top + (toRect.height / 2);
            
            // Display message with sender prefix
            const fromName = fromNode.querySelector('h4').textContent;
            const formattedMessage = `<strong>${fromName}:</strong> ${message}`;
            
            // Position and show message
            messageBubble.style.setProperty('--move-x', `${toX - fromX}px`);
            messageBubble.style.setProperty('--move-y', `${toY - fromY}px`);
            messageBubble.style.left = `${fromX}px`;
            messageBubble.style.top = `${fromY}px`;
            messageBubble.innerHTML = formattedMessage;
            messageBubble.classList.add('show');
            
            // Wait for animation
            await this.delay(3000);
            messageBubble.classList.remove('show');
            
            // Update preview with the message
            const preview = toNode.querySelector('.message-preview');
            if (preview) {
                preview.innerHTML = formattedMessage;
                preview.style.backgroundColor = '#d1ecf1';
                setTimeout(() => {
                    preview.style.backgroundColor = '#f8f9fa';
                }, 1000);
            }
            
            // Reset highlights after delay
            await this.delay(1000);
            fromNode.classList.remove('sender');
            toNode.classList.remove('receiver');
            
            // Remove highlight from connection
            if (connections) {
                this.resetConnectionHighlights(connections);
            }
        }
        
        // Show final plan
        await this.delay(1000);
        resultBox.innerHTML = this.generatePartyPlan(partyType);
        resultBox.className = 'result-box success';
        
        // Reset all nodes
        nodes.forEach(id => {
            const node = document.getElementById(id);
            if (node) node.classList.remove('active');
        });
    }

    // Helper function to highlight connection between two nodes
    highlightConnectionBetween(fromId, toId, svgElement) {
        const lines = svgElement.querySelectorAll('line');
        lines.forEach(line => {
            // Get the IDs of nodes this line connects
            const x1 = parseFloat(line.getAttribute('x1'));
            const y1 = parseFloat(line.getAttribute('y1'));
            const x2 = parseFloat(line.getAttribute('x2'));
            const y2 = parseFloat(line.getAttribute('y2'));
            
            // Check if this line connects our nodes
            const fromNode = document.getElementById(fromId);
            const toNode = document.getElementById(toId);
            
            if (!fromNode || !toNode) return;
            
            const fromRect = fromNode.getBoundingClientRect();
            const toRect = toNode.getBoundingClientRect();
            const containerRect = svgElement.parentElement.getBoundingClientRect();
            
            const fromCenterX = fromRect.left - containerRect.left + fromRect.width/2;
            const fromCenterY = fromRect.top - containerRect.top + fromRect.height/2;
            const toCenterX = toRect.left - containerRect.left + toRect.width/2;
            const toCenterY = toRect.top - containerRect.top + toRect.height/2;
            
            // Simple check if this line approximately connects these nodes
            const connectsNodes = 
                (Math.abs(x1 - fromCenterX) < 50 && Math.abs(y1 - fromCenterY) < 50 &&
                Math.abs(x2 - toCenterX) < 50 && Math.abs(y2 - toCenterY) < 50) ||
                (Math.abs(x2 - fromCenterX) < 50 && Math.abs(y2 - fromCenterY) < 50 &&
                Math.abs(x1 - toCenterX) < 50 && Math.abs(y1 - toCenterY) < 50);
            
            if (connectsNodes) {
                // Highlight this connection
                line.setAttribute('stroke', '#28a745');
                line.setAttribute('stroke-width', '4');
                line.setAttribute('stroke-dasharray', '');
            }
        });
    }

    // Helper function to reset all connection highlights
    resetConnectionHighlights(svgElement) {
        const lines = svgElement.querySelectorAll('line');
        lines.forEach(line => {
            line.setAttribute('stroke', '#667eea');
            line.setAttribute('stroke-width', '2');
            line.setAttribute('stroke-dasharray', '5,5');
        });
    }

    generateNetworkMessages(partyType) {
        const messages = [
            {
                from: 'venue-agent',
                to: 'budget-agent',
                message: 'We need $5000 for the venue rental.'
            },
            {
                from: 'budget-agent',
                to: 'venue-agent',
                message: 'Too high. Max budget is $3500.'
            },
            {
                from: 'catering-agent',
                to: 'entertainment-agent',
                message: 'Food service at 7PM. Plan around it.'
            },
            {
                from: 'entertainment-agent',
                to: 'venue-agent',
                message: 'Need space for a 5-piece band.'
            },
            {
                from: 'venue-agent',
                to: 'catering-agent',
                message: 'Venue has kitchen facilities available.'
            },
            {
                from: 'budget-agent',
                to: 'catering-agent',
                message: 'Catering budget: $40/person max.'
            },
            {
                from: 'entertainment-agent',
                to: 'budget-agent',
                message: 'DJ option saves $800 vs. band.'
            },
            {
                from: 'catering-agent',
                to: 'budget-agent',
                message: 'Buffet option saves $1200 total.'
            },
        ];
        
        // Randomize and return a subset
        return this.shuffleArray(messages).slice(0, 6);
    }

    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    generatePartyPlan(partyType) {
        const plans = {
            'Birthday': `
                <h4>Birthday Party Plan</h4>
                <div style="display: flex; flex-wrap: wrap; justify-content: space-between; margin: 1rem 0;">
                    <div style="flex: 1; min-width: 200px; padding: 1rem;">
                        <strong>🏢 Venue:</strong>
                        <p>Urban Loft Space with outdoor terrace</p>
                        <p><em>Capacity: 40 people</em></p>
                    </div>
                    <div style="flex: 1; min-width: 200px; padding: 1rem;">
                        <strong>💰 Budget:</strong>
                        <p>Total: $2,800</p>
                        <p><em>$70 per person for 40 guests</em></p>
                    </div>
                </div>
                <div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
                    <div style="flex: 1; min-width: 200px; padding: 1rem;">
                        <strong>🍽️ Catering:</strong>
                        <p>Cocktail-style appetizers and dessert bar</p>
                        <p><em>Includes birthday cake and champagne toast</em></p>
                    </div>
                    <div style="flex: 1; min-width: 200px; padding: 1rem;">
                        <strong>🎵 Entertainment:</strong>
                        <p>DJ with personalized playlist</p>
                        <p><em>Plus photo booth with props</em></p>
                    </div>
                </div>
                <p style="margin-top: 1rem;"><strong>Consensus Decision:</strong> The team agreed on the DJ option and appetizer-style catering to stay within budget while maximizing the guest experience.</p>
            `,
            'Wedding': `
                <h4>Wedding Reception Plan</h4>
                <div style="display: flex; flex-wrap: wrap; justify-content: space-between; margin: 1rem 0;">
                    <div style="flex: 1; min-width: 200px; padding: 1rem;">
                        <strong>🏢 Venue:</strong>
                        <p>Riverview Garden Estate</p>
                        <p><em>Capacity: 120 people with indoor/outdoor options</em></p>
                    </div>
                    <div style="flex: 1; min-width: 200px; padding: 1rem;">
                        <strong>💰 Budget:</strong>
                        <p>Total: $18,500</p>
                        <p><em>$154 per person for 120 guests</em></p>
                    </div>
                </div>
                <div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
                    <div style="flex: 1; min-width: 200px; padding: 1rem;">
                        <strong>🍽️ Catering:</strong>
                        <p>Seated three-course dinner with wine service</p>
                        <p><em>Includes wedding cake and champagne toast</em></p>
                    </div>
                    <div style="flex: 1; min-width: 200px; padding: 1rem;">
                        <strong>🎵 Entertainment:</strong>
                        <p>String quartet for ceremony, 5-piece band for reception</p>
                        <p><em>Plus professional photographer and videographer</em></p>
                    </div>
                </div>
                <p style="margin-top: 1rem;"><strong>Consensus Decision:</strong> The team agreed to allocate more budget to the venue and entertainment while saving on floral arrangements through seasonal selections.</p>
            `,
            'Corporate': `
                <h4>Corporate Event Plan</h4>
                <div style="display: flex; flex-wrap: wrap; justify-content: space-between; margin: 1rem 0;">
                    <div style="flex: 1; min-width: 200px; padding: 1rem;">
                        <strong>🏢 Venue:</strong>
                        <p>Grand Conference Center - Executive Floor</p>
                        <p><em>Capacity: 80 people with A/V equipment included</em></p>
                    </div>
                    <div style="flex: 1; min-width: 200px; padding: 1rem;">
                        <strong>💰 Budget:</strong>
                        <p>Total: $12,000</p>
                        <p><em>$150 per person for 80 attendees</em></p>
                    </div>
                </div>
                <div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
                    <div style="flex: 1; min-width: 200px; padding: 1rem;">
                        <strong>🍽️ Catering:</strong>
                        <p>Premium buffet with international cuisine stations</p>
                        <p><em>Includes welcome drinks and networking hour</em></p>
                    </div>
                    <div style="flex: 1; min-width: 200px; padding: 1rem;">
                        <strong>🎵 Entertainment:</strong>
                        <p>Professional MC and background jazz trio</p>
                        <p><em>Plus interactive presentation technology</em></p>
                    </div>
                </div>
                <p style="margin-top: 1rem;"><strong>Consensus Decision:</strong> The team agreed to focus on professional presentation equipment and high-quality catering to create an impressive business atmosphere.</p>
            `,
            'Holiday': `
                <h4>Holiday Celebration Plan</h4>
                <div style="display: flex; flex-wrap: wrap; justify-content: space-between; margin: 1rem 0;">
                    <div style="flex: 1; min-width: 200px; padding: 1rem;">
                        <strong>🏢 Venue:</strong>
                        <p>Winter Wonderland Ballroom</p>
                        <p><em>Capacity: 100 people with festive decorations</em></p>
                    </div>
                    <div style="flex: 1; min-width: 200px; padding: 1rem;">
                        <strong>💰 Budget:</strong>
                        <p>Total: $9,500</p>
                        <p><em>$95 per person for 100 guests</em></p>
                    </div>
                </div>
                <div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
                    <div style="flex: 1; min-width: 200px; padding: 1rem;">
                        <strong>🍽️ Catering:</strong>
                        <p>Holiday-themed buffet with carving stations</p>
                        <p><em>Includes open bar and dessert table</em></p>
                    </div>
                    <div style="flex: 1; min-width: 200px; padding: 1rem;">
                        <strong>🎵 Entertainment:</strong>
                        <p>DJ with holiday playlist and dance floor</p>
                        <p><em>Plus photo opportunities with themed backdrops</em></p>
                    </div>
                </div>
                <p style="margin-top: 1rem;"><strong>Consensus Decision:</strong> The team agreed to create a festive atmosphere with special attention to decor and themed food stations while keeping entertainment casual.</p>
            `
        };
        
        return plans[partyType] || `
            <h4>${partyType} Event Plan</h4>
            <div style="display: flex; flex-wrap: wrap; justify-content: space-between; margin: 1rem 0;">
                <div style="flex: 1; min-width: 200px; padding: 1rem;">
                    <strong>🏢 Venue:</strong>
                    <p>Versatile Event Space</p>
                    <p><em>Capacity: 60 people with customizable setup</em></p>
                </div>
                <div style="flex: 1; min-width: 200px; padding: 1rem;">
                    <strong>💰 Budget:</strong>
                    <p>Total: $6,000</p>
                    <p><em>$100 per person for 60 guests</em></p>
                </div>
            </div>
            <div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
                <div style="flex: 1; min-width: 200px; padding: 1rem;">
                    <strong>🍽️ Catering:</strong>
                    <p>Mixed service with appetizer stations and plated main course</p>
                    <p><em>Includes standard bar package</em></p>
                </div>
                <div style="flex: 1; min-width: 200px; padding: 1rem;">
                    <strong>🎵 Entertainment:</strong>
                    <p>Professional DJ with sound system</p>
                    <p><em>Plus custom playlist and lighting effects</em></p>
                </div>
            </div>
            <p style="margin-top: 1rem;"><strong>Consensus Decision:</strong> The team agreed on a balanced approach with flexible venue setup and reliable catering and entertainment options.</p>
        `;
    }
    
    // Hierarchical Pattern Implementation
    setupHierarchicalPattern() {
        console.log("Setting up Hierarchical Pattern...");
        const projectButtons = document.querySelectorAll('#hierarchical-pattern .hierarchical-project-btn');
        const hierarchicalInput = document.getElementById('hierarchical-input');
        const hierarchicalSubmit = document.getElementById('hierarchical-submit');

        projectButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const project = btn.dataset.project;
                this.demonstrateHierarchy(project);
            });
        });

        if (hierarchicalInput && hierarchicalSubmit) {
            hierarchicalInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    hierarchicalSubmit.click();
                }
            });
            
            hierarchicalSubmit.addEventListener('click', () => {
                const project = hierarchicalInput.value.trim();
                if (project) {
                    this.demonstrateHierarchy(project);
                    hierarchicalInput.value = '';
                }
            });
        }
    }

    async demonstrateHierarchy(projectType) {
        const manager = document.getElementById('project-manager');
        const frontend = document.getElementById('frontend-dev');
        const backend = document.getElementById('backend-dev');
        const qa = document.getElementById('qa-tester');
        const projectProgress = document.getElementById('project-progress');
        const resultBox = document.getElementById('hierarchical-result');
        
        if (!manager || !frontend || !backend || !qa || !projectProgress || !resultBox) {
            console.warn('Hierarchical pattern elements not found');
            return;
        }
        
        // Reset all nodes
        [manager, frontend, backend, qa].forEach(node => {
            node.classList.remove('active');
            const status = node.querySelector('.task-status');
            if (status) status.textContent = 'Waiting...';
        });
        
        projectProgress.style.width = '0%';
        resultBox.textContent = 'Project planning in progress...';
        resultBox.className = 'result-box';
        
        // Step 1: Manager assigns tasks
        manager.classList.add('active');
        manager.querySelector('.task-status').textContent = 'Assigning tasks...';
        
        await this.delay(2000);
        
        // Step 2: Manager delegates to team
        const tasks = this.generateTasks(projectType);
        
        frontend.querySelector('.task-status').textContent = tasks.frontend;
        backend.querySelector('.task-status').textContent = tasks.backend;
        qa.querySelector('.task-status').textContent = tasks.qa;
        
        manager.querySelector('.task-status').textContent = 'Monitoring progress';
        
        // Step 3: Team works in parallel
        frontend.classList.add('active');
        backend.classList.add('active');
        qa.classList.add('active');
        
        // Progress updates
        for (let progress = 0; progress <= 100; progress += 20) {
            projectProgress.style.width = `${progress}%`;
            
            if (progress === 40) {
                frontend.querySelector('.task-status').textContent = 'Task completed';
            }
            
            if (progress === 60) {
                backend.querySelector('.task-status').textContent = 'Task completed';
            }
            
            if (progress === 80) {
                qa.querySelector('.task-status').textContent = 'Task completed';
                manager.querySelector('.task-status').textContent = 'Final review';
            }
            
            await this.delay(1000);
        }
        
        // Step 4: Show project outcome
        resultBox.innerHTML = this.generateProjectOutcome(projectType);
        resultBox.className = 'result-box success';
        
        // Reset active states
        [manager, frontend, backend, qa].forEach(node => {
            node.classList.remove('active');
        });
    }

    generateTasks(projectType) {
        const tasks = {
            'Mobile App': {
                frontend: 'Building UI components & screens',
                backend: 'Implementing API endpoints',
                qa: 'Testing on multiple devices'
            },
            'Web Platform': {
                frontend: 'Creating responsive layouts',
                backend: 'Setting up database architecture',
                qa: 'Cross-browser compatibility testing'
            },
            'E-commerce': {
                frontend: 'Designing product pages',
                backend: 'Implementing payment processing',
                qa: 'Testing checkout flows'
            },
            'Data Dashboard': {
                frontend: 'Building interactive charts',
                backend: 'Creating data processing pipeline',
                qa: 'Validating data accuracy'
            }
        };
        
        return tasks[projectType] || {
            frontend: 'Building user interface',
            backend: 'Implementing server logic',
            qa: 'Conducting thorough testing'
        };
    }

    generateProjectOutcome(projectType) {
        const outcomes = {
            'Mobile App': `
                <h4>Mobile App Project Completed!</h4>
                <div style="display: flex; flex-wrap: wrap; justify-content: space-between; margin: 1rem 0;">
                    <div style="flex: 1; min-width: 200px; padding: 1rem;">
                        <strong>🚀 Project Summary:</strong>
                        <p>User-friendly mobile application with seamless experience across iOS and Android platforms.</p>
                    </div>
                    <div style="flex: 1; min-width: 200px; padding: 1rem;">
                        <strong>⏱️ Timeline:</strong>
                        <p>Completed in 8 weeks, on schedule and within budget</p>
                    </div>
                </div>
                <div style="margin: 1rem 0;">
                    <strong>✅ Key Features Delivered:</strong>
                    <ul>
                        <li>Intuitive user interface with modern design</li>
                        <li>Offline functionality and data synchronization</li>
                        <li>Push notification system</li>
                        <li>Secure authentication</li>
                        <li>Analytics integration</li>
                    </ul>
                </div>
                <p><em>Project managed effectively through hierarchical team structure, with clear delegation of responsibilities and regular progress tracking.</em></p>
            `,
            'Web Platform': `
                <h4>Web Platform Project Completed!</h4>
                <div style="display: flex; flex-wrap: wrap; justify-content: space-between; margin: 1rem 0;">
                    <div style="flex: 1; min-width: 200px; padding: 1rem;">
                        <strong>🚀 Project Summary:</strong>
                        <p>Scalable web platform with responsive design and comprehensive functionality.</p>
                    </div>
                    <div style="flex: 1; min-width: 200px; padding: 1rem;">
                        <strong>⏱️ Timeline:</strong>
                        <p>Completed in 12 weeks, with final QA phase completed ahead of schedule</p>
                    </div>
                </div>
                <div style="margin: 1rem 0;">
                    <strong>✅ Key Features Delivered:</strong>
                    <ul>
                        <li>Responsive design for all screen sizes</li>
                        <li>Advanced search and filtering capabilities</li>
                        <li>User account management system</li>
                        <li>Content management system integration</li>
                        <li>Performance optimization for fast load times</li>
                    </ul>
                </div>
                <p><em>Project managed effectively through hierarchical team structure, with clear delegation of responsibilities and regular progress tracking.</em></p>
            `,
            'E-commerce': `
                <h4>E-commerce Site Project Completed!</h4>
                <div style="display: flex; flex-wrap: wrap; justify-content: space-between; margin: 1rem 0;">
                    <div style="flex: 1; min-width: 200px; padding: 1rem;">
                        <strong>🚀 Project Summary:</strong>
                        <p>Feature-rich online store with secure payment processing and inventory management.</p>
                    </div>
                    <div style="flex: 1; min-width: 200px; padding: 1rem;">
                        <strong>⏱️ Timeline:</strong>
                        <p>Completed in 10 weeks, with extra security features added within original timeframe</p>
                    </div>
                </div>
                <div style="margin: 1rem 0;">
                    <strong>✅ Key Features Delivered:</strong>
                    <ul>
                        <li>Product catalog with filtering and sorting</li>
                        <li>Secure checkout process with multiple payment options</li>
                        <li>Customer account management</li>
                        <li>Order tracking and history</li>
                        <li>Inventory and stock management integration</li>
                    </ul>
                </div>
                <p><em>Project managed effectively through hierarchical team structure, with clear delegation of responsibilities and regular progress tracking.</em></p>
            `,
            'Data Dashboard': `
                <h4>Data Dashboard Project Completed!</h4>
                <div style="display: flex; flex-wrap: wrap; justify-content: space-between; margin: 1rem 0;">
                    <div style="flex: 1; min-width: 200px; padding: 1rem;">
                        <strong>🚀 Project Summary:</strong>
                        <p>Interactive data visualization dashboard with real-time updates and customizable views.</p>
                    </div>
                    <div style="flex: 1; min-width: 200px; padding: 1rem;">
                        <strong>⏱️ Timeline:</strong>
                        <p>Completed in 6 weeks, with additional visualization options added</p>
                    </div>
                </div>
                <div style="margin: 1rem 0;">
                    <strong>✅ Key Features Delivered:</strong>
                    <ul>
                        <li>Interactive charts and graphs</li>
                        <li>Real-time data updates</li>
                        <li>Customizable dashboard layouts</li>
                        <li>Data export functionality</li>
                        <li>User-specific views and permissions</li>
                    </ul>
                </div>
                <p><em>Project managed effectively through hierarchical team structure, with clear delegation of responsibilities and regular progress tracking.</em></p>
            `
        };
        
        return outcomes[projectType] || `
            <h4>${projectType} Project Completed!</h4>
            <div style="display: flex; flex-wrap: wrap; justify-content: space-between; margin: 1rem 0;">
                <div style="flex: 1; min-width: 200px; padding: 1rem;">
                    <strong>🚀 Project Summary:</strong>
                    <p>Successfully delivered project meeting all requirements and specifications.</p>
                </div>
                <div style="flex: 1; min-width: 200px; padding: 1rem;">
                    <strong>⏱️ Timeline:</strong>
                    <p>Completed on schedule and within budget constraints</p>
                </div>
            </div>
            <div style="margin: 1rem 0;">
                <strong>✅ Key Features Delivered:</strong>
                <ul>
                    <li>Core functionality implemented according to specifications</li>
                    <li>User interface designed for optimal user experience</li>
                    <li>Backend systems optimized for performance</li>
                    <li>Comprehensive testing completed with all issues resolved</li>
                    <li>Documentation provided for future maintenance</li>
                </ul>
            </div>
            <p><em>Project managed effectively through hierarchical team structure, with clear delegation of responsibilities and regular progress tracking.</em></p>
        `;
    }
}

// Initialize the demo when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the demo with all patterns directly included in the class
    new MultiAgentDemo();
    console.log("MultiAgentDemo initialized with all patterns");
});

// Add some additional interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetSection = document.getElementById(`${btn.dataset.pattern}-pattern`);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    document.querySelector('[data-pattern="route"]').click();
                    break;
                case '2':
                    e.preventDefault();
                    document.querySelector('[data-pattern="coordinate"]').click();
                    break;
                case '3':
                    e.preventDefault();
                    document.querySelector('[data-pattern="collaborate"]').click();
                    break;
                case '4':
                    e.preventDefault();
                    document.querySelector('[data-pattern="competitive"]').click();
                    break;
                case '5':
                    e.preventDefault();
                    document.querySelector('[data-pattern="loop"]').click();
                    break;
                case '7':
                    e.preventDefault();
                    document.querySelector('[data-pattern="network"]').click();
                    break;
                case '8':
                    e.preventDefault();
                    document.querySelector('[data-pattern="hierarchical"]').click();
                    break;
            }
        }
    });

    // Add tooltips for keyboard shortcuts
    // const shortcuts = document.createElement('div');
    // shortcuts.innerHTML = `
    //     <div style="position: fixed; bottom: 20px; right: 20px; background: rgba(0,0,0,0.8); color: white; padding: 10px; border-radius: 5px; font-size: 12px; z-index: 1000;">
    //         <div>Keyboard Shortcuts:</div>
    //         <div>Ctrl+1: Route Pattern</div>
    //         <div>Ctrl+2: Coordinate Pattern</div>
    //         <div>Ctrl+3: Collaborate Pattern</div>
    //         <div>Ctrl+4: Competitive Pattern</div>
    //         <div>Ctrl+5: Loop Pattern</div>
    //         <div>Ctrl+7: Network Pattern</div>
    //         <div>Ctrl+8: Hierarchical Pattern</div>
    //     </div>
    // `;
    // document.body.appendChild(shortcuts);

    // Hide shortcuts after 5 seconds
    setTimeout(() => {
        shortcuts.style.opacity = '0';
        shortcuts.style.transition = 'opacity 1s';
        setTimeout(() => shortcuts.remove(), 1000);
    }, 5000);
});
