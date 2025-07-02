#!/usr/bin/env python3

"""
Multi-Agent Pattern Demo Launcher
A simple script to launch any of the four multi-agent pattern demos
"""

import os
import subprocess
import sys
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

console = Console()

def display_header():
    """Display the launcher header"""
    header = Panel.fit(
        "[bold blue]🤖 Multi-Agent Pattern Demo Launcher[/bold blue]\n"
        "[dim]Choose a multi-agent pattern demo to run[/dim]",
        border_style="blue"
    )
    console.print(header)
    console.print()

def display_patterns():
    """Display available patterns"""
    table = Table(title="Available Multi-Agent Patterns", show_header=True, header_style="bold magenta")
    table.add_column("#", style="cyan", no_wrap=True)
    table.add_column("Pattern", style="green")
    table.add_column("Description", style="yellow")
    table.add_column("Example", style="dim")
    
    patterns = [
        ("1", "Route", "Directing queries to specialized agents", "Multilingual customer support"),
        ("2", "Coordinate", "Sequential workflow with handoffs", "Research → Write → Edit pipeline"),
        ("3", "Collaborate", "Parallel experts with synthesis", "Investment analysis panel"),
        ("4", "Compete", "Market-based selection mechanism", "Freelance project bidding"),
    ]
    
    for number, pattern, description, example in patterns:
        table.add_row(number, pattern, description, example)
    
    console.print(table)
    console.print()

def run_demo(choice):
    """Run the selected demo"""
    try:
        if choice == "1":
            console.print("[bold]Launching Route Pattern Demo...[/bold]")
            os.system("python route_pattern_demo.py")
        elif choice == "2":
            console.print("[bold]Launching Coordinate Pattern Demo...[/bold]")
            os.system("python coordinate_pattern_demo.py")
        elif choice == "3":
            console.print("[bold]Launching Collaborate Pattern Demo...[/bold]")
            os.system("python collaborate_pattern_demo.py")
        elif choice == "4":
            console.print("[bold]Launching Compete Pattern Demo...[/bold]")
            os.system("python competitive_pattern_demo.py")
        elif choice == "5":
            console.print("[bold]Launching Free Model Demo...[/bold]")
            os.system("python free_model_demo.py")
        else:
            console.print("[red]Invalid choice. Please try again.[/red]")
    except Exception as e:
        console.print(f"[red]Error running demo: {str(e)}[/red]")

def main():
    display_header()
    display_patterns()
    
    # Check if pattern is provided as command-line argument
    if len(sys.argv) > 1 and sys.argv[1] in ["1", "2", "3", "4", "5"]:
        run_demo(sys.argv[1])
    else:
        choice = console.input("Choose a pattern demo to run (1-5) or 'q' to quit: ").strip().lower()
        
        if choice == 'q':
            console.print("[yellow]Goodbye! 👋[/yellow]")
            return
        
        run_demo(choice)

if __name__ == "__main__":
    main()
