"""
Multi-Agent Pattern Demo Launcher
Launch demonstrations of different multi-agent system patterns
"""

import os
import sys
import argparse
from dotenv import load_dotenv
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

# Import individual demos
try:
    from route_pattern_demo import RoutePatternDemo
    from coordinate_pattern_demo import CoordinatePatternDemo
    from collaborate_pattern_demo import CollaboratePatternDemo
    from loop_pattern_demo import LoopPatternDemo
    from network_pattern_demo import NetworkPatternDemo
    from hierarchical_pattern_demo import HierarchicalPatternDemo
except ImportError as e:
    print(f"Error importing demo modules: {e}")
    print("Make sure all required modules are installed: pip install -r requirements.txt")
    sys.exit(1)

# Load environment variables
load_dotenv()
console = Console()

def display_header():
    """Display demo launcher header"""
    header = Panel.fit(
        "[bold green]🤖 Multi-Agent System Patterns Demo Launcher[/bold green]\n"
        "[dim]Interactive demonstrations of different agent collaboration patterns[/dim]",
        border_style="green"
    )
    console.print(header)
    console.print()

def display_patterns():
    """Display available patterns and descriptions"""
    table = Table(title="Available Multi-Agent Patterns", show_header=True, header_style="bold magenta")
    table.add_column("Pattern", style="cyan", no_wrap=True)
    table.add_column("Description", style="green")
    table.add_column("Demo Use Case", style="yellow")
    
    patterns = [
        ("route", "Routes tasks to specialized agents based on task characteristics", "Multilingual Support Router"),
        ("coordinate", "Sequential agent workflow with handoffs between specialists", "Content Creation Pipeline"),
        ("collaborate", "Multiple agents working simultaneously on sub-parts of a problem", "Expert Research Panel"),
        ("loop", "Iterative improvement through multiple feedback cycles", "Essay Improvement System"),
        ("network", "Agents communicate directly with each other in a web", "Party Planning Committee"),
        ("hierarchical", "Agents organized in management structure with authority levels", "Corporate Decision Making")
    ]
    
    for pattern, description, use_case in patterns:
        table.add_row(pattern, description, use_case)
    
    console.print(table)
    console.print()

def check_credentials():
    """Check for required credentials"""
    missing_creds = []
    
    if not os.getenv("AWS_ACCESS_KEY_ID"):
        missing_creds.append("AWS_ACCESS_KEY_ID")
    if not os.getenv("AWS_SECRET_ACCESS_KEY"):
        missing_creds.append("AWS_SECRET_ACCESS_KEY")
        
    if missing_creds:
        console.print(f"[red]❌ Error: Missing required credentials: {', '.join(missing_creds)}[/red]")
        console.print("[yellow]Please copy .env.example to .env and add your AWS credentials.[/yellow]")
        return False
        
    return True

def launch_demo(pattern):
    """Launch the specified pattern demo"""
    
    try:
        if pattern == "route":
            console.print("[bold cyan]Launching Route Pattern Demo...[/bold cyan]")
            from route_pattern_demo import main as route_main
            route_main()
            
        elif pattern == "coordinate":
            console.print("[bold cyan]Launching Coordinate Pattern Demo...[/bold cyan]")
            from coordinate_pattern_demo import main as coordinate_main
            coordinate_main()
            
        elif pattern == "collaborate":
            console.print("[bold cyan]Launching Collaborate Pattern Demo...[/bold cyan]")
            from collaborate_pattern_demo import main as collaborate_main
            collaborate_main()
            
        elif pattern == "loop":
            console.print("[bold cyan]Launching Loop Pattern Demo...[/bold cyan]")
            demo = LoopPatternDemo()
            demo.display_header()
            demo.display_agents()
            
            console.print("[bold]Demonstrating Loop Pattern with Essay Improvement[/bold]\n")
            
            # Essay example
            demo.demonstrate_loop_pattern("The impact of artificial intelligence on modern society")
            
            console.print("\n[bold green]Loop Pattern Demo Complete![/bold green]")
        elif pattern == "network":
            console.print("[bold cyan]Launching Network Pattern Demo...[/bold cyan]")
            demo = NetworkPatternDemo()
            demo.display_header()
            demo.display_agents()
            
            console.print("[bold]Demonstrating Network Pattern with Party Planning[/bold]\n")
            
            # Party planning example
            demo.demonstrate_network_pattern("Company Holiday Party", 75, 5000)
            
            console.print("\n[bold green]Network Pattern Demo Complete![/bold green]")
            
        elif pattern == "hierarchical":
            console.print("[bold cyan]Launching Hierarchical Pattern Demo...[/bold cyan]")
            demo = HierarchicalPatternDemo()
            demo.display_header()
            demo.display_hierarchy()
            
            console.print("[bold]Demonstrating Hierarchical Pattern with Corporate Decision Making[/bold]\n")
            
            # Project proposal example
            project_description = """
            Project: AI-Enhanced Customer Support Platform
            
            Our customer service team is overwhelmed with support tickets, with resolution times increasing by 25% 
            over the last quarter. We propose developing an AI-enhanced customer support platform that would:
            
            1. Automatically categorize and prioritize incoming support tickets
            2. Provide instant responses to common questions using a knowledge base
            3. Assist support agents with relevant information and suggested responses
            4. Offer analytics on common issues to inform product improvements
            
            Initial estimates suggest a 6-month development timeline with a budget of $500,000.
            Expected outcomes include 40% reduction in first-response time, 25% increase in customer satisfaction,
            and 15% reduction in support team workload.
            
            We're seeking executive approval to proceed with this project.
            """
            demo.demonstrate_hierarchical_pattern(project_description)
            
            console.print("\n[bold green]Hierarchical Pattern Demo Complete![/bold green]")
            
        else:
            console.print(f"[red]❌ Error: Unknown pattern '{pattern}'[/red]")
            return False
            
    except Exception as e:
        console.print(f"[red]❌ Error running demo: {str(e)}[/red]")
        return False
        
    return True

def main():
    """Main function for the demo launcher"""
    
    parser = argparse.ArgumentParser(description="Launch Multi-Agent Pattern Demos")
    parser.add_argument('pattern', nargs='?', choices=[
        'route', 'coordinate', 'collaborate', 
        'loop', 'network', 'hierarchical', 'all'
    ], help="The pattern demo to run")
    args = parser.parse_args()
    
    display_header()
    
    if not args.pattern:
        display_patterns()
        console.print("To run a demo, use: python demo_launcher.py [pattern]")
        console.print("Example: python demo_launcher.py route")
        console.print("Available patterns: route, coordinate, collaborate, loop, network, hierarchical, all")
        return
        
    if not check_credentials():
        return
        
    if args.pattern == "all":
        patterns = ['route', 'coordinate', 'collaborate', 'loop', 'network', 'hierarchical']
        for pattern in patterns:
            console.print(f"\n[bold blue]{'=' * 40}[/bold blue]")
            console.print(f"[bold blue]Running {pattern.upper()} pattern demo[/bold blue]")
            console.print(f"[bold blue]{'=' * 40}[/bold blue]\n")
            launch_demo(pattern)
            
            # Prompt between demos
            if pattern != patterns[-1]:  # Not the last pattern
                console.print("\nPress Enter to continue to next demo...", end="")
                input()
    else:
        launch_demo(args.pattern)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        console.print("\n[yellow]Demo interrupted by user. Goodbye! 👋[/yellow]")
