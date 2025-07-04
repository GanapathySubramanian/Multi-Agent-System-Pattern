"""
Hierarchical Pattern Demo - Software Project Team
Demonstrates agents organized in a management hierarchy with different levels of authority
"""

import os
import time
from typing import Dict, Any, List
from dotenv import load_dotenv
from rich.console import Console
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich.table import Table
from rich.tree import Tree

# Import LangChain components
from langchain_aws import ChatBedrock
from langchain.prompts import ChatPromptTemplate

# Load environment variables
load_dotenv()

console = Console()

class HierarchicalPatternDemo:
    def __init__(self):
        self.console = console
        self.setup_agents()
    
    def setup_agents(self):
        """Setup agents in a project management hierarchy"""
        
        # HARDCODED: Use supported model ID that doesn't require inference profiles
        claude_model = "anthropic.claude-3-5-sonnet-20240620-v1:0"  # Hardcoded to bypass .env issues
        region_name = os.getenv("AWS_DEFAULT_REGION", "us-east-1")
        
        print(f"Using model: {claude_model}")
        
        # Create LangChain model
        self.llm = ChatBedrock(model_id=claude_model, region_name=region_name)
        
        # Project Manager - Top level
        self.project_manager_agent = self.create_agent(
            name="Project Manager",
            role="Overall project leader",
            instructions="""
            You are the Project Manager for a software development team.
            Your responsibilities include:
            - Setting project priorities and deadlines
            - Delegating tasks to your team leads
            - Making high-level decisions about project direction
            - Ensuring all parts of the project come together successfully
            
            Keep your communications clear, decisive, and focused on project goals.
            """
        )
        
        # Development Lead - Mid level
        self.dev_lead_agent = self.create_agent(
            name="Development Lead", 
            role="Technical implementation leader",
            instructions="""
            You are the Development Lead reporting to the Project Manager.
            Your responsibilities include:
            - Breaking down technical requirements into specific tasks
            - Delegating implementation work to developers
            - Resolving technical questions and blockers
            - Ensuring code quality and technical feasibility
            
            Focus on translating project requirements into clear technical tasks.
            """
        )
        
        # QA Lead - Mid level
        self.qa_lead_agent = self.create_agent(
            name="QA Lead", 
            role="Testing and quality assurance leader",
            instructions="""
            You are the QA Lead reporting to the Project Manager.
            Your responsibilities include:
            - Creating test plans and acceptance criteria
            - Delegating specific testing tasks to testers
            - Verifying test results and identifying issues
            - Ensuring overall product quality
            
            Focus on comprehensive testing strategies and quality standards.
            """
        )
        
        # Frontend Developer - Worker level
        self.frontend_dev_agent = self.create_agent(
            name="Frontend Developer",
            role="UI implementation specialist",
            instructions="""
            You are a Frontend Developer reporting to the Development Lead.
            Your responsibilities include:
            - Implementing user interface components
            - Creating responsive and accessible designs
            - Integrating with backend APIs
            - Testing and debugging frontend code
            
            Focus on specific implementation tasks assigned to you.
            """
        )
        
        # Backend Developer - Worker level
        self.backend_dev_agent = self.create_agent(
            name="Backend Developer",
            role="Server-side implementation specialist",
            instructions="""
            You are a Backend Developer reporting to the Development Lead.
            Your responsibilities include:
            - Implementing server-side functionality
            - Creating and optimizing API endpoints
            - Managing database interactions
            - Ensuring security and performance
            
            Focus on specific implementation tasks assigned to you.
            """
        )
        
        # Functional Tester - Worker level
        self.functional_tester_agent = self.create_agent(
            name="Functional Tester",
            role="Feature verification specialist",
            instructions="""
            You are a Functional Tester reporting to the QA Lead.
            Your responsibilities include:
            - Testing specific features for correctness
            - Verifying user workflows and scenarios
            - Identifying and documenting bugs
            - Validating fixes and improvements
            
            Focus on specific testing tasks assigned to you.
            """
        )
        
        # Performance Tester - Worker level
        self.performance_tester_agent = self.create_agent(
            name="Performance Tester",
            role="System performance specialist",
            instructions="""
            You are a Performance Tester reporting to the QA Lead.
            Your responsibilities include:
            - Testing system performance under load
            - Identifying bottlenecks and inefficiencies
            - Measuring response times and resource usage
            - Verifying scalability and stability
            
            Focus on specific testing tasks assigned to you.
            """
        )
        
        # Create hierarchy structure
        self.hierarchy = {
            "Project Manager": {
                "agent": self.project_manager_agent,
                "reports": ["Development Lead", "QA Lead"]
            },
            "Development Lead": {
                "agent": self.dev_lead_agent,
                "reports": ["Frontend Developer", "Backend Developer"],
                "reports_to": "Project Manager"
            },
            "QA Lead": {
                "agent": self.qa_lead_agent,
                "reports": ["Functional Tester", "Performance Tester"],
                "reports_to": "Project Manager"
            },
            "Frontend Developer": {
                "agent": self.frontend_dev_agent,
                "reports": [],
                "reports_to": "Development Lead"
            },
            "Backend Developer": {
                "agent": self.backend_dev_agent,
                "reports": [],
                "reports_to": "Development Lead"
            },
            "Functional Tester": {
                "agent": self.functional_tester_agent,
                "reports": [],
                "reports_to": "QA Lead"
            },
            "Performance Tester": {
                "agent": self.performance_tester_agent,
                "reports": [],
                "reports_to": "QA Lead"
            }
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
    
    def worker_level_implementation(self, feature_description: str) -> Dict[str, str]:
        """Workers implement their specific parts of the feature"""
        console.print("[bold yellow]Phase 1: Worker Level Implementation[/bold yellow]")
        
        worker_outputs = {}
        
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            console=console,
        ) as progress:
            # Frontend Developer implementation
            task1 = progress.add_task("💻 Frontend Developer implementing UI components...", total=None)
            
            frontend_prompt = f"""
            As the Frontend Developer, you've been assigned to implement the UI components for this feature:
            
            {feature_description}
            
            Please provide:
            1. Your implementation approach for the UI components
            2. Key technologies and libraries you'll use
            3. Any clarifications you need from your lead
            4. Estimated time to complete
            
            Keep your response under 150 words, focused on your specific implementation tasks.
            """
            
            frontend_response = self.frontend_dev_agent["chain"].invoke({"input": frontend_prompt})
            worker_outputs["Frontend Developer"] = frontend_response.content
            progress.update(task1, completed=True)
            
            # Backend Developer implementation
            task2 = progress.add_task("🖥️ Backend Developer implementing server functionality...", total=None)
            
            backend_prompt = f"""
            As the Backend Developer, you've been assigned to implement the server-side components for this feature:
            
            {feature_description}
            
            Please provide:
            1. Your implementation approach for the server-side functionality
            2. Key APIs and data structures you'll create
            3. Any clarifications you need from your lead
            4. Estimated time to complete
            
            Keep your response under 150 words, focused on your specific implementation tasks.
            """
            
            backend_response = self.backend_dev_agent["chain"].invoke({"input": backend_prompt})
            worker_outputs["Backend Developer"] = backend_response.content
            progress.update(task2, completed=True)
            
            # Functional Tester implementation
            task3 = progress.add_task("🔍 Functional Tester creating test cases...", total=None)
            
            functional_prompt = f"""
            As the Functional Tester, you need to create test cases for this feature:
            
            {feature_description}
            
            Please provide:
            1. Key test scenarios you'll verify
            2. Test data requirements
            3. Edge cases you'll focus on
            4. Expected outcomes for the main test cases
            
            Keep your response under 150 words, focused on functional testing specifics.
            """
            
            functional_response = self.functional_tester_agent["chain"].invoke({"input": functional_prompt})
            worker_outputs["Functional Tester"] = functional_response.content
            progress.update(task3, completed=True)
            
            # Performance Tester implementation
            task4 = progress.add_task("📊 Performance Tester creating load tests...", total=None)
            
            performance_prompt = f"""
            As the Performance Tester, you need to create performance tests for this feature:
            
            {feature_description}
            
            Please provide:
            1. Key performance metrics you'll measure
            2. Load testing approach
            3. Performance expectations and thresholds
            4. Tools and methods you'll use
            
            Keep your response under 150 words, focused on performance testing specifics.
            """
            
            performance_response = self.performance_tester_agent["chain"].invoke({"input": performance_prompt})
            worker_outputs["Performance Tester"] = performance_response.content
            progress.update(task4, completed=True)
        
        # Display worker implementations
        console.print()
        for worker, output in worker_outputs.items():
            console.print(Panel(
                output[:200] + "..." if len(output) > 200 else output, 
                title=f"[bold]{worker} Implementation[/bold]", 
                border_style="dim",
                padding=(1, 1)
            ))
            console.print()
        
        return worker_outputs
    
    def mid_level_review(self, feature_description: str, worker_outputs: Dict[str, str]) -> Dict[str, str]:
        """Mid-level managers review worker output and provide feedback"""
        console.print("[bold yellow]Phase 2: Mid-Level Management Review[/bold yellow]")
        
        mid_level_reviews = {}
        
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            console=console,
        ) as progress:
            # Development Lead reviews developer outputs
            task1 = progress.add_task("👨‍💼 Development Lead reviewing code implementations...", total=None)
            
            dev_lead_prompt = f"""
            As the Development Lead, review the implementations from your team members for this feature:
            
            Feature: {feature_description}
            
            Frontend Developer's Implementation:
            {worker_outputs["Frontend Developer"]}
            
            Backend Developer's Implementation:
            {worker_outputs["Backend Developer"]}
            
            Please provide:
            1. Your assessment of both implementations
            2. Feedback for improvements
            3. Integration considerations between frontend and backend
            4. Recommendation to the Project Manager
            
            Keep your review under 200 words, focused on technical quality and integration.
            """
            
            dev_lead_response = self.dev_lead_agent["chain"].invoke({"input": dev_lead_prompt})
            mid_level_reviews["Development Lead"] = dev_lead_response.content
            progress.update(task1, completed=True)
            
            # QA Lead reviews tester outputs
            task2 = progress.add_task("👩‍💼 QA Lead reviewing test plans...", total=None)
            
            qa_lead_prompt = f"""
            As the QA Lead, review the test plans from your team members for this feature:
            
            Feature: {feature_description}
            
            Functional Tester's Test Plan:
            {worker_outputs["Functional Tester"]}
            
            Performance Tester's Test Plan:
            {worker_outputs["Performance Tester"]}
            
            Please provide:
            1. Your assessment of both test plans
            2. Additional test scenarios to consider
            3. Overall test coverage assessment
            4. Recommendation to the Project Manager
            
            Keep your review under 200 words, focused on test quality and coverage.
            """
            
            qa_lead_response = self.qa_lead_agent["chain"].invoke({"input": qa_lead_prompt})
            mid_level_reviews["QA Lead"] = qa_lead_response.content
            progress.update(task2, completed=True)
        
        # Display mid-level reviews
        console.print()
        for manager, review in mid_level_reviews.items():
            console.print(Panel(
                review, 
                title=f"[bold]{manager} Review[/bold]", 
                border_style="blue",
                padding=(1, 1)
            ))
            console.print()
        
        return mid_level_reviews
    
    def top_level_decision(self, feature_description: str, mid_level_reviews: Dict[str, str]) -> str:
        """Project Manager makes final decision based on all inputs"""
        console.print("[bold yellow]Phase 3: Top-Level Decision[/bold yellow]")
        
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            console=console,
        ) as progress:
            task = progress.add_task("🏢 Project Manager making final decision...", total=None)
            
            # Compile all reviews
            all_reviews = "\n\n".join([f"## {manager} Review:\n{review}" for manager, review in mid_level_reviews.items()])
            
            pm_prompt = f"""
            As the Project Manager, make a final decision about this feature implementation:
            
            Feature: {feature_description}
            
            Team Lead Reviews:
            {all_reviews}
            
            Please provide your final decision including:
            
            ## Implementation Decision
            [Approve to Proceed / Request Changes / Hold for More Information]
            
            ## Rationale
            [Explain your decision based on the team's input]
            
            ## Next Steps
            [Clear direction for the team on what happens next]
            
            ## Timeline
            [Updated timeline expectations]
            
            Keep your decision under 250 words, focused on clarity and direction.
            """
            
            pm_response = self.project_manager_agent["chain"].invoke({"input": pm_prompt})
            final_decision = pm_response.content
            
            progress.update(task, completed=True)
        
        return final_decision
    
    def display_header(self):
        """Display demo header"""
        header = Panel.fit(
            "[bold blue]👨‍💼 Hierarchical Pattern Demo - Software Project Team[/bold blue]\n"
            "[dim]Agents organized in a management hierarchy with different levels of authority[/dim]",
            border_style="blue"
        )
        console.print(header)
        console.print()
    
    def display_hierarchy(self):
        """Display the team hierarchy"""
        tree = Tree("🏢 [bold]Project Team Hierarchy[/bold]", guide_style="dim")
        
        # Add Project Manager
        pm_node = tree.add("[bold blue]Project Manager[/bold blue] (Top Level)")
        
        # Add Team Leads
        dev_node = pm_node.add("[bold cyan]Development Lead[/bold cyan] (Mid Level)")
        qa_node = pm_node.add("[bold magenta]QA Lead[/bold magenta] (Mid Level)")
        
        # Add Team Members
        dev_node.add("[green]Frontend Developer[/green] (Worker Level)")
        dev_node.add("[green]Backend Developer[/green] (Worker Level)")
        qa_node.add("[green]Functional Tester[/green] (Worker Level)")
        qa_node.add("[green]Performance Tester[/green] (Worker Level)")
        
        console.print(tree)
        console.print()
        
        # Display information flow
        console.print("[bold cyan]Information & Decision Flow:[/bold cyan]")
        console.print("[dim]1. Worker Level: Implements specific tasks[/dim]")
        console.print("[dim]2. Mid Level: Reviews, coordinates, and provides guidance[/dim]")
        console.print("[dim]3. Top Level: Makes final decisions and sets direction[/dim]")
        console.print()
    
    def demonstrate_hierarchical_pattern(self, feature_description: str):
        """Demonstrate the hierarchical pattern with a software feature implementation"""
        
        console.print(f"[bold green]Feature Request:[/bold green] {feature_description}")
        console.print()
        
        start_time = time.time()
        
        # Phase 1: Worker level implementation
        worker_outputs = self.worker_level_implementation(feature_description)
        
        # Phase 2: Mid-level review
        mid_level_reviews = self.mid_level_review(feature_description, worker_outputs)
        
        # Phase 3: Top-level decision
        final_decision = self.top_level_decision(feature_description, mid_level_reviews)
        
        # Display final decision
        console.print(Panel(
            final_decision,
            title="[bold green]Project Manager's Final Decision[/bold green]",
            border_style="green",
            padding=(1, 2)
        ))
        
        end_time = time.time()
        processing_time = end_time - start_time
        
        # Show pattern explanation
        console.print()
        explanation_panel = Panel(
            "[bold]What just happened?[/bold]\n\n"
            "This demo showed the [bold cyan]Hierarchical Pattern[/bold cyan] in action:\n\n"
            "1️⃣ Workers at the bottom level implemented specific components\n"
            "2️⃣ Mid-level managers reviewed, provided feedback, and coordinated\n"
            "3️⃣ Top-level manager made the final decision based on all inputs\n\n"
            "[dim]This pattern is great when clear authority and accountability is needed![/dim]",
            title="[bold magenta]Hierarchical Pattern Explained[/bold magenta]",
            border_style="magenta",
            padding=(1, 2)
        )
        console.print(explanation_panel)
        
        # Show performance summary
        console.print()
        summary_table = Table(show_header=False, box=None, padding=(0, 2))
        summary_table.add_column("Metric", style="dim")
        summary_table.add_column("Value", style="bold")
        
        summary_table.add_row("⏱️  Total Processing Time:", f"{processing_time:.2f} seconds")
        summary_table.add_row("🔄 Pattern Used:", "Hierarchical (Management Structure)")
        summary_table.add_row("👥 Organization Levels:", "3 (Project Manager, Team Leads, Workers)")
        summary_table.add_row("🔁 Decision Process:", "Bottom-up information flow, top-down decisions")
        
        console.print(summary_table)
        console.print()

def main():
    """Main function to run the Hierarchical Pattern demo"""
    
    # Check for AWS credentials
    if not os.getenv("AWS_ACCESS_KEY_ID") or not os.getenv("AWS_SECRET_ACCESS_KEY"):
        console.print("[red]❌ Error: AWS credentials not found in environment variables.[/red]")
        console.print("[yellow]Please copy .env.example to .env and add your AWS credentials.[/yellow]")
        return
    
    try:
        demo = HierarchicalPatternDemo()
        demo.display_header()
        demo.display_hierarchy()
        
        console.print("[bold]Demonstrating Hierarchical Pattern with Software Project Team[/bold]\n")
        
        # Example feature request
        feature_description = """
        Feature: User Profile Photo Upload
        
        We need to implement a feature that allows users to upload and update their profile photos.
        Requirements:
        - Users should be able to upload JPG, PNG, or GIF files up to 5MB
        - The system should automatically resize photos to multiple dimensions for different display contexts
        - Users should see a preview of their photo before confirming the upload
        - The feature should handle at least 1000 concurrent uploads during peak usage
        """
        
        # Run the demo
        demo.demonstrate_hierarchical_pattern(feature_description)
        
        console.print("\n[bold green]Hierarchical Pattern Demo Complete![/bold green]")
    
    except KeyboardInterrupt:
        console.print("\n[yellow]Demo interrupted by user. Goodbye! 👋[/yellow]")
    except Exception as e:
        console.print(f"[red]❌ Error running demo: {str(e)}[/red]")
        console.print("[dim]Make sure you have installed all requirements: pip install -r requirements.txt[/dim]")

if __name__ == "__main__":
    main()
