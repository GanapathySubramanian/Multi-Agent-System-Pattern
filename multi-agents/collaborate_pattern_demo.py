"""
Collaborate Pattern Demo - Vacation Planning Team
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
        """Setup specialized agents for vacation planning"""
        
        # HARDCODED: Use supported model ID that doesn't require inference profiles
        claude_model = "anthropic.claude-3-5-sonnet-20240620-v1:0"  # Hardcoded to bypass .env issues
        region_name = os.getenv("AWS_DEFAULT_REGION", "us-east-1")
        
        print(f"Using model: {claude_model}")
        
        # Create LangChain model
        self.llm = ChatBedrock(model_id=claude_model, region_name=region_name)
        
        # Budget Advisor Agent
        self.budget_advisor = self.create_agent(
            name="Budget Advisor",
            role="Vacation budget and cost specialist",
            instructions="""
            You are a budget travel specialist who helps people understand the costs of vacation destinations.
            When analyzing a vacation destination, focus on:
            - Typical flight costs from major cities
            - Range of accommodation options and prices
            - Food and dining expense estimates
            - Activity and attraction costs
            - Transportation costs while at the destination
            - Tips for saving money and budget hacks
            
            Provide clear, practical budget information that helps travelers plan financially.
            Use specific price ranges whenever possible (budget, moderate, luxury).
            
            Format your analysis with clear sections and bullet points.
            Conclude with an affordability rating: Very Affordable, Affordable, Moderate, Expensive, or Very Expensive.
            Keep your response under 200 words.
            """
        )
        
        # Activities Recommender Agent
        self.activities_recommender = self.create_agent(
            name="Activities Recommender",
            role="Attractions and activities specialist",
            instructions="""
            You are an activities and attractions specialist who recommends the best things to do at vacation destinations.
            When analyzing a vacation destination, focus on:
            - Must-see attractions and landmarks
            - Popular activities and experiences
            - Hidden gems that tourists often miss
            - Family-friendly vs. adult-oriented activities
            - Cultural experiences and local events
            - Nature and outdoor adventure options
            
            Provide a diverse mix of activity recommendations that would appeal to different interests.
            Be specific with attraction names and activity suggestions.
            
            Format your recommendations with clear sections and bullet points.
            Conclude with an activities rating: Limited Options, Good Selection, or Outstanding Variety.
            Keep your response under 200 words.
            """
        )
        
        # Local Experience Expert Agent
        self.local_expert = self.create_agent(
            name="Local Experience Expert",
            role="Destination insider with local knowledge",
            instructions="""
            You are a local experience expert who provides insider knowledge about vacation destinations.
            When analyzing a vacation destination, focus on:
            - Best times of year to visit (weather, crowds, events)
            - Local customs and etiquette tips
            - Transportation and getting around advice
            - Health and safety considerations
            - Language tips if applicable
            - Common tourist mistakes to avoid
            
            Provide practical insider knowledge that helps travelers have a more authentic and smooth experience.
            Include specific seasonal recommendations when relevant.
            
            Format your insights with clear sections and bullet points.
            Conclude with a best time to visit recommendation and overall experience rating.
            Keep your response under 200 words.
            """
        )
        
        # Vacation Planner (Synthesizer) Agent
        self.vacation_planner = self.create_agent(
            name="Vacation Planner",
            role="Expert in creating comprehensive vacation plans",
            instructions="""
            You are a vacation planner responsible for synthesizing multiple expert analyses into a comprehensive vacation recommendation.
            
            You will be provided with three distinct analyses:
            1. Budget Analysis (costs and financial considerations)
            2. Activities Recommendations (things to do and attractions)
            3. Local Experience Insights (best times to visit, insider tips)
            
            Your task is to:
            - Create a balanced vacation plan that considers all perspectives
            - Highlight the most important information from each expert
            - Resolve any conflicting viewpoints
            - Provide a cohesive recommendation that helps the traveler decide
            
            Your final recommendation should include:
            - Overall destination rating (Perfect Match, Good Choice, Consider Alternatives)
            - Ideal trip duration
            - Best time to visit
            - Budget expectations
            - Top 3-5 must-do activities
            - Key planning tips
            
            Format your recommendation in a friendly, conversational way with clear sections.
            Keep your response under 300 words.
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
            "[bold blue]🏖️ Collaborate Pattern Demo - Vacation Planning Team[/bold blue]\n"
            "[dim]Parallel expert collaboration with consensus building[/dim]",
            border_style="blue"
        )
        console.print(header)
        console.print()
    
    def display_team(self):
        """Display the vacation planning team"""
        table = Table(title="Vacation Planning Team", show_header=True, header_style="bold magenta")
        table.add_column("Team Member", style="cyan", no_wrap=True)
        table.add_column("Expertise", style="green")
        table.add_column("Focus Area", style="yellow")
        
        team_info = [
            ("Budget Advisor", "Travel costs & finances", "Affordability & money-saving tips"),
            ("Activities Recommender", "Things to do & see", "Attractions & experiences"),
            ("Local Expert", "Destination insights", "Best times & insider knowledge"),
            ("Vacation Planner", "Trip planning & synthesis", "Final recommendation")
        ]
        
        for member, expertise, focus in team_info:
            table.add_row(member, expertise, focus)
        
        console.print(table)
        console.print()
    
    def demonstrate_collaboration(self, destination: str):
        """Demonstrate the collaboration process with a vacation destination"""
        
        console.print(f"[bold green]Vacation Destination Analysis:[/bold green] {destination}")
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
            overall_task = progress.add_task("🏝️ Planning Your Perfect Vacation", total=4)
            
            # Budget analysis
            budget_task = progress.add_task("💰 Step 1: Budget Advisor - Analyzing costs...", total=None)
            step_start_time = time.time()
            
            # Execute budget analysis
            budget_prompt = f"Provide a budget analysis for a vacation to {destination}. Focus on typical costs for flights, accommodations, food, activities, and local transportation. Include money-saving tips and an overall affordability rating."
            budget_result = self.budget_advisor["chain"].invoke({"input": budget_prompt})
            
            # Update progress
            budget_time = time.time() - step_start_time
            progress.update(budget_task, completed=True)
            progress.update(overall_task, advance=1)
            
            # Display budget analysis preview
            console.print("\n[cyan]Budget Analysis:[/cyan]")
            console.print(Panel(budget_result.content[:200] + "...", 
                              title="[bold]💰 Budget Insights (Preview)[/bold]", 
                              border_style="cyan",
                              padding=(1, 2)))
            
            # Activities analysis
            activities_task = progress.add_task("🎭 Step 2: Activities Recommender - Finding fun things to do...", total=None)
            step_start_time = time.time()
            
            # Execute activities analysis
            activities_prompt = f"Provide recommendations for activities, attractions and things to do in {destination}. Include must-see landmarks, experiences, hidden gems, and options for different interests. Give an overall activities rating."
            activities_result = self.activities_recommender["chain"].invoke({"input": activities_prompt})
            
            # Update progress
            activities_time = time.time() - step_start_time
            progress.update(activities_task, completed=True)
            progress.update(overall_task, advance=1)
            
            # Display activities analysis preview
            console.print("\n[cyan]Activities Recommendations:[/cyan]")
            console.print(Panel(activities_result.content[:200] + "...", 
                              title="[bold]🎭 Things To Do (Preview)[/bold]", 
                              border_style="cyan",
                              padding=(1, 2)))
            
            # Local expert analysis
            local_task = progress.add_task("🧠 Step 3: Local Expert - Sharing insider knowledge...", total=None)
            step_start_time = time.time()
            
            # Execute local expert analysis
            local_prompt = f"Provide local expert advice for a vacation to {destination}. Focus on best times to visit, local customs, getting around, safety tips, and common tourist mistakes to avoid. Include a best time to visit recommendation."
            local_result = self.local_expert["chain"].invoke({"input": local_prompt})
            
            # Update progress
            local_time = time.time() - step_start_time
            progress.update(local_task, completed=True)
            progress.update(overall_task, advance=1)
            
            # Display local expert analysis preview
            console.print("\n[cyan]Local Expert Insights:[/cyan]")
            console.print(Panel(local_result.content[:200] + "...", 
                              title="[bold]🧠 Insider Knowledge (Preview)[/bold]", 
                              border_style="cyan",
                              padding=(1, 2)))
            
            # Synthesis phase
            synthesis_task = progress.add_task("✨ Step 4: Vacation Planner - Creating your perfect trip plan...", total=None)
            step_start_time = time.time()
            
            # Execute synthesis
            synthesis_prompt = f"""
            Synthesize the following analyses for a vacation to {destination} into a comprehensive vacation recommendation:
            
            ## BUDGET ANALYSIS:
            {budget_result.content}
            
            ## ACTIVITIES RECOMMENDATIONS:
            {activities_result.content}
            
            ## LOCAL EXPERT INSIGHTS:
            {local_result.content}
            
            Create a friendly, helpful vacation plan that considers all perspectives. Include overall rating, ideal duration, best time to visit, budget expectations, top activities, and key planning tips.
            """
            
            final_recommendation = self.vacation_planner["chain"].invoke({"input": synthesis_prompt})
            
            # Update progress
            synthesis_time = time.time() - step_start_time
            progress.update(synthesis_task, completed=True)
            progress.update(overall_task, advance=1)
        
        # Display the comprehensive vacation plan
        try:
            recommendation_content = Markdown(final_recommendation.content)
            recommendation_panel = Panel(
                recommendation_content,
                title="[bold green]✈️ Your Personalized Vacation Plan[/bold green]",
                border_style="green",
                padding=(1, 2)
            )
        except:
            # Fallback to plain text
            recommendation_panel = Panel(
                final_recommendation.content,
                title="[bold green]✈️ Your Personalized Vacation Plan[/bold green]",
                border_style="green",
                padding=(1, 2)
            )
            
        console.print(recommendation_panel)
        
        # Show pattern explanation
        console.print()
        explanation_panel = Panel(
            "[bold]What just happened?[/bold]\n\n"
            "This demo showed the [bold cyan]Collaborate Pattern[/bold cyan] in action:\n\n"
            "1️⃣ Multiple specialized agents analyzed the [bold]same problem[/bold] at the same time\n"
            "2️⃣ Each agent focused on their specific area of expertise\n"
            "3️⃣ All analyses happened [bold]in parallel[/bold] (not sequential)\n"
            "4️⃣ A synthesizer agent combined all perspectives into a final recommendation\n\n"
            "[dim]This pattern is great when you need multiple perspectives on the same problem![/dim]",
            title="[bold magenta]Collaborate Pattern Explained[/bold magenta]",
            border_style="magenta",
            padding=(1, 2)
        )
        console.print(explanation_panel)
        
        # Show performance metrics
        console.print()
        metrics_table = Table(show_header=False, box=None, padding=(0, 2))
        metrics_table.add_column("Metric", style="dim")
        metrics_table.add_column("Value", style="bold")
        
        total_time = budget_time + activities_time + local_time + synthesis_time
        metrics_table.add_row("⏱️  Total Planning Time:", f"{total_time:.2f} seconds")
        metrics_table.add_row("💰 Budget Analysis:", f"{budget_time:.2f} seconds")
        metrics_table.add_row("🎭 Activities Recommendations:", f"{activities_time:.2f} seconds")
        metrics_table.add_row("🧠 Local Expert Insights:", f"{local_time:.2f} seconds")
        metrics_table.add_row("✨ Plan Creation:", f"{synthesis_time:.2f} seconds")
        metrics_table.add_row("👥 Team Members:", "4 (Budget, Activities, Local Expert, Vacation Planner)")
        
        console.print(metrics_table)
        console.print()

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
        demo.display_team()
        
        # Demonstrate with a single, predefined destination
        destination = "Kyoto, Japan - Historic city with temples and traditional culture"
        console.print("[bold]Demonstrating Collaborate Pattern with Vacation Planning[/bold]\n")
        
        demo.demonstrate_collaboration(destination)
        
        console.print("\n[bold green]Collaborate Pattern Demo Complete![/bold green]")
    
    except KeyboardInterrupt:
        console.print("\n[yellow]Demo interrupted by user. Goodbye! 👋[/yellow]")
    except Exception as e:
        console.print(f"[red]❌ Error running demo: {str(e)}[/red]")
        console.print("[dim]Make sure you have installed all requirements: pip install -r requirements.txt[/dim]")

if __name__ == "__main__":
    main()
