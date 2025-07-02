"""
Competitive Pattern Demo - Freelance Project Bidding System
Demonstrates competitive agent behavior with market-based selection mechanisms
"""

import os
import time
from typing import Dict, Any, List
from dotenv import load_dotenv
from rich.console import Console
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn, TaskProgressColumn
from rich.table import Table
import random

# Import LangChain components
from langchain_aws import ChatBedrock
from langchain.prompts import ChatPromptTemplate

# Load environment variables
load_dotenv()

console = Console()

class CompetitivePatternDemo:
    def __init__(self):
        self.console = console
        self.setup_agents()
    
    def setup_agents(self):
        """Setup competitive freelancer agents with different strategies"""
        
        # HARDCODED: Use supported model ID that doesn't require inference profiles
        claude_model = "anthropic.claude-3-5-sonnet-20240620-v1:0"  # Hardcoded to bypass .env issues
        region_name = os.getenv("AWS_DEFAULT_REGION", "us-east-1")
        
        print(f"Using model: {claude_model}")
        
        # Create LangChain model
        self.llm = ChatBedrock(model_id=claude_model, region_name=region_name)
        
        # Budget-Focused Freelancer
        self.budget_freelancer = self.create_agent(
            name="Budget Specialist",
            role="Cost-effective freelancer focused on competitive pricing",
            instructions="""
            You are a budget-focused freelancer who competes primarily on price.
            Your bidding strategy focuses on:
            - Offering competitive, low-cost solutions
            - Emphasizing value for money
            - Quick turnaround times to offset lower rates
            - Efficient, no-frills approach
            - Building long-term relationships through affordability
            
            When bidding on projects, always emphasize cost savings and efficiency.
            Provide realistic but competitive timelines and highlight your cost-effective approach.
            Be honest about your capabilities while positioning yourself as the budget-friendly option.
            Your prices should be significantly lower than market rates.
            """
        )
        
        # Premium Quality Freelancer
        self.premium_freelancer = self.create_agent(
            name="Premium Expert",
            role="High-end freelancer focused on premium quality and expertise",
            instructions="""
            You are a premium freelancer who competes on quality, expertise, and exceptional results.
            Your bidding strategy focuses on:
            - Demonstrating superior expertise and experience
            - Highlighting premium quality and attention to detail
            - Showcasing past successes and client testimonials
            - Offering comprehensive solutions and ongoing support
            - Justifying higher rates with exceptional value
            
            When bidding on projects, emphasize your expertise, quality standards, and track record.
            Explain why premium pricing leads to better outcomes and ROI.
            Position yourself as the expert choice for clients who value quality over cost.
            Your prices will be higher than others but justified by superior results.
            """
        )
        
        # Speed-Focused Freelancer
        self.speed_freelancer = self.create_agent(
            name="Speed Demon",
            role="Fast-delivery freelancer focused on quick turnaround times",
            instructions="""
            You are a speed-focused freelancer who competes on fast delivery and quick turnaround.
            Your bidding strategy focuses on:
            - Offering the fastest possible delivery times
            - Emphasizing urgency and rapid execution
            - Highlighting your ability to work under tight deadlines
            - Providing immediate availability and quick start times
            - Balancing speed with reasonable quality
            
            When bidding on projects, always lead with your speed advantage.
            Provide aggressive but realistic timelines and explain your rapid delivery process.
            Position yourself as the go-to choice for urgent projects and tight deadlines.
            Your delivery timeframes should be much faster than typical freelancers.
            """
        )
        
        # Store all freelancers
        self.freelancers = [
            self.budget_freelancer,
            self.premium_freelancer,
            self.speed_freelancer
        ]
    
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
            "[bold blue]💰 Competitive Pattern Demo - Freelance Project Bidding[/bold blue]\n"
            "[dim]Market-based competition with multiple bidding strategies[/dim]",
            border_style="blue"
        )
        console.print(header)
        console.print()
    
    def display_freelancers(self):
        """Display the competing freelancers"""
        table = Table(title="Competing Freelancers", show_header=True, header_style="bold magenta")
        table.add_column("Freelancer", style="cyan", no_wrap=True)
        table.add_column("Strategy", style="green")
        table.add_column("Competitive Advantage", style="yellow")
        
        freelancer_info = [
            ("Budget Specialist", "Cost-focused", "Lowest prices & value for money"),
            ("Premium Expert", "Quality-focused", "Superior expertise & results"),
            ("Speed Demon", "Time-focused", "Fastest delivery & quick turnaround")
        ]
        
        for freelancer, strategy, advantage in freelancer_info:
            table.add_row(freelancer, strategy, advantage)
        
        console.print(table)
        console.print()
    
    def get_individual_bid(self, freelancer: Dict[str, Any], project: str) -> Dict[str, Any]:
        """Get a bid from an individual freelancer"""
        
        bid_prompt = f"""
        You are bidding on this project: {project}
        
        Please provide your bid in the following format:
        
        **BID PROPOSAL**
        
        **Price:** $[amount] USD
        **Delivery Time:** [X] days/weeks
        **Key Strengths:** [Your main competitive advantages for this project]
        **Approach:** [Brief description of how you'll tackle this project]
        **Why Choose Me:** [Your unique value proposition]
        
        Make your bid competitive based on your specialization and strategy.
        Be specific with pricing and timelines.
        """
        
        try:
            response = freelancer["chain"].invoke({"input": bid_prompt})
            return {
                "freelancer": freelancer["name"],
                "bid_content": response.content,
                "success": True
            }
        except Exception as e:
            return {
                "freelancer": freelancer["name"],
                "bid_content": f"Error generating bid: {str(e)}",
                "success": False
            }
    
    def extract_bid_details(self, bid_content: str) -> Dict[str, Any]:
        """Extract structured details from bid content"""
        # Simple extraction logic
        lines = bid_content.split('\n')
        
        price = "Not specified"
        delivery_time = "Not specified"
        
        for line in lines:
            line = line.strip()
            if line.startswith('**Price:**') or line.startswith('Price:'):
                price = line.split(':', 1)[1].strip()
            elif line.startswith('**Delivery Time:**') or line.startswith('Delivery Time:'):
                delivery_time = line.split(':', 1)[1].strip()
        
        # Extract numeric price for comparison
        price_numeric = 0
        try:
            import re
            price_match = re.search(r'\$?(\d+(?:,\d+)*(?:\.\d+)?)', price)
            if price_match:
                price_numeric = float(price_match.group(1).replace(',', ''))
        except:
            price_numeric = random.randint(500, 5000)  # Fallback random price
        
        # Extract delivery days
        delivery_days = 0
        try:
            import re
            delivery_match = re.search(r'(\d+)\s*(day|week)', delivery_time.lower())
            if delivery_match:
                days = int(delivery_match.group(1))
                if 'week' in delivery_match.group(2):
                    days *= 7
                delivery_days = days
        except:
            delivery_days = random.randint(3, 30)  # Fallback random days
        
        return {
            "price": price,
            "price_numeric": price_numeric,
            "delivery_time": delivery_time,
            "delivery_days": delivery_days
        }
    
    def select_winner(self, bids: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Select the winning bid based on a scoring algorithm"""
        
        if not bids:
            return None
        
        # Calculate scores for each bid
        for bid in bids:
            details = bid["details"]
            
            # Scoring algorithm (can be customized)
            price_score = max(0, 100 - (details["price_numeric"] / 50))  # Lower price = higher score
            speed_score = max(0, 100 - (details["delivery_days"] * 2))   # Faster delivery = higher score
            
            # Add some randomness for demonstration (simulating other factors)
            quality_score = random.randint(60, 95)
            reputation_score = random.randint(70, 90)
            
            # Weighted total score
            total_score = (
                price_score * 0.3 +
                speed_score * 0.25 +
                quality_score * 0.25 +
                reputation_score * 0.2
            )
            
            bid["score"] = total_score
        
        # Return the highest scoring bid
        winner = max(bids, key=lambda x: x["score"])
        return winner
    
    def demonstrate_competition(self, project: str):
        """Demonstrate the competitive bidding process"""
        
        console.print(f"[bold green]Project for Bidding:[/bold green] {project}")
        console.print()
        
        # Show bidding progress
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            BarColumn(),
            TaskProgressColumn(),
            console=console,
        ) as progress:
            
            # Overall progress
            overall_task = progress.add_task("📊 Bidding Process", total=len(self.freelancers))
            
            # Individual bidding tasks
            bidding_tasks = []
            for freelancer in self.freelancers:
                task = progress.add_task(f"💼 {freelancer['name']}: Preparing bid...", total=None)
                bidding_tasks.append(task)
            
            start_time = time.time()
            
            # Get bids from all freelancers
            bids = []
            for i, freelancer in enumerate(self.freelancers):
                bid_result = self.get_individual_bid(freelancer, project)
                bids.append(bid_result)
                
                # Update progress
                progress.update(bidding_tasks[i], completed=True)
                progress.update(overall_task, advance=1)
                
                # Small delay for visual effect
                time.sleep(0.5)
            
            end_time = time.time()
            total_processing_time = end_time - start_time
        
        console.print()
        
        # Display all bids
        console.print("[bold cyan]📋 Submitted Bids:[/bold cyan]")
        console.print()
        
        successful_bids = []
        
        for bid in bids:
            if bid["success"]:
                # Extract bid details
                details = self.extract_bid_details(bid["bid_content"])
                bid["details"] = details
                successful_bids.append(bid)
                
                # Display individual bid
                bid_panel = Panel(
                    bid["bid_content"],
                    title=f"[bold]{bid['freelancer']}[/bold]",
                    border_style="blue",
                    padding=(1, 2)
                )
                console.print(bid_panel)
                console.print()
            else:
                console.print(f"[red]❌ {bid['freelancer']}: Failed to submit bid[/red]")
        
        if successful_bids:
            # Select winner
            winner = self.select_winner(successful_bids)
            
            if winner:
                # Display winner announcement
                winner_panel = Panel(
                    f"[bold green]🏆 WINNING BID[/bold green]\n\n"
                    f"**Winner:** {winner['freelancer']}\n"
                    f"**Price:** {winner['details']['price']}\n"
                    f"**Delivery:** {winner['details']['delivery_time']}\n"
                    f"**Score:** {winner['score']:.1f}/100\n\n"
                    f"[dim]This freelancer offered the best overall value proposition based on price, delivery time, quality, and reputation factors.[/dim]",
                    title="[bold green]🎯 Auction Result[/bold green]",
                    border_style="green",
                    padding=(1, 2)
                )
                console.print(winner_panel)
                
                # Display bid comparison table
                console.print()
                comparison_table = Table(title="Bid Comparison", show_header=True, header_style="bold magenta")
                comparison_table.add_column("Freelancer", style="cyan")
                comparison_table.add_column("Price", style="green")
                comparison_table.add_column("Delivery", style="yellow")
                comparison_table.add_column("Score", style="bold")
                comparison_table.add_column("Status", style="dim")
                
                for bid in successful_bids:
                    status = "🏆 WINNER" if bid == winner else "Bid submitted"
                    comparison_table.add_row(
                        bid['freelancer'],
                        bid['details']['price'],
                        bid['details']['delivery_time'],
                        f"{bid['score']:.1f}",
                        status
                    )
                
                console.print(comparison_table)
        
        # Show performance metrics
        console.print()
        metrics_table = Table(show_header=False, box=None, padding=(0, 2))
        metrics_table.add_column("Metric", style="dim")
        metrics_table.add_column("Value", style="bold")
        
        metrics_table.add_row("⏱️  Total Bidding Time:", f"{total_processing_time:.2f} seconds")
        metrics_table.add_row("🎯 Pattern Used:", "Competitive (Market-based Selection)")
        metrics_table.add_row("🤖 Bidders Involved:", f"{len(successful_bids)} freelancers")
        metrics_table.add_row("📊 Selection Method:", "Multi-factor scoring algorithm")
        
        console.print(metrics_table)
        console.print()
        
        console.print("[dim]This pattern shows how competitive dynamics can drive optimization through market-like mechanisms.[/dim]")
        console.print("[dim]Each agent optimizes for their own strategy, and a selection process determines the best solution.[/dim]")

def main():
    """Main function to run the Competitive Pattern demo"""
    
    # Check for AWS credentials
    if not os.getenv("AWS_ACCESS_KEY_ID") or not os.getenv("AWS_SECRET_ACCESS_KEY"):
        console.print("[red]❌ Error: AWS credentials not found in environment variables.[/red]")
        console.print("[yellow]Please copy .env.example to .env and add your AWS credentials.[/yellow]")
        return
    
    try:
        demo = CompetitivePatternDemo()
        demo.display_header()
        demo.display_freelancers()
        
        # Demonstrate with a single, predefined project
        project = "Design and develop a company website with e-commerce functionality and responsive design"
        console.print("[bold]Demonstrating Competitive Pattern with Freelance Project Bidding[/bold]\n")
        
        demo.demonstrate_competition(project)
        
        console.print("\n[bold green]Competitive Pattern Demo Complete![/bold green]")
    
    except KeyboardInterrupt:
        console.print("\n[yellow]Demo interrupted by user. Goodbye! 👋[/yellow]")
    except Exception as e:
        console.print(f"[red]❌ Error running demo: {str(e)}[/red]")
        console.print("[dim]Make sure you have installed all requirements: pip install -r requirements.txt[/dim]")

if __name__ == "__main__":
    main()
