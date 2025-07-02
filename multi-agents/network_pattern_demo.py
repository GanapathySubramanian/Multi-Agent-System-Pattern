"""
Network Pattern Demo - Party Planning Committee
Demonstrates agents communicating directly with each other in a web-like structure
"""

import os
import time
import random
from typing import Dict, Any, List, Tuple
from dotenv import load_dotenv
from rich.console import Console
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich.table import Table
from rich import box
from rich.layout import Layout

# Import LangChain components
from langchain_aws import ChatBedrock
from langchain.prompts import ChatPromptTemplate

# Load environment variables
load_dotenv()

console = Console()

class NetworkPatternDemo:
    def __init__(self):
        self.console = console
        self.setup_agents()
        self.messages_exchanged = 0
        self.communication_log = []
    
    def setup_agents(self):
        """Setup specialized agents for the party planning committee"""
        
        # HARDCODED: Use supported model ID that doesn't require inference profiles
        claude_model = "anthropic.claude-3-5-sonnet-20240620-v1:0"  # Hardcoded to bypass .env issues
        region_name = os.getenv("AWS_DEFAULT_REGION", "us-east-1")
        
        print(f"Using model: {claude_model}")
        
        # Create LangChain model
        self.llm = ChatBedrock(model_id=claude_model, region_name=region_name)
        
        # Venue Coordinator
        self.venue_agent = self.create_agent(
            name="Venue Coordinator",
            role="Party venue and logistics specialist",
            instructions="""
            You are responsible for securing and managing the party venue.
            Your expertise includes space requirements, venue availability, setup/cleanup, and logistics.
            You need to coordinate with the Budget Manager on costs and the Food Coordinator on space requirements.
            You can directly communicate with any team member to discuss venue-related issues.
            When making suggestions, consider the party theme, estimated attendance, and budget constraints.
            """
        )
        
        # Budget Manager
        self.budget_agent = self.create_agent(
            name="Budget Manager", 
            role="Financial planner and cost controller",
            instructions="""
            You are responsible for managing the party budget and expenses.
            Your expertise includes cost estimation, budget allocation, and financial tracking.
            You need to coordinate with all team members to ensure their plans fit within budget constraints.
            You can directly communicate with any team member to discuss budget-related issues.
            When making decisions, prioritize critical elements while finding cost-effective solutions.
            """
        )
        
        # Food Coordinator
        self.food_agent = self.create_agent(
            name="Food Coordinator", 
            role="Catering and refreshments manager",
            instructions="""
            You are responsible for planning and coordinating all food and beverages.
            Your expertise includes catering options, menu planning, dietary accommodations, and serving logistics.
            You need to coordinate with the Budget Manager on costs and the Theme Designer on menu-theme alignment.
            You can directly communicate with any team member to discuss food-related issues.
            When making suggestions, consider variety, quality, and presentation that matches the party theme.
            """
        )
        
        # Entertainment Director
        self.entertainment_agent = self.create_agent(
            name="Entertainment Director", 
            role="Activities and entertainment planner",
            instructions="""
            You are responsible for planning all entertainment and activities.
            Your expertise includes games, music, performances, and guest engagement.
            You need to coordinate with the Theme Designer on theme-appropriate activities and the Venue Coordinator on space requirements.
            You can directly communicate with any team member to discuss entertainment-related issues.
            When making suggestions, focus on engaging activities that suit the audience and create memorable experiences.
            """
        )
        
        # Theme Designer
        self.theme_agent = self.create_agent(
            name="Theme Designer",
            role="Creative direction and decoration specialist",
            instructions="""
            You are responsible for developing the party theme and decorations.
            Your expertise includes design concepts, decor elements, color schemes, and visual planning.
            You need to coordinate with all team members to ensure theme cohesion across venue, food, and entertainment.
            You can directly communicate with any team member to discuss theme-related issues.
            When making suggestions, focus on creating an immersive, cohesive atmosphere that enhances the guest experience.
            """
        )
        
        # Create agent network
        self.agents = {
            "Venue Coordinator": self.venue_agent,
            "Budget Manager": self.budget_agent,
            "Food Coordinator": self.food_agent,
            "Entertainment Director": self.entertainment_agent,
            "Theme Designer": self.theme_agent
        }
    
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
    
    def agent_communicate(self, sender: str, receiver: str, message_context: str) -> str:
        """Simulate communication between two agents"""
        
        # The sender crafts a message
        sender_agent = self.agents[sender]
        prompt_to_sender = f"""
        You are communicating with the {receiver} about {message_context}.
        Write a brief, professional message addressing your specific needs, questions, or suggestions.
        Focus only on the most important information that requires their input or approval.
        Keep your message under 100 words, clear, and to the point.
        """
        sender_response = sender_agent["chain"].invoke({"input": prompt_to_sender})
        message = sender_response.content
        
        # Log the communication
        self.communication_log.append({
            "from": sender,
            "to": receiver, 
            "context": message_context,
            "message": message
        })
        self.messages_exchanged += 1
        
        # The receiver reads and responds
        receiver_agent = self.agents[receiver]
        prompt_to_receiver = f"""
        You received this message from the {sender}:
        
        "{message}"
        
        Write a brief, professional response addressing their points and providing your input.
        Be constructive and solution-oriented in your reply.
        Keep your response under 100 words, clear, and to the point.
        """
        receiver_response = receiver_agent["chain"].invoke({"input": prompt_to_receiver})
        response = receiver_response.content
        
        # Log the response
        self.communication_log.append({
            "from": receiver,
            "to": sender,
            "context": f"Response to {message_context}",
            "message": response
        })
        self.messages_exchanged += 1
        
        return message, response
    
    def generate_party_plan(self, party_type: str, attendees: int, budget: int) -> Dict[str, str]:
        """Generate a comprehensive party plan through agent collaboration"""
        
        plan_components = {}
        
        # Initialize each agent with the basic parameters
        for agent_name, agent in self.agents.items():
            initialization_prompt = f"""
            You are planning a {party_type} for {attendees} people with a budget of ${budget}.
            Based on your role as {agent_name}, what are your initial thoughts and considerations?
            Provide a brief overview of your preliminary plan or concerns.
            """
            
            response = agent["chain"].invoke({"input": initialization_prompt})
            plan_components[agent_name] = response.content
        
        return plan_components
    
    def collaborative_refinement(self, party_type: str, attendees: int, budget: int, 
                               initial_plans: Dict[str, str]) -> Dict[str, str]:
        """Refine plans through network communication between agents"""
        
        # Define key collaboration points
        collaborations = [
            ("Budget Manager", "Venue Coordinator", "venue cost allocation"),
            ("Theme Designer", "Entertainment Director", "theme-aligned activities"),
            ("Food Coordinator", "Budget Manager", "catering budget options"),
            ("Venue Coordinator", "Entertainment Director", "space requirements for activities"),
            ("Theme Designer", "Food Coordinator", "theme-appropriate menu"),
            ("Entertainment Director", "Budget Manager", "entertainment cost options"),
            ("Food Coordinator", "Venue Coordinator", "food service logistics"),
            ("Theme Designer", "Budget Manager", "decoration budget allocation")
        ]
        
        # Shuffle to demonstrate non-linear communication
        random.shuffle(collaborations)
        
        # Process each collaboration
        refined_plans = initial_plans.copy()
        
        for sender, receiver, context in collaborations:
            console.print(f"[dim]→ {sender} communicating with {receiver} about {context}...[/dim]")
            
            # Agents communicate
            message, response = self.agent_communicate(sender, receiver, context)
            
            # Update the refined plans based on this communication
            sender_update_prompt = f"""
            You are planning a {party_type} for {attendees} people with a budget of ${budget}.
            
            Your current plan is:
            {refined_plans[sender]}
            
            You just discussed {context} with the {receiver}, who responded:
            "{response}"
            
            Update your plan based on this feedback. Incorporate relevant suggestions and address any concerns.
            Provide your complete revised plan, not just the changes.
            """
            
            sender_update = self.agents[sender]["chain"].invoke({"input": sender_update_prompt})
            refined_plans[sender] = sender_update.content
            
            # Also update the receiver's plan
            receiver_update_prompt = f"""
            You are planning a {party_type} for {attendees} people with a budget of ${budget}.
            
            Your current plan is:
            {refined_plans[receiver]}
            
            You just discussed {context} with the {sender}, who said:
            "{message}"
            
            And you responded:
            "{response}"
            
            Update your plan based on this conversation. Incorporate relevant information and address any necessary changes.
            Provide your complete revised plan, not just the changes.
            """
            
            receiver_update = self.agents[receiver]["chain"].invoke({"input": receiver_update_prompt})
            refined_plans[receiver] = receiver_update.content
        
        return refined_plans
    
    def finalize_party_plan(self, party_type: str, attendees: int, budget: int, 
                           refined_plans: Dict[str, str]) -> str:
        """Create final party plan by synthesizing all agent contributions"""
        
        # Compile all refined plans
        all_plans_text = "\n\n".join([f"## {name} Plan:\n{plan}" for name, plan in refined_plans.items()])
        
        # Create a prompt for the synthesizer (using Budget Manager as final synthesizer)
        synthesis_prompt = f"""
        You are finalizing plans for a {party_type} for {attendees} people with a budget of ${budget}.
        
        Each team member has contributed their refined plans:
        
        {all_plans_text}
        
        As the Budget Manager, create a comprehensive, well-organized final party plan that synthesizes all these inputs.
        Structure your plan into these sections:
        1. Overview & Theme
        2. Venue & Logistics
        3. Food & Beverages
        4. Entertainment & Activities
        5. Decorations & Atmosphere
        6. Budget Breakdown
        
        Ensure all elements are aligned with each other and within budget. Resolve any inconsistencies between different plans.
        The final plan should be cohesive, practical, and ready to implement.
        """
        
        synthesis_response = self.budget_agent["chain"].invoke({"input": synthesis_prompt})
        return synthesis_response.content
    
    def display_header(self):
        """Display demo header"""
        header = Panel.fit(
            "[bold blue]🥂 Network Pattern Demo - Party Planning Committee[/bold blue]\n"
            "[dim]Agents communicating directly in a web-like structure[/dim]",
            border_style="blue"
        )
        console.print(header)
        console.print()
    
    def display_agents(self):
        """Display participating agents"""
        table = Table(title="Party Planning Committee", show_header=True, header_style="bold magenta")
        table.add_column("Agent", style="cyan", no_wrap=True)
        table.add_column("Role", style="green")
        table.add_column("Responsibilities", style="yellow")
        
        agents_info = [
            ("Venue Coordinator", "Logistics Specialist", "Venue selection, space planning, setup"),
            ("Budget Manager", "Financial Controller", "Cost tracking, budget allocation, financial decisions"),
            ("Food Coordinator", "Catering Manager", "Menu planning, refreshments, dietary accommodations"),
            ("Entertainment Director", "Activities Planner", "Games, music, performances, guest engagement"),
            ("Theme Designer", "Creative Director", "Theme development, decor, visual atmosphere")
        ]
        
        for agent, role, responsibilities in agents_info:
            table.add_row(agent, role, responsibilities)
        
        console.print(table)
        console.print()
    
    def display_network_diagram(self):
        """Display a visual representation of the agent network"""
        console.print("[bold cyan]Agent Communication Network:[/bold cyan]")
        
        console.print("""
        ┌─────────────────┐       ┌─────────────────┐
        │                 │◄─────►│                 │
        │ Venue           │       │ Budget          │
        │ Coordinator     │       │ Manager         │
        │                 │       │                 │
        └────────┬────────┘       └───────┬─────────┘
                 │                        │
                 │                        │
                 ▼        ┌──────┐        ▼
          ┌──────────────►│      │◄──────────────┐
          │               │      │               │
          │               │      │               │
          │               └──────┘               │
          │                  ▲                   │
          │                  │                   │
          │                  │                   │
          │                  │                   │
        ┌─┴───────────────┐ │ ┌─────────────────┴┐
        │                 │ │ │                  │
        │ Food            │ │ │ Entertainment    │
        │ Coordinator     │ │ │ Director         │
        │                 │ │ │                  │
        └────────┬────────┘ │ └─────────┬────────┘
                 │          │           │
                 │          │           │
                 └──────────┐           │
                            ▼           │
                     ┌─────────────────┐│
                     │                 ││
                     │ Theme           ││
                     │ Designer        ││
                     │                 ││
                     └──────────┬──────┘│
                                │       │
                                └───────┘
        """, style="bright_blue")
        console.print("[dim]Note: All agents can communicate directly with each other in a network structure[/dim]")
        console.print()
    
    def demonstrate_network_pattern(self, party_type: str, attendees: int, budget: int):
        """Demonstrate the network pattern with party planning"""
        
        console.print(f"[bold green]Party Planning Request:[/bold green] {party_type} for {attendees} people (Budget: ${budget})")
        console.print()
        
        # Display the network structure
        self.display_network_diagram()
        
        start_time = time.time()
        
        # Phase 1: Initial planning
        console.print("[bold yellow]Phase 1: Initial Planning[/bold yellow]")
        
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            console=console,
        ) as progress:
            task = progress.add_task("🔄 Agents developing initial plans...", total=None)
            
            initial_plans = self.generate_party_plan(party_type, attendees, budget)
            
            progress.update(task, completed=True)
        
        console.print()
        
        # Display initial plans summary
        console.print("[bold cyan]Initial Planning Summary:[/bold cyan]")
        
        for agent, plan in initial_plans.items():
            # Truncate for display if too long
            display_plan = plan[:150] + "..." if len(plan) > 150 else plan
            
            panel = Panel(
                display_plan,
                title=f"[bold]{agent} - Initial Plan[/bold]",
                border_style="dim",
                width=80
            )
            console.print(panel)
        
        console.print()
        
        # Phase 2: Collaborative refinement
        console.print("[bold yellow]Phase 2: Collaborative Network Communication[/bold yellow]")
        console.print("[dim]Agents are now communicating directly with each other to refine their plans...[/dim]")
        
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            console=console,
        ) as progress:
            task = progress.add_task("🔄 Cross-functional collaboration in progress...", total=None)
            
            refined_plans = self.collaborative_refinement(party_type, attendees, budget, initial_plans)
            
            progress.update(task, completed=True)
        
        console.print()
        
        # Display communication statistics
        stats_table = Table(show_header=False, box=None, padding=(0, 2))
        stats_table.add_column("Metric", style="dim")
        stats_table.add_column("Value", style="bold")
        
        stats_table.add_row("📨 Messages Exchanged:", str(self.messages_exchanged))
        stats_table.add_row("🔄 Communication Pairs:", str(len(self.communication_log) // 2))
        stats_table.add_row("🌐 Network Structure:", "Full-mesh (all-to-all)")
        
        console.print(stats_table)
        console.print()
        
        # Display sample of communications
        console.print("[bold cyan]Sample Communications:[/bold cyan]")
        
        for i, comm in enumerate(self.communication_log[:6]):  # Show first few communications
            panel = Panel(
                f"[bold]{comm['from']} → {comm['to']}[/bold] ({comm['context']})\n\n{comm['message']}",
                border_style="dim",
                width=80
            )
            console.print(panel)
            if i < 5:  # Don't add newline after last panel
                console.print()
        
        if len(self.communication_log) > 6:
            console.print(f"[dim]...{len(self.communication_log) - 6} more communications...[/dim]")
        
        console.print()
        
        # Phase 3: Final plan synthesis
        console.print("[bold yellow]Phase 3: Final Plan Synthesis[/bold yellow]")
        
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            console=console,
        ) as progress:
            task = progress.add_task("🔄 Synthesizing final party plan...", total=None)
            
            final_plan = self.finalize_party_plan(party_type, attendees, budget, refined_plans)
            
            progress.update(task, completed=True)
        
        console.print()
        
        # Display the final plan
        plan_panel = Panel(
            final_plan,
            title=f"[bold green]Final {party_type} Plan[/bold green]",
            border_style="green",
            padding=(1, 2)
        )
        console.print(plan_panel)
        
        end_time = time.time()
        processing_time = end_time - start_time
        
        # Show performance summary
        console.print()
        summary_table = Table(show_header=False, box=None, padding=(0, 2))
        summary_table.add_column("Metric", style="dim")
        summary_table.add_column("Value", style="bold")
        
        summary_table.add_row("⏱️  Total Processing Time:", f"{processing_time:.2f} seconds")
        summary_table.add_row("🔄 Pattern Used:", "Network (Web-like Communication)")
        summary_table.add_row("👥 Agents Involved:", str(len(self.agents)))
        summary_table.add_row("🔁 Communication Rounds:", str(len(self.communication_log) // 2))
        
        console.print(summary_table)
        console.print()

def main():
    """Main function to run the Network Pattern demo"""
    
    # Check for AWS credentials
    if not os.getenv("AWS_ACCESS_KEY_ID") or not os.getenv("AWS_SECRET_ACCESS_KEY"):
        console.print("[red]❌ Error: AWS credentials not found in environment variables.[/red]")
        console.print("[yellow]Please copy .env.example to .env and add your AWS credentials.[/yellow]")
        return
    
    try:
        demo = NetworkPatternDemo()
        demo.display_header()
        demo.display_agents()
        
        console.print("[bold]Demonstrating Network Pattern with Party Planning[/bold]\n")
        
        # Example party planning scenario
        demo.demonstrate_network_pattern("Company Holiday Party", 75, 5000)
        
        console.print("\n[bold green]Network Pattern Demo Complete![/bold green]")
    
    except KeyboardInterrupt:
        console.print("\n[yellow]Demo interrupted by user. Goodbye! 👋[/yellow]")
    except Exception as e:
        console.print(f"[red]❌ Error running demo: {str(e)}[/red]")
        console.print("[dim]Make sure you have installed all requirements: pip install -r requirements.txt[/dim]")

if __name__ == "__main__":
    main()
