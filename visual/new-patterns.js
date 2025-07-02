// Loop Pattern Implementation
function setupLoopPattern() {
    const topicButtons = document.querySelectorAll('#loop-pattern .topic-btn');
    const loopInput = document.getElementById('loop-input');
    const loopSubmit = document.getElementById('loop-submit');

    topicButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const topic = btn.dataset.topic;
            this.demonstrateLoop(topic);
        });
    });

    loopInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loopSubmit.click();
        }
    });
    
    loopSubmit?.addEventListener('click', () => {
        const topic = loopInput.value.trim();
        if (topic) {
            this.demonstrateLoop(topic);
            loopInput.value = '';
        }
    });
}

async function demonstrateLoop(topic) {
    const steps = ['draft', 'review', 'improve'];
    const stepCards = document.querySelectorAll('#loop-pattern .loop-step-card');
    const resultBox = document.getElementById('loop-result');
    const qualityProgress = document.getElementById('quality-progress');
    const iterationCount = document.getElementById('iteration-count');
    
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
    
    // Loop until quality threshold is met
    while (quality < qualityThreshold) {
        iterations++;
        iterationCount.textContent = `Iteration: ${iterations}`;
        
        // Execute each step in the loop
        for (let i = 0; i < steps.length; i++) {
            const stepCard = document.getElementById(`${steps[i]}-step`);
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
            }, 100);
            
            await this.delay(1000);
            stepCard.classList.remove('active');
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
    const essays = {
        'Climate Change': this.generateEssay('climate', topic, iterations),
        'Artificial Intelligence Ethics': this.generateEssay('ai', topic, iterations),
        'Space Exploration': this.generateEssay('space', topic, iterations),
        'Renewable Energy': this.generateEssay('energy', topic, iterations)
    };
    
    const finalEssay = essays[topic] || this.generateEssay('general', topic, iterations);
    
    resultBox.innerHTML = finalEssay;
    resultBox.className = 'result-box success';
}

function generateEssay(type, topic, iterations) {
    const essays = {
        'climate': `
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
        'ai': `
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
        'space': `
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
        'energy': `
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
    
    return essays[type] || `
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

// Aggregator Pattern Implementation
function setupAggregatorPattern() {
    const locationButtons = document.querySelectorAll('#aggregator-pattern .topic-btn');
    const aggregatorInput = document.getElementById('aggregator-input');
    const aggregatorSubmit = document.getElementById('aggregator-submit');

    locationButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const location = btn.dataset.location;
            this.demonstrateAggregation(location);
        });
    });

    aggregatorInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            aggregatorSubmit.click();
        }
    });
    
    aggregatorSubmit?.addEventListener('click', () => {
        const location = aggregatorInput.value.trim();
        if (location) {
            this.demonstrateAggregation(location);
            aggregatorInput.value = '';
        }
    });
}

async function demonstrateAggregation(location) {
    const sourceA = document.getElementById('source-a');
    const sourceB = document.getElementById('source-b');
    const sourceC = document.getElementById('source-c');
    const tempValue = document.getElementById('temp-value');
    const precipValue = document.getElementById('precip-value');
    const windValue = document.getElementById('wind-value');
    const forecastResult = document.getElementById('forecast-result');
    const resultBox = document.getElementById('aggregator-result');
    
    // Reset all sources
    [sourceA, sourceB, sourceC].forEach(source => {
        source.classList.remove('active');
    });
    
    tempValue.textContent = '--°C';
    precipValue.textContent = '--mm';
    windValue.textContent = '--km/h';
    forecastResult.textContent = 'Aggregating data...';
    resultBox.textContent = 'Gathering weather data...';
    resultBox.className = 'result-box';
    
    // Generate weather data based on location
    const weatherData = this.generateWeatherData(location);
    
    // Activate sources one by one
    await this.delay(500);
    sourceA.classList.add('active');
    tempValue.textContent = `${weatherData.temperature}°C`;
    
    await this.delay(1000);
    sourceB.classList.add('active');
    precipValue.textContent = `${weatherData.precipitation}mm`;
    
    await this.delay(1000);
    sourceC.classList.add('active');
    windValue.textContent = `${weatherData.wind}km/h`;
    
    // Aggregate data
    await this.delay(1500);
    forecastResult.textContent = weatherData.shortForecast;
    
    // Show detailed forecast
    await this.delay(1000);
    resultBox.innerHTML = `
        <h4>${location} Weather Forecast</h4>
        <div style="display: flex; justify-content: space-around; flex-wrap: wrap; margin: 1rem 0;">
            <div><strong>Temperature:</strong> ${weatherData.temperature}°C</div>
            <div><strong>Precipitation:</strong> ${weatherData.precipitation}mm</div>
            <div><strong>Wind:</strong> ${weatherData.wind}km/h</div>
        </div>
        <p><strong>Forecast Summary:</strong> ${weatherData.detailedForecast}</p>
    `;
    resultBox.className = 'result-box success';
}

function generateWeatherData(location) {
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
function setupNetworkPattern() {
    const partyButtons = document.querySelectorAll('#network-pattern .topic-btn');
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

    networkInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            networkSubmit.click();
        }
    });
    
    networkSubmit?.addEventListener('click', () => {
        const party = networkInput.value.trim();
        if (party) {
            this.demonstrateNetwork(party);
            networkInput.value = '';
        }
    });
}

function drawNetworkConnections() {
    const connectionsDiv = document.getElementById('network-connections');
    if (!connectionsDiv) return;
    
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
        if (!element) return;
        
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

async function demonstrateNetwork(partyType) {
    const nodes = ['venue-agent', 'budget-agent', 'catering-agent', 'entertainment-agent'];
    const resultBox = document.getElementById('network-result');
    const messageBubble = document.getElementById('network-message');
    
    // Reset all nodes
    nodes.forEach(id => {
        const node = document.getElementById(id);
        if (!node) return;
        
        node.classList.remove('active', 'sender', 'receiver');
        const preview = node.querySelector('.message-preview');
        if (preview) preview.textContent = '';
    });
    
    resultBox.textContent = 'Planning in progress...';
    resultBox.className = 'result-box';
    
    // Generate party planning messages
    const messages = this.generateNetworkMessages(partyType);
    
    // Simulate network communication
    for (let i = 0; i < messages.length; i++) {
        const { from, to, message } = messages[i];
        
        const fromNode = document.getElementById(from);
        const toNode = document.getElementById(to);
        
        if (!fromNode || !toNode) continue;
        
        // Highlight sender and receiver
        fromNode.classList.add('active', 'sender');
        toNode.classList.add('active', 'receiver');
        
        // Calculate message path
        const fromRect = fromNode.getBoundingClientRect();
        const toRect = toNode.getBoundingClientRect();
        const containerRect = document.querySelector('.network-grid').getBoundingClientRect();
        
        const fromX = fromRect.left - containerRect.left + fromRect.width / 2;
        const fromY = fromRect.top - containerRect.top + fromRect.height / 2;
        const toX = toRect.left - containerRect.left + toRect.width / 2;
        const toY = toRect.top - containerRect.top + toRect.height / 2;
        
        // Position and show message
        messageBubble.style.setProperty('--move-x', `${toX - fromX}px`);
        messageBubble.style.setProperty('--move-y', `${toY - fromY}px`);
        messageBubble.style.left = `${fromX}px`;
        messageBubble.style.top = `${fromY}px`;
        messageBubble.textContent = message;
        messageBubble.classList.add('show');
        
        // Wait for animation
        await this.delay(3000);
        messageBubble.classList.remove('show');
        
        // Update preview
        const preview = toNode.querySelector('.message-preview');
        if (preview) preview.textContent = message;
        
        // Reset highlights after delay
        await this.delay(500);
        fromNode.classList.remove('sender');
        toNode.classList.remove('receiver');
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

function generateNetworkMessages(partyType) {
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

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function generatePartyPlan(partyType) {
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
function setupHierarchicalPattern() {
    const projectButtons = document.querySelectorAll('#hierarchical-pattern .topic-btn');
    const hierarchicalInput = document.getElementById('hierarchical-input');
    const hierarchicalSubmit = document.getElementById('hierarchical-submit');

    projectButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const project = btn.dataset.project;
            this.demonstrateHierarchy(project);
        });
    });

    hierarchicalInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            hierarchicalSubmit.click();
        }
    });
    
    hierarchicalSubmit?.addEventListener('click', () => {
        const project = hierarchicalInput.value.trim();
        if (project) {
            this.demonstrateHierarchy(project);
            hierarchicalInput.value = '';
        }
    });
}

async function demonstrateHierarchy(projectType) {
    const manager = document.getElementById('project-manager');
    const frontend = document.getElementById('frontend-dev');
    const backend = document.getElementById('backend-dev');
    const qa = document.getElementById('qa-tester');
    const projectProgress = document.getElementById('project-progress');
    const resultBox = document.getElementById('hierarchical-result');
    
    // Reset all nodes
    [manager, frontend, backend, qa].forEach(node => {
        if (!node) return;
        
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
        if (node) node.classList.remove('active');
    });
}

function generateTasks(projectType) {
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

function generateProjectOutcome(projectType) {
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
