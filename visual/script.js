// Multi-Agent System Patterns Interactive Demo
// JavaScript functionality for all pattern demonstrations

class MultiAgentDemo {
    constructor() {
        this.currentPattern = 'route';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupRoutePattern();
        this.setupCoordinatePattern();
        this.setupCollaboratePattern();
        this.setupCompetitivePattern();
        this.setupLoopPattern();
        this.setupAggregatorPattern();
        this.setupNetworkPattern();
        this.setupHierarchicalPattern();
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
        const languageButtons = document.querySelectorAll('.lang-btn');
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
        // Reset all agents
        const agents = document.querySelectorAll('#route-pattern .agent-card');
        const leaderStatus = document.getElementById('leader-status');
        const messageBubble = document.getElementById('route-message');
        const resultBox = document.getElementById('route-result');

        agents.forEach(agent => {
            agent.classList.remove('active');
            const status = agent.querySelector('.status');
            if (status) status.textContent = 'Standby';
        });

        // Step 1: Show message
        messageBubble.textContent = message;
        messageBubble.classList.add('show');
        leaderStatus.textContent = 'Analyzing...';
        leaderStatus.className = 'status processing';

        await this.delay(1000);

        // Step 2: Leader analysis
        leaderStatus.textContent = `Detected: ${targetLanguage}`;
        await this.delay(1000);

        // Step 3: Route to appropriate agent
        const targetAgent = document.querySelector(`#route-pattern .agent-card[data-lang="${targetLanguage}"]`);
        if (targetAgent) {
            targetAgent.classList.add('active');
            const agentStatus = targetAgent.querySelector('.status');
            agentStatus.textContent = 'Processing';
            agentStatus.className = 'status processing';
        }

        leaderStatus.textContent = `Routed to ${targetLanguage} Agent`;
        await this.delay(2000);

        // Step 4: Show response
        if (targetAgent) {
            const agentStatus = targetAgent.querySelector('.status');
            agentStatus.textContent = 'Completed';
            agentStatus.className = 'status completed';
        }

        leaderStatus.textContent = 'Ready';
        leaderStatus.className = 'status';
        
        resultBox.textContent = response;
        resultBox.className = 'result-box success';

        // Hide message bubble after delay
        setTimeout(() => {
            messageBubble.classList.remove('show');
        }, 3000);
    }

    // Coordinate Pattern Implementation
    setupCoordinatePattern() {
        const topicButtons = document.querySelectorAll('.topic-btn');
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
        const questionButtons = document.querySelectorAll('.question-btn');
        const collaborateInput = document.getElementById('collaborate-input');
        const collaborateSubmit = document.getElementById('collaborate-submit');

        questionButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.dataset.question;
                this.demonstrateCollaboration(question);
            });
        });

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

    async demonstrateCollaboration(question) {
        const panelists = ['reddit-researcher', 'academic-researcher', 'twitter-researcher', 'hackernews-researcher'];
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
            'What is the best way to learn programming?': [
                'Reddit: Community recommends starting with Python, joining r/learnprogramming, and building projects.',
                'Academic: Structured CS courses, algorithm fundamentals, and theoretical understanding are crucial.',
                'Twitter: Follow coding influencers, participate in #100DaysOfCode, and engage with tech Twitter.',
                'HackerNews: Focus on practical projects, read others\' code, and contribute to open source.'
            ],
            'How will AI impact jobs in the next 5 years?': [
                'Reddit: Mixed opinions - some fear job loss, others see new opportunities in AI-adjacent roles.',
                'Academic: Research shows job displacement in routine tasks, but creation of new technical roles.',
                'Twitter: Industry leaders predict transformation rather than replacement, emphasis on reskilling.',
                'HackerNews: Tech workers discuss AI as a tool for productivity, not replacement for creativity.'
            ],
            'What are the most promising renewable energy technologies?': [
                'Reddit: Solar and wind dominate discussions, with growing interest in battery storage solutions.',
                'Academic: Peer-reviewed research highlights perovskite solar cells and offshore wind advances.',
                'Twitter: Industry updates on grid-scale batteries, green hydrogen, and smart grid technologies.',
                'HackerNews: Technical discussions on energy efficiency, nuclear fusion progress, and grid integration.'
            ],
            'How can we improve remote work productivity?': [
                'Reddit: Focus on dedicated workspace, time management tools, and work-life boundaries.',
                'Academic: Studies emphasize communication protocols, team cohesion, and mental health support.',
                'Twitter: Productivity experts share tips on async communication and digital wellness.',
                'HackerNews: Technical solutions like better collaboration tools and automation for routine tasks.'
            ]
        };

        return responseTemplates[question] || [
            'Reddit: Community discussions provide diverse perspectives and practical experiences.',
            'Academic: Scholarly research offers evidence-based insights and theoretical frameworks.',
            'Twitter: Real-time trends and expert opinions from industry leaders and influencers.',
            'HackerNews: Technical community shares implementation details and innovative approaches.'
        ];
    }

    synthesizeResponses(question, responses) {
        const syntheses = {
            'What is the best way to learn programming?': `
                <h4>Consensus: Multi-Modal Learning Approach</h4>
                <p><strong>Key Findings:</strong> All sources agree that effective programming education requires combining multiple approaches:</p>
                <ul>
                    <li><strong>Foundation:</strong> Start with beginner-friendly languages (Python) and structured learning</li>
                    <li><strong>Community:</strong> Engage with programming communities for support and motivation</li>
                    <li><strong>Practice:</strong> Build real projects and contribute to open source</li>
                    <li><strong>Theory:</strong> Understand fundamental concepts and algorithms</li>
                </ul>
                <p><em>Recommendation:</em> Combine formal education with community engagement and hands-on project building for optimal learning outcomes.</p>
            `,
            'How will AI impact jobs in the next 5 years?': `
                <h4>Consensus: Transformation, Not Elimination</h4>
                <p><strong>Key Findings:</strong> Despite varied perspectives, all sources point to job transformation rather than wholesale replacement:</p>
                <ul>
                    <li><strong>Displacement:</strong> Routine and repetitive tasks will be automated</li>
                    <li><strong>Creation:</strong> New roles in AI development, maintenance, and oversight will emerge</li>
                    <li><strong>Enhancement:</strong> AI will augment human capabilities rather than replace them</li>
                    <li><strong>Reskilling:</strong> Continuous learning and adaptation will be essential</li>
                </ul>
                <p><em>Recommendation:</em> Focus on developing uniquely human skills (creativity, emotional intelligence, complex problem-solving) while gaining AI literacy.</p>
            `,
            'What are the most promising renewable energy technologies?': `
                <h4>Consensus: Diversified Clean Energy Portfolio</h4>
                <p><strong>Key Findings:</strong> Multiple renewable technologies show promise for different applications:</p>
                <ul>
                    <li><strong>Solar:</strong> Continued cost reductions and efficiency improvements, especially perovskite cells</li>
                    <li><strong>Wind:</strong> Offshore wind expansion and larger, more efficient turbines</li>
                    <li><strong>Storage:</strong> Battery technology advances crucial for grid stability</li>
                    <li><strong>Emerging:</strong> Green hydrogen and fusion research showing potential</li>
                </ul>
                <p><em>Recommendation:</em> Invest in a diversified portfolio of renewable technologies with strong emphasis on energy storage and grid modernization.</p>
            `
        };

        return syntheses[question] || `
            <h4>Consensus: Comprehensive Analysis</h4>
            <p><strong>Key Findings:</strong> Our research panel has identified several important themes:</p>
            <ul>
                <li><strong>Community Perspective:</strong> ${responses[0]}</li>
                <li><strong>Academic Insight:</strong> ${responses[1]}</li>
                <li><strong>Industry Trends:</strong> ${responses[2]}</li>
                <li><strong>Technical Analysis:</strong> ${responses[3]}</li>
            </ul>
            <p><em>Synthesis:</em> The convergence of these perspectives suggests a nuanced approach that balances practical implementation with theoretical understanding and community engagement.</p>
        `;
    }

    // Competitive Pattern Implementation
    setupCompetitivePattern() {
        const taskButtons = document.querySelectorAll('.task-btn');
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
}

// Initialize the demo when the page loads
// Import the new pattern functions
document.addEventListener('DOMContentLoaded', () => {
    // Load the new patterns
    loadNewPatterns();
    // Initialize the demo
    new MultiAgentDemo();
});

// Load new pattern functions from the separate file
function loadNewPatterns() {
    // Add new pattern methods to MultiAgentDemo prototype
    MultiAgentDemo.prototype.setupLoopPattern = setupLoopPattern;
    MultiAgentDemo.prototype.demonstrateLoop = demonstrateLoop;
    MultiAgentDemo.prototype.generateEssay = generateEssay;
    
    MultiAgentDemo.prototype.setupAggregatorPattern = setupAggregatorPattern;
    MultiAgentDemo.prototype.demonstrateAggregation = demonstrateAggregation;
    MultiAgentDemo.prototype.generateWeatherData = generateWeatherData;
    
    MultiAgentDemo.prototype.setupNetworkPattern = setupNetworkPattern;
    MultiAgentDemo.prototype.drawNetworkConnections = drawNetworkConnections;
    MultiAgentDemo.prototype.demonstrateNetwork = demonstrateNetwork;
    MultiAgentDemo.prototype.generateNetworkMessages = generateNetworkMessages;
    MultiAgentDemo.prototype.shuffleArray = shuffleArray;
    MultiAgentDemo.prototype.generatePartyPlan = generatePartyPlan;
    
    MultiAgentDemo.prototype.setupHierarchicalPattern = setupHierarchicalPattern;
    MultiAgentDemo.prototype.demonstrateHierarchy = demonstrateHierarchy;
    MultiAgentDemo.prototype.generateTasks = generateTasks;
    MultiAgentDemo.prototype.generateProjectOutcome = generateProjectOutcome;
}

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
                case '6':
                    e.preventDefault();
                    document.querySelector('[data-pattern="aggregator"]').click();
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
    //         <div>Ctrl+6: Aggregator Pattern</div>
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
