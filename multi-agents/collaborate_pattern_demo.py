"""
Collaborate Pattern Demo - Investment Analysis Panel
Demonstrates parallel collaboration with consensus building among multiple expert agents
"""

import os
import time
from typing import Dict, Any, List
from dotenv import load_dotenv
from rich.console import Console
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn, TaskProgressColumn
from rich.table import Table
from rich.markdown import Markdown

# Import LangChain components
from langchain_aws import ChatBedrock
from langchain.prompts import ChatPromptTemplate

# Load environment variables
load_dotenv()

console = Console()

class CollaboratePatternDemo:
    def __init__(self):
        self.console = console
        self.setup_agents()
    
    def setup_agents(self):
        """Setup specialized agents for investment analysis"""
        
        # HARDCODED: Use supported model ID that doesn't require inference profiles
        claude_model = "anthropic.claude-3-5-sonnet-20240620-v1:0"  # Hardcoded to bypass .env issues
        region_name = os.getenv("AWS_DEFAULT_REGION", "us-east-1")
        
        print(f"Using model: {claude_model}")
        
        # Create LangChain model
        self.llm = ChatBedrock(model_id=claude_model, region_name=region_name)
        
        # Technical Analysis Agent
        self.technical_analyst = self.create_agent(
            name="Technical Analysis Expert",
            role="Expert in technical analysis, chart patterns, and market trends",
            instructions="""
            You are a technical analysis expert specializing in chart patterns, market trends, and price movements.
            When analyzing a stock or market, focus on:
            - Price trends and momentum indicators
            - Support and resistance levels
            - Volume analysis and market sentiment
            - Chart patterns and technical signals
            - Short to medium-term price predictions
            - Risk levels based on technical indicators
            
            Provide clear, actionable insights based on technical analysis principles.
            Be specific about entry/exit points and risk management.
            
            Format your analysis with clear sections and bullet points.
            Conclude with a technical rating: Strong Buy, Buy, Neutral, Sell, or Strong Sell.
            """
        )
        
        # Fundamental Analysis Agent
        self.fundamental_analyst = self.create_agent(
            name="Fundamental Analysis Expert",
            role="Expert in fundamental analysis, financial statements, and company valuation",
            instructions="""
            You are a fundamental analysis expert specializing in company valuation and financial analysis.
            When analyzing a company or stock, focus on:
            - Financial health and key ratios (P/E, ROE, debt levels)
            - Revenue growth and profitability trends
            - Competitive position and market share
            - Management quality and corporate governance
            - Industry outlook and economic factors
            - Long-term value proposition
            
            Provide thorough analysis of the company's intrinsic value and growth prospects.
            Consider both opportunities and risks from a fundamental perspective.
            
            Format your analysis with clear sections and bullet points.
            Conclude with a fundamental rating: Strong Buy, Buy, Neutral, Sell, or Strong Sell.
            """
        )
        
        # Market Sentiment Agent
        self.sentiment_analyst = self.create_agent(
            name="Market Sentiment Analyst",
            role="Expert in market psychology, news analysis, and investor sentiment",
            instructions="""
            You are a market sentiment analyst specializing in investor psychology and market mood.
            When analyzing market sentiment, focus on:
            - Current market mood and investor confidence
            - News impact and media coverage analysis
            - Social media sentiment and retail investor behavior
            - Institutional investor positioning
            - Fear and greed indicators
            - Market volatility and uncertainty levels
            
            Provide insights on how sentiment might affect price movements.
            Consider both bullish and bearish sentiment factors.
            
            Format your analysis with clear sections and bullet points.
            Conclude with a sentiment rating: Very Bullish, Bullish, Neutral, Bearish, or Very Bearish.
            """
        )
        
        # Risk Assessment Agent
        self.risk_analyst = self.create_agent(
            name="Risk Assessment Specialist",
            role="Expert in risk analysis, portfolio management, and risk mitigation strategies",
            instructions="""
            You are a risk assessment specialist focusing on investment risks and mitigation strategies.
            When analyzing investment risks, evaluate:
            - Market risk and volatility exposure
            - Company-specific risks and vulnerabilities
            - Industry and sector risks
            - Economic and regulatory risks
            - Liquidity and operational risks
            - Potential downside scenarios
            
            Provide comprehensive risk assessment with specific mitigation strategies.
            Quantify risks where possible and suggest position sizing recommendations.
            
            Format your analysis with clear sections and bullet points.
            Conclude with a risk rating: Very Low, Low, Moderate, High, or Very High.
            """
        )
        
        # Synthesis Agent
        self.synthesizer = self.create_agent(
            name="Lead Investment Strategist",
            role="Expert in synthesizing diverse analyses into cohesive recommendations",
            instructions="""
            You are the lead investment strategist responsible for synthesizing multiple expert analyses into a comprehensive investment recommendation.
            
            You will be provided with four distinct analyses:
            1. Technical Analysis (price trends, chart patterns)
            2. Fundamental Analysis (company financials, valuation)
            3. Market Sentiment Analysis (investor psychology, news impact)
            4. Risk Assessment (potential risks and mitigations)
            
            Your task is to:
            - Identify areas of consensus and disagreement between the analyses
            - Weigh the different perspectives appropriately
            - Resolve conflicting viewpoints
            - Provide a balanced, comprehensive investment recommendation
            
            Your final recommendation should include:
            - Overall investment rating (Strong Buy, Buy, Hold, Sell, or Strong Sell)
            - Target price or price range (if applicable)
            - Investment timeframe (short-term, medium-term, long-term)
            - Key supporting rationale
            - Risk-adjusted return expectation
            
            Format your recommendation in a clear, structured way with sections and bullet points.
            """
        )
    
    def create_agent(self, name: str, role: str, instructions: str) -> Any:
        """Create a LangChain agent"""
        system_message = f"# {name}\n## Role: {role}\n\n{instructions}"
        
        prompt_template = ChatPromptTemplate.from_messages([
            ("system", system_message),
            ("human", "{input}")
        ])
        
        # Create agent chain
        agent_chain = prompt_template | self.llm
        
        return {
            "name": name,
            "role": role,
            "chain": agent_chain
        }
    
    def display_header(self):
        """Display demo header"""
        header = Panel.fit(
            "[bold blue]📊 Collaborate Pattern Demo - Investment Analysis Panel[/bold blue]\n"
            "[dim]Parallel expert collaboration with consensus building[/dim]",
            border_style="blue"
        )
        console.print(header)
        console.print()
    
    def display_analysts(self):
        """Display the analysis team"""
        table = Table(title="Investment Analysis Team", show_header=True, header_style="bold magenta")
        table.add_column("Analyst", style="cyan", no_wrap=True)
        table.add_column("Expertise", style="green")
        table.add_column("Focus Area", style="yellow")
        
        analysts_info = [
            ("Technical Expert", "Chart patterns, trends", "Price movements & timing"),
            ("Fundamental Expert", "Financial analysis", "Company valuation & growth"),
            ("Sentiment Analyst", "Market psychology", "Investor mood & news impact"),
            ("Risk Specialist", "Risk assessment", "Downside protection & mitigation"),
            ("Lead Strategist", "Synthesis & integration", "Final recommendation & consensus")
        ]
        
        for analyst, expertise, focus in analysts_info:
            table.add_row(analyst, expertise, focus)
        
        console.print(table)
        console.print()
    
    def demonstrate_collaboration(self, investment: str):
        """Demonstrate the collaboration process with a specific investment"""
        
        console.print(f"[bold green]Investment Analysis Target:[/bold green] {investment}")
        console.print()
        
        # Show collaboration progress
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            BarColumn(),
            TaskProgressColumn(),
            console=console,
        ) as progress:
            
            # Overall progress
            overall_task = progress.add_task("📊 Overall Analysis Process", total=5)
            
            # Technical analysis
            technical_task = progress.add_task("📈 Step 1: Technical Analysis - Chart patterns & trends...", total=None)
            step_start_time = time.time()
            
            # Execute technical analysis
            technical_prompt = f"Provide a technical analysis for {investment}. Focus on chart patterns, price trends, support/resistance levels, and technical indicators. Include a clear technical rating at the end."
            technical_result = self.technical_analyst["chain"].invoke({"input": technical_prompt})
            
            # Update progress
            technical_time = time.time() - step_start_time
            progress.update(technical_task, completed=True)
            progress.update(overall_task, advance=1)
            
            # Display technical analysis preview
            console.print("\n[cyan]Technical Analysis:[/cyan]")
            console.print(Panel(technical_result.content[:250] + "...", 
                              title="[bold]Technical Analysis (Preview)[/bold]", 
                              border_style="cyan",
                              padding=(1, 2)))
            
            # Fundamental analysis
            fundamental_task = progress.add_task("💰 Step 2: Fundamental Analysis - Financials & valuation...", total=None)
            step_start_time = time.time()
            
            # Execute fundamental analysis
            fundamental_prompt = f"Provide a fundamental analysis for {investment}. Focus on financial health, valuation metrics, growth prospects, and competitive position. Include a clear fundamental rating at the end."
            fundamental_result = self.fundamental_analyst["chain"].invoke({"input": fundamental_prompt})
            
            # Update progress
            fundamental_time = time.time() - step_start_time
            progress.update(fundamental_task, completed=True)
            progress.update(overall_task, advance=1)
            
            # Display fundamental analysis preview
            console.print("\n[cyan]Fundamental Analysis:[/cyan]")
            console.print(Panel(fundamental_result.content[:250] + "...", 
                              title="[bold]Fundamental Analysis (Preview)[/bold]", 
                              border_style="cyan",
                              padding=(1, 2)))
            
            # Sentiment analysis
            sentiment_task = progress.add_task("🎭 Step 3: Sentiment Analysis - Market mood & psychology...", total=None)
            step_start_time = time.time()
            
            # Execute sentiment analysis
            sentiment_prompt = f"Provide a sentiment analysis for {investment}. Focus on investor psychology, news impact, media coverage, and market mood. Include a clear sentiment rating at the end."
            sentiment_result = self.sentiment_analyst["chain"].invoke({"input": sentiment_prompt})
            
            # Update progress
            sentiment_time = time.time() - step_start_time
            progress.update(sentiment_task, completed=True)
            progress.update(overall_task, advance=1)
            
            # Display sentiment analysis preview
            console.print("\n[cyan]Sentiment Analysis:[/cyan]")
            console.print(Panel(sentiment_result.content[:250] + "...", 
                              title="[bold]Sentiment Analysis (Preview)[/bold]", 
                              border_style="cyan",
                              padding=(1, 2)))
            
            # Risk assessment
            risk_task = progress.add_task("⚠️  Step 4: Risk Assessment - Downside scenarios & mitigation...", total=None)
            step_start_time = time.time()
            
            # Execute risk assessment
            risk_prompt = f"Provide a risk assessment for {investment}. Focus on potential downside scenarios, risk factors, and mitigation strategies. Include a clear risk rating at the end."
            risk_result = self.risk_analyst["chain"].invoke({"input": risk_prompt})
            
            # Update progress
            risk_time = time.time() - step_start_time
            progress.update(risk_task, completed=True)
            progress.update(overall_task, advance=1)
            
            # Display risk assessment preview
            console.print("\n[cyan]Risk Assessment:[/cyan]")
            console.print(Panel(risk_result.content[:250] + "...", 
                              title="[bold]Risk Assessment (Preview)[/bold]", 
                              border_style="cyan",
                              padding=(1, 2)))
            
            # Synthesis phase
            synthesis_task = progress.add_task("🔄 Step 5: Synthesis - Building consensus recommendation...", total=None)
            step_start_time = time.time()
            
            # Execute synthesis
            synthesis_prompt = f"""
            Synthesize the following analyses for {investment} into a comprehensive investment recommendation:
            
            ## TECHNICAL ANALYSIS:
            {technical_result.content}
            
            ## FUNDAMENTAL ANALYSIS:
            {fundamental_result.content}
            
            ## SENTIMENT ANALYSIS:
            {sentiment_result.content}
            
            ## RISK ASSESSMENT:
            {risk_result.content}
            
            Provide a balanced synthesis that considers all perspectives. Include overall investment rating, target price (if applicable), timeframe, and key rationale.
            """
            
            final_recommendation = self.synthesizer["chain"].invoke({"input": synthesis_prompt})
            
            # Update progress
            synthesis_time = time.time() - step_start_time
            progress.update(synthesis_task, completed=True)
            progress.update(overall_task, advance=1)
        
        # Display the comprehensive analysis
        try:
            recommendation_content = Markdown(final_recommendation.content)
            recommendation_panel = Panel(
                recommendation_content,
                title="[bold green]📋 Comprehensive Investment Recommendation[/bold green]",
                border_style="green",
                padding=(1, 2)
            )
        except:
            # Fallback to plain text
            recommendation_panel = Panel(
                final_recommendation.content,
                title="[bold green]📋 Comprehensive Investment Recommendation[/bold green]",
                border_style="green",
                padding=(1, 2)
            )
            
        console.print(recommendation_panel)
        
        # Show performance metrics
        console.print()
        metrics_table = Table(show_header=False, box=None, padding=(0, 2))
        metrics_table.add_column("Metric", style="dim")
        metrics_table.add_column("Value", style="bold")
        
        total_time = technical_time + fundamental_time + sentiment_time + risk_time + synthesis_time
        metrics_table.add_row("⏱️  Total Analysis Time:", f"{total_time:.2f} seconds")
        metrics_table.add_row("📈 Technical Analysis:", f"{technical_time:.2f} seconds")
        metrics_table.add_row("💰 Fundamental Analysis:", f"{fundamental_time:.2f} seconds")
        metrics_table.add_row("🎭 Sentiment Analysis:", f"{sentiment_time:.2f} seconds")
        metrics_table.add_row("⚠️  Risk Assessment:", f"{risk_time:.2f} seconds")
        metrics_table.add_row("🔄 Synthesis Phase:", f"{synthesis_time:.2f} seconds")
        metrics_table.add_row("🎯 Pattern Used:", "Collaborate (Parallel + Consensus)")
        metrics_table.add_row("🤖 Analysts Involved:", "5 (Technical, Fundamental, Sentiment, Risk, Lead Strategist)")
        
        console.print(metrics_table)
        console.print()
        
        console.print("[dim]This pattern shows how multiple specialized agents can analyze a problem in parallel,[/dim]")
        console.print("[dim]then combine their insights to reach a more robust, comprehensive conclusion.[/dim]")

def main():
    """Main function to run the Collaborate Pattern demo"""
    
    # Check for AWS credentials
    if not os.getenv("AWS_ACCESS_KEY_ID") or not os.getenv("AWS_SECRET_ACCESS_KEY"):
        console.print("[red]❌ Error: AWS credentials not found in environment variables.[/red]")
        console.print("[yellow]Please copy .env.example to .env and add your AWS credentials.[/yellow]")
        return
    
    try:
        demo = CollaboratePatternDemo()
        demo.display_header()
        demo.display_analysts()
        
        # Demonstrate with a single, predefined investment
        investment = "Apple Inc. (AAPL) - Technology giant with diverse product portfolio"
        console.print("[bold]Demonstrating Collaborate Pattern with Investment Analysis Panel[/bold]\n")
        
        demo.demonstrate_collaboration(investment)
        
        console.print("\n[bold green]Collaborate Pattern Demo Complete![/bold green]")
    
    except KeyboardInterrupt:
        console.print("\n[yellow]Demo interrupted by user. Goodbye! 👋[/yellow]")
    except Exception as e:
        console.print(f"[red]❌ Error running demo: {str(e)}[/red]")
        console.print("[dim]Make sure you have installed all requirements: pip install -r requirements.txt[/dim]")

if __name__ == "__main__":
    main()
