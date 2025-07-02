"""
Coordinate Pattern Demo - Research Article Generator
Demonstrates sequential workflow coordination with multiple specialized agents
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
from langchain.schema.runnable import RunnablePassthrough

# Load environment variables
load_dotenv()

console = Console()

class CoordinatePatternDemo:
    def __init__(self):
        self.console = console
        self.setup_agents()
    
    def setup_agents(self):
        """Setup specialized agents for content creation workflow"""
        
        # HARDCODED: Use supported model ID that doesn't require inference profiles
        claude_model = "anthropic.claude-3-5-sonnet-20240620-v1:0"  # Hardcoded to bypass .env issues
        region_name = os.getenv("AWS_DEFAULT_REGION", "us-east-1")
        
        print(f"Using model: {claude_model}")
        
        # Create LangChain model
        self.llm = ChatBedrock(model_id=claude_model, region_name=region_name)
        
        # Research Agent - finds and analyzes information
        self.researcher = self.create_agent(
            name="Research Specialist",
            role="Expert researcher who finds and analyzes relevant information",
            instructions="""
            You are a thorough research specialist with expertise in finding and analyzing information.
            When given a topic, provide comprehensive research including:
            - Key concepts and definitions
            - Current trends and developments 
            - Important statistics and data points
            - Notable experts and thought leaders
            - Recent news and developments
            - Potential angles and perspectives to explore
            
            Structure your research in a clear, organized format that a writer can easily use.
            Focus on accuracy, relevance, and comprehensiveness.
            """
        )
        
        # Writer Agent - creates structured content
        self.writer = self.create_agent(
            name="Content Writer",
            role="Professional writer who creates engaging, well-structured articles",
            instructions="""
            You are a professional content writer specializing in creating engaging, informative articles.
            Using the research provided, create a well-structured article that includes:
            - Compelling headline and introduction
            - Clear section headings and logical flow
            - Engaging narrative that connects ideas
            - Relevant examples and case studies
            - Data and statistics to support points
            - Conclusion that ties everything together
            
            Write in a professional yet accessible tone suitable for a business audience.
            Aim for approximately 800-1000 words with clear structure and good readability.
            """
        )
        
        # Editor Agent - refines and polishes content
        self.editor = self.create_agent(
            name="Senior Editor",
            role="Experienced editor who refines content for clarity, accuracy, and impact",
            instructions="""
            You are a senior editor with expertise in refining content for maximum impact.
            Review the provided article and improve it by:
            - Enhancing clarity and readability
            - Strengthening the narrative flow
            - Improving word choice and sentence structure
            - Ensuring factual accuracy and consistency
            - Adding compelling transitions between sections
            - Optimizing the headline and conclusion
            - Ensuring the tone is appropriate for the target audience
            
            Provide the final polished version ready for publication.
            Maintain the original structure while enhancing quality and impact.
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
            "[bold blue]📝 Coordinate Pattern Demo - Research Article Generator[/bold blue]\n"
            "[dim]Sequential workflow coordination: Research → Write → Edit[/dim]",
            border_style="blue"
        )
        console.print(header)
        console.print()
    
    def display_workflow(self):
        """Display the workflow steps"""
        table = Table(title="Content Creation Workflow", show_header=True, header_style="bold magenta")
        table.add_column("Step", style="cyan", no_wrap=True)
        table.add_column("Agent", style="green")
        table.add_column("Task", style="yellow")
        table.add_column("Model", style="dim")
        
        workflow_steps = [
            ("1", "Research Specialist", "Find and analyze information", "Claude 3.5 Sonnet"),
            ("2", "Content Writer", "Create structured article", "Claude 3.5 Sonnet"),
            ("3", "Senior Editor", "Refine and polish content", "Claude 3.5 Sonnet")
        ]
        
        for step, agent, task, model in workflow_steps:
            table.add_row(step, agent, task, model)
        
        console.print(table)
        console.print()
    
    def demonstrate_coordination(self, topic: str):
        """Demonstrate the coordination process with a specific topic"""
        
        console.print(f"[bold green]Article Topic:[/bold green] {topic}")
        console.print()
        
        # Create progress tracking
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            BarColumn(),
            TaskProgressColumn(),
            console=console,
        ) as progress:
            
            # Overall progress
            overall_task = progress.add_task("📊 Overall Progress", total=3)
            
            # Step 1: Research
            research_task = progress.add_task("🔍 Step 1: Research Phase - Gathering information...", total=None)
            step_start_time = time.time()
            
            # Execute research
            research_prompt = f"Provide comprehensive research on the topic: {topic}"
            research_result = self.researcher["chain"].invoke({"input": research_prompt})
            
            # Update progress
            research_time = time.time() - step_start_time
            progress.update(research_task, completed=True)
            progress.update(overall_task, advance=1)
            
            # Display research results
            console.print("\n[cyan]Research Results:[/cyan]")
            console.print(Panel(research_result.content[:300] + "...", 
                               title="[bold]Research Summary (Preview)[/bold]", 
                               border_style="cyan",
                               padding=(1, 2)))
            
            # Step 2: Writing
            writing_task = progress.add_task("✍️  Step 2: Writing Phase - Creating article...", total=None)
            step_start_time = time.time()
            
            # Execute writing
            writing_prompt = f"""
            Create a well-structured article based on this research:
            
            {research_result.content}
            
            Topic: {topic}
            """
            
            article_draft = self.writer["chain"].invoke({"input": writing_prompt})
            
            # Update progress
            writing_time = time.time() - step_start_time
            progress.update(writing_task, completed=True)
            progress.update(overall_task, advance=1)
            
            # Display article draft preview
            console.print("\n[cyan]Article Draft:[/cyan]")
            console.print(Panel(article_draft.content[:300] + "...", 
                               title="[bold]Article Draft (Preview)[/bold]", 
                               border_style="cyan",
                               padding=(1, 2)))
            
            # Step 3: Editing
            editing_task = progress.add_task("📝 Step 3: Editing Phase - Polishing content...", total=None)
            step_start_time = time.time()
            
            # Execute editing
            editing_prompt = f"""
            Edit and improve this article draft:
            
            {article_draft.content}
            """
            
            final_article = self.editor["chain"].invoke({"input": editing_prompt})
            
            # Update progress
            editing_time = time.time() - step_start_time
            progress.update(editing_task, completed=True)
            progress.update(overall_task, advance=1)
        
        # Display the final article
        try:
            article_content = Markdown(final_article.content)
            article_panel = Panel(
                article_content,
                title="[bold green]📄 Final Article[/bold green]",
                border_style="green",
                padding=(1, 2)
            )
        except:
            # Fallback to plain text
            article_panel = Panel(
                final_article.content,
                title="[bold green]📄 Final Article[/bold green]",
                border_style="green",
                padding=(1, 2)
            )
            
        console.print(article_panel)
        
        # Show performance metrics
        console.print()
        metrics_table = Table(show_header=False, box=None, padding=(0, 2))
        metrics_table.add_column("Metric", style="dim")
        metrics_table.add_column("Value", style="bold")
        
        total_time = research_time + writing_time + editing_time
        metrics_table.add_row("⏱️  Total Processing Time:", f"{total_time:.2f} seconds")
        metrics_table.add_row("🔍 Research Phase:", f"{research_time:.2f} seconds")
        metrics_table.add_row("✍️  Writing Phase:", f"{writing_time:.2f} seconds")
        metrics_table.add_row("📝 Editing Phase:", f"{editing_time:.2f} seconds")
        metrics_table.add_row("🎯 Pattern Used:", "Coordinate (Sequential Workflow)")
        metrics_table.add_row("🤖 Agents Involved:", "3 (Research → Write → Edit)")
        
        console.print(metrics_table)
        console.print()
        
        return final_article.content

def main():
    """Main function to run the Coordinate Pattern demo"""
    
    # Check for AWS credentials
    if not os.getenv("AWS_ACCESS_KEY_ID") or not os.getenv("AWS_SECRET_ACCESS_KEY"):
        console.print("[red]❌ Error: AWS credentials not found in environment variables.[/red]")
        console.print("[yellow]Please copy .env.example to .env and add your AWS credentials.[/yellow]")
        return
    
    try:
        demo = CoordinatePatternDemo()
        demo.display_header()
        demo.display_workflow()
        
        # Demonstrate with a single, predefined topic
        article_topic = "The Future of Artificial Intelligence in Business: Opportunities and Challenges"
        console.print("[bold]Demonstrating Coordinate Pattern with Content Creation Workflow[/bold]\n")
        
        demo.demonstrate_coordination(article_topic)
        
        console.print("\n[bold green]Coordinate Pattern Demo Complete![/bold green]")
        console.print("[dim]This pattern shows how specialized agents can work together in a sequential workflow,[/dim]")
        console.print("[dim]each building upon the output of the previous stage to create a refined final product.[/dim]")
    
    except KeyboardInterrupt:
        console.print("\n[yellow]Demo interrupted by user. Goodbye! 👋[/yellow]")
    except Exception as e:
        console.print(f"[red]❌ Error running demo: {str(e)}[/red]")
        console.print("[dim]Make sure you have installed all requirements: pip install -r requirements.txt[/dim]")

if __name__ == "__main__":
    main()
