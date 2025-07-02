"""
Loop Pattern Demo - Essay Improvement System
Demonstrates iterative improvement through multiple agents working in sequence repeatedly
"""

import os
import time
from typing import Dict, Any, List
from dotenv import load_dotenv
from rich.console import Console
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich.table import Table
from rich.markdown import Markdown

# Import LangChain components
from langchain_aws import ChatBedrock
from langchain.prompts import ChatPromptTemplate

# Load environment variables
load_dotenv()

console = Console()

class LoopPatternDemo:
    def __init__(self):
        self.console = console
        self.setup_agents()
        self.max_iterations = 3  # Maximum number of improvement loops
    
    def setup_agents(self):
        """Setup specialized agents for the essay improvement system"""
        
        # HARDCODED: Use supported model ID that doesn't require inference profiles
        claude_model = "anthropic.claude-3-5-sonnet-20240620-v1:0"  # Hardcoded to bypass .env issues
        region_name = os.getenv("AWS_DEFAULT_REGION", "us-east-1")
        
        print(f"Using model: {claude_model}")
        
        # Create LangChain model
        self.llm = ChatBedrock(model_id=claude_model, region_name=region_name)
        
        # Writer Agent - Creates the initial draft
        self.writer_agent = self.create_agent(
            name="Writer Agent",
            role="Essay content creator",
            instructions="""
            You are a professional writer who creates initial essay drafts.
            Create well-structured, informative content on the provided topic.
            Focus on clarity and organization of ideas.
            Include an introduction, main points, and a conclusion.
            Keep the essay between 300-400 words.
            """
        )
        
        # Editor Agent - Improves the content and structure
        self.editor_agent = self.create_agent(
            name="Editor Agent", 
            role="Content editor and improver",
            instructions="""
            You are a professional editor who improves essay drafts.
            Review the essay for clarity, structure, flow, and coherence.
            Improve transitions between paragraphs and strengthen arguments.
            Fix any organizational issues and enhance the overall structure.
            Provide specific improvements while maintaining the original intent and scope.
            Return the improved version of the essay, not just feedback.
            Keep the essay between 300-400 words.
            """
        )
        
        # Quality Evaluator Agent - Assesses quality and suggests improvements
        self.evaluator_agent = self.create_agent(
            name="Quality Evaluator Agent", 
            role="Essay quality assessor",
            instructions="""
            You are a quality assessment expert who evaluates essays.
            Review the provided essay and assess its quality on a scale from 1-10 (10 being best).
            Consider factors like clarity, coherence, argumentation, and engagement.
            
            Provide a brief quality assessment with:
            1. Numerical score (1-10)
            2. 2-3 specific strengths
            3. 2-3 specific areas for improvement
            4. Decision: Should the essay go through another improvement cycle? Answer "Yes" or "No"
            
            Format your response exactly as follows:
            Score: [1-10]
            Strengths: [List 2-3 strengths]
            Areas to Improve: [List 2-3 areas]
            Continue Iteration: [Yes/No]
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
    
    def generate_initial_draft(self, topic: str) -> str:
        """Generate initial essay draft"""
        prompt = f"Write an informative essay about: {topic}"
        response = self.writer_agent["chain"].invoke({"input": prompt})
        return response.content
    
    def improve_essay(self, essay: str) -> str:
        """Improve the essay draft"""
        prompt = f"Please improve the following essay:\n\n{essay}"
        response = self.editor_agent["chain"].invoke({"input": prompt})
        return response.content
    
    def evaluate_quality(self, essay: str) -> Dict[str, Any]:
        """Evaluate essay quality and determine if another iteration is needed"""
        prompt = f"Evaluate the quality of this essay:\n\n{essay}"
        response = self.evaluator_agent["chain"].invoke({"input": prompt})
        evaluation = response.content
        
        # Parse the evaluation
        score_line = next((line for line in evaluation.split('\n') if line.startswith("Score:")), "Score: 0")
        score = int(score_line.split(":")[1].strip().split("/")[0].strip()) if "/" in score_line else int(score_line.split(":")[1].strip())
        
        continue_line = next((line for line in evaluation.split('\n') if line.startswith("Continue Iteration:")), "Continue Iteration: No")
        continue_iteration = continue_line.split(":")[1].strip().lower() == "yes"
        
        return {
            "evaluation": evaluation,
            "score": score,
            "continue_iteration": continue_iteration and score < 9  # Stop if score is 9 or higher
        }
    
    def display_header(self):
        """Display demo header"""
        header = Panel.fit(
            "[bold blue]🔄 Loop Pattern Demo - Essay Improvement System[/bold blue]\n"
            "[dim]Iterative improvement through feedback loops[/dim]",
            border_style="blue"
        )
        console.print(header)
        console.print()
    
    def display_agents(self):
        """Display participating agents"""
        table = Table(title="Essay Improvement System Agents", show_header=True, header_style="bold magenta")
        table.add_column("Agent", style="cyan", no_wrap=True)
        table.add_column("Role", style="green")
        table.add_column("Function", style="yellow")
        
        agents_info = [
            ("Writer Agent", "Content Creator", "Generates initial essay draft"),
            ("Editor Agent", "Content Editor", "Improves essay structure and flow"),
            ("Quality Evaluator", "Quality Assessor", "Evaluates quality and determines if more iterations are needed")
        ]
        
        for agent, role, function in agents_info:
            table.add_row(agent, role, function)
        
        console.print(table)
        console.print()
    
    def demonstrate_loop_pattern(self, topic: str):
        """Demonstrate the loop pattern with essay improvement"""
        
        console.print(f"[bold green]Essay Topic:[/bold green] {topic}")
        console.print()
        
        # Track all versions for final comparison
        essay_versions = []
        quality_scores = []
        
        # Generate initial draft
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            console=console,
        ) as progress:
            task1 = progress.add_task("🖋️ Writer Agent generating initial draft...", total=None)
            start_time = time.time()
            
            initial_draft = self.generate_initial_draft(topic)
            essay_versions.append(initial_draft)
            
            progress.update(task1, completed=True)
        
        console.print()
        console.print("[bold blue]Initial Draft:[/bold blue]")
        console.print(Panel(initial_draft[:300] + "..." if len(initial_draft) > 300 else initial_draft, 
                           title="Initial Draft (Preview)", 
                           border_style="blue"))
        console.print()
        
        # Iterative improvement loop
        current_essay = initial_draft
        iteration = 1
        
        while iteration <= self.max_iterations:
            console.print(f"[bold yellow]Improvement Iteration {iteration}:[/bold yellow]")
            
            # Improve essay
            with Progress(
                SpinnerColumn(),
                TextColumn("[progress.description]{task.description}"),
                console=console,
            ) as progress:
                task1 = progress.add_task(f"✏️ Editor Agent improving draft (Iteration {iteration})...", total=None)
                
                improved_essay = self.improve_essay(current_essay)
                essay_versions.append(improved_essay)
                
                progress.update(task1, completed=True)
                
                # Evaluate quality
                task2 = progress.add_task(f"🔍 Quality Evaluator assessing essay...", total=None)
                
                evaluation_result = self.evaluate_quality(improved_essay)
                quality_scores.append(evaluation_result["score"])
                
                progress.update(task2, completed=True)
            
            console.print()
            
            # Display evaluation
            eval_panel = Panel(
                evaluation_result["evaluation"],
                title=f"[bold]Quality Assessment - Iteration {iteration}[/bold]",
                border_style="yellow"
            )
            console.print(eval_panel)
            console.print()
            
            # Update current essay for next iteration
            current_essay = improved_essay
            
            # Check if we should continue
            if not evaluation_result["continue_iteration"] or iteration == self.max_iterations:
                console.print(f"[bold green]{'✅ Essay quality is satisfactory!' if not evaluation_result['continue_iteration'] else '⏱️ Maximum iterations reached.'}")
                break
                
            console.print("↪️ [bold]Continuing to next improvement iteration...[/bold]\n")
            iteration += 1
        
        # Show final essay
        console.print("[bold green]Final Essay Version:[/bold green]")
        console.print(Panel(Markdown(current_essay), title="Final Essay", border_style="green"))
        
        # Show improvement metrics
        console.print()
        metrics_table = Table(title="Improvement Metrics", show_header=True, header_style="bold cyan")
        metrics_table.add_column("Iteration", style="dim")
        metrics_table.add_column("Quality Score", style="yellow")
        metrics_table.add_column("Improvement", style="green")
        
        for i, score in enumerate(quality_scores):
            improvement = "-" if i == 0 else f"+{score - quality_scores[i-1]}" if score > quality_scores[i-1] else f"{score - quality_scores[i-1]}"
            metrics_table.add_row(str(i+1), f"{score}/10", improvement)
        
        console.print(metrics_table)
        console.print()
        
        end_time = time.time()
        processing_time = end_time - start_time
        
        # Show performance summary
        console.print()
        summary_table = Table(show_header=False, box=None, padding=(0, 2))
        summary_table.add_column("Metric", style="dim")
        summary_table.add_column("Value", style="bold")
        
        summary_table.add_row("⏱️  Total Processing Time:", f"{processing_time:.2f} seconds")
        summary_table.add_row("🔄 Pattern Used:", "Loop (Iterative Improvement)")
        summary_table.add_row("🔁 Iterations Performed:", f"{iteration} of {self.max_iterations} max")
        summary_table.add_row("📈 Final Quality Score:", f"{quality_scores[-1]}/10")
        
        console.print(summary_table)
        console.print()

def main():
    """Main function to run the Loop Pattern demo"""
    
    # Check for AWS credentials
    if not os.getenv("AWS_ACCESS_KEY_ID") or not os.getenv("AWS_SECRET_ACCESS_KEY"):
        console.print("[red]❌ Error: AWS credentials not found in environment variables.[/red]")
        console.print("[yellow]Please copy .env.example to .env and add your AWS credentials.[/yellow]")
        return
    
    try:
        demo = LoopPatternDemo()
        demo.display_header()
        demo.display_agents()
        
        console.print("[bold]Demonstrating Loop Pattern with Essay Improvement[/bold]\n")
        
        # Example topic
        demo.demonstrate_loop_pattern("The impact of artificial intelligence on modern society")
        
        console.print("\n[bold green]Loop Pattern Demo Complete![/bold green]")
    
    except KeyboardInterrupt:
        console.print("\n[yellow]Demo interrupted by user. Goodbye! 👋[/yellow]")
    except Exception as e:
        console.print(f"[red]❌ Error running demo: {str(e)}[/red]")
        console.print("[dim]Make sure you have installed all requirements: pip install -r requirements.txt[/dim]")

if __name__ == "__main__":
    main()
