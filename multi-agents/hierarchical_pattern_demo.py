"""
Hierarchical Pattern Demo - Corporate Decision Making
Demonstrates agents organized in a management hierarchy with different levels of authority
"""

import os
import time
import random
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
        """Setup agents in a management hierarchy"""
        
        # HARDCODED: Use supported model ID that doesn't require inference profiles
        claude_model = "anthropic.claude-3-5-sonnet-20240620-v1:0"  # Hardcoded to bypass .env issues
        region_name = os.getenv("AWS_DEFAULT_REGION", "us-east-1")
        
        print(f"Using model: {claude_model}")
        
        # Create LangChain model
        self.llm = ChatBedrock(model_id=claude_model, region_name=region_name)
        
        # CEO - Top level decision maker
        self.ceo_agent = self.create_agent(
            name="CEO",
            role="Chief Executive Officer",
            instructions="""
            You are the CEO of a technology company, responsible for final approval on major strategic decisions.
            Your expertise includes business strategy, long-term planning, and executive decision-making.
            You consider inputs from your department heads but make the ultimate decision based on:
            - Alignment with company vision and strategy
            - Financial implications and ROI
            - Market positioning and competitive advantage
            - Risk assessment
            
            Provide concise, decisive responses that demonstrate executive-level thinking.
            Include reasoning for your decisions to help your team understand the strategic rationale.
            """
        )
        
        # Department Heads - Mid-level managers
        self.tech_vp_agent = self.create_agent(
            name="CTO", 
            role="Chief Technology Officer",
            instructions="""
            You are the CTO, responsible for technology decisions and managing the technical department.
            Your expertise includes technical feasibility, implementation challenges, and technology strategy.
            
            When evaluating proposals:
            - Assess technical feasibility and implementation requirements
            - Consider integration with existing technology stack
            - Evaluate technical risks and dependencies
            - Provide technical recommendations with clear rationale
            
            For decisions beyond your authority, present a structured recommendation to the CEO.
            Include key technical considerations, potential risks, and your recommended approach.
            """
        )
        
        self.marketing_vp_agent = self.create_agent(
            name="CMO", 
            role="Chief Marketing Officer",
            instructions="""
            You are the CMO, responsible for marketing strategy and customer acquisition.
            Your expertise includes market positioning, customer experience, and brand management.
            
            When evaluating proposals:
            - Assess market potential and customer appeal
            - Consider brand alignment and marketing opportunities
            - Evaluate competitive positioning and differentiation
            - Provide marketing recommendations with clear rationale
            
            For decisions beyond your authority, present a structured recommendation to the CEO.
            Include key marketing considerations, potential opportunities, and your recommended approach.
            """
        )
        
        self.finance_vp_agent = self.create_agent(
            name="CFO", 
            role="Chief Financial Officer",
            instructions="""
            You are the CFO, responsible for financial strategy and resource allocation.
            Your expertise includes financial analysis, budget management, and investment evaluation.
            
            When evaluating proposals:
            - Assess financial implications and budget requirements
            - Consider ROI, payback period, and financial risks
            - Evaluate resource allocation and opportunity costs
            - Provide financial recommendations with clear rationale
            
            For decisions beyond your authority, present a structured recommendation to the CEO.
            Include key financial considerations, cost-benefit analysis, and your recommended approach.
            """
        )
        
        # Team Leads - Lower level implementers
        self.dev_lead_agent = self.create_agent(
            name="Development Lead",
            role="Technical implementation lead",
            instructions="""
            You are the Development Lead, responsible for technical implementation and software development.
            Your expertise includes software architecture, development processes, and technical requirements.
            
            When assigned tasks:
            - Break down technical requirements into implementable components
            - Identify potential technical challenges and solutions
            - Estimate development time and resource requirements
            - Provide detailed implementation plans
            
            Report to the CTO with specific technical details and implementation considerations.
            Focus on practical execution rather than strategic decisions.
            """
        )
        
        self.design_lead_agent = self.create_agent(
            name="Design Lead",
            role="User experience and design lead",
            instructions="""
            You are the Design Lead, responsible for user experience and visual design.
            Your expertise includes UX principles, user research, and interface design.
            
            When assigned tasks:
            - Consider user needs and experience flows
            - Develop design approaches aligned with brand guidelines
            - Identify potential usability issues and solutions
            - Provide design recommendations with user-centered rationale
            
            Report to the CMO with specific design details and user experience considerations.
            Focus on practical execution rather than strategic decisions.
            """
        )
        
        self.analytics_lead_agent = self.create_agent(
            name="Analytics Lead",
            role="Data analysis and reporting lead",
            instructions="""
            You are the Analytics Lead, responsible for data analysis and performance reporting.
            Your expertise includes data modeling, metrics definition, and analytical frameworks.
            
            When assigned tasks:
            - Define relevant metrics and success criteria
            - Develop measurement approaches and reporting frameworks
            - Identify data requirements and potential limitations
            - Provide analytical recommendations with data-driven rationale
            
            Report to the CFO with specific analytical details and measurement considerations.
            Focus on practical execution rather than strategic decisions.
            """
        )
        
        # Create hierarchy structure
        self.hierarchy = {
            "CEO": {
                "agent": self.ceo_agent,
                "reports": ["CTO", "CMO", "CFO"]
            },
            "CTO": {
                "agent": self.tech_vp_agent,
                "reports": ["Development Lead"],
                "reports_to": "CEO"
            },
            "CMO": {
                "agent": self.marketing_vp_agent,
                "reports": ["Design Lead"],
                "reports_to": "CEO"
            },
            "CFO": {
                "agent": self.finance_vp_agent,
                "reports": ["Analytics Lead"],
                "reports_to": "CEO"
            },
            "Development Lead": {
                "agent": self.dev_lead_agent,
                "reports": [],
                "reports_to": "CTO"
            },
            "Design Lead": {
                "agent": self.design_lead_agent,
                "reports": [],
                "reports_to": "CMO"
            },
            "Analytics Lead": {
                "agent": self.analytics_lead_agent,
                "reports": [],
                "reports_to": "CFO"
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
    
    def get_input_from_team_leads(self, project_description: str) -> Dict[str, str]:
        """Team Leads provide initial input on a project"""
        console.print("[bold yellow]Phase 1: Team Leads Initial Assessment[/bold yellow]")
        
        lead_inputs = {}
        
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            console=console,
        ) as progress:
            # Get input from Development Lead
            task1 = progress.add_task("👨‍💻 Development Lead analyzing technical requirements...", total=None)
            
            dev_prompt = f"""
            As the Development Lead, you've been asked to provide an initial technical assessment of this project:
            
            {project_description}
            
            Please provide:
            1. Technical feasibility assessment
            2. Key technical requirements and challenges
            3. Estimated development time and resources
            4. Recommendations from a technical implementation perspective
            
            Keep your assessment under 200 words, focused on practical implementation details.
            """
            
            dev_response = self.dev_lead_agent["chain"].invoke({"input": dev_prompt})
            lead_inputs["Development Lead"] = dev_response.content
            progress.update(task1, completed=True)
            
            # Get input from Design Lead
            task2 = progress.add_task("🎨 Design Lead analyzing user experience requirements...", total=None)
            
            design_prompt = f"""
            As the Design Lead, you've been asked to provide an initial user experience assessment of this project:
            
            {project_description}
            
            Please provide:
            1. User experience assessment
            2. Key design considerations and challenges
            3. Alignment with brand and user expectations
            4. Recommendations from a design and UX perspective
            
            Keep your assessment under 200 words, focused on user experience and design elements.
            """
            
            design_response = self.design_lead_agent["chain"].invoke({"input": design_prompt})
            lead_inputs["Design Lead"] = design_response.content
            progress.update(task2, completed=True)
            
            # Get input from Analytics Lead
            task3 = progress.add_task("📊 Analytics Lead developing measurement framework...", total=None)
            
            analytics_prompt = f"""
            As the Analytics Lead, you've been asked to provide an initial measurement framework for this project:
            
            {project_description}
            
            Please provide:
            1. Key metrics and success criteria
            2. Data collection requirements
            3. ROI measurement approach
            4. Recommendations from a data and analytics perspective
            
            Keep your assessment under 200 words, focused on measurement and data analysis.
            """
            
            analytics_response = self.analytics_lead_agent["chain"].invoke({"input": analytics_prompt})
            lead_inputs["Analytics Lead"] = analytics_response.content
            progress.update(task3, completed=True)
        
        # Display team lead assessments
        console.print()
        for lead, assessment in lead_inputs.items():
            console.print(Panel(assessment[:250] + "..." if len(assessment) > 250 else assessment, 
                               title=f"[bold]{lead} Assessment[/bold]", 
                               border_style="dim",
                               padding=(1, 2)))
            console.print()
        
        return lead_inputs
    
    def get_department_recommendations(self, project_description: str, lead_inputs: Dict[str, str]) -> Dict[str, str]:
        """Department heads review team lead inputs and make recommendations"""
        console.print("[bold yellow]Phase 2: Department Heads Review & Recommendations[/bold yellow]")
        
        dept_recommendations = {}
        
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            console=console,
        ) as progress:
            # CTO reviews Development Lead input
            task1 = progress.add_task("👨‍💼 CTO reviewing technical assessment...", total=None)
            
            cto_prompt = f"""
            As the CTO, you need to review your Development Lead's assessment and make a recommendation to the CEO about this project:
            
            Project Description:
            {project_description}
            
            Development Lead's Assessment:
            {lead_inputs["Development Lead"]}
            
            Please provide:
            1. Your evaluation of the technical aspects of this project
            2. Key technical considerations the CEO should know
            3. Potential risks and mitigation strategies
            4. Your recommendation from a technology perspective
            
            Keep your recommendation under 250 words, focused on strategic technical considerations.
            """
            
            cto_response = self.tech_vp_agent["chain"].invoke({"input": cto_prompt})
            dept_recommendations["CTO"] = cto_response.content
            progress.update(task1, completed=True)
            
            # CMO reviews Design Lead input
            task2 = progress.add_task("👩‍💼 CMO reviewing UX and design assessment...", total=None)
            
            cmo_prompt = f"""
            As the CMO, you need to review your Design Lead's assessment and make a recommendation to the CEO about this project:
            
            Project Description:
            {project_description}
            
            Design Lead's Assessment:
            {lead_inputs["Design Lead"]}
            
            Please provide:
            1. Your evaluation of the marketing and user experience aspects
            2. Key market and brand considerations the CEO should know
            3. Potential opportunities and competitive advantages
            4. Your recommendation from a marketing perspective
            
            Keep your recommendation under 250 words, focused on strategic marketing considerations.
            """
            
            cmo_response = self.marketing_vp_agent["chain"].invoke({"input": cmo_prompt})
            dept_recommendations["CMO"] = cmo_response.content
            progress.update(task2, completed=True)
            
            # CFO reviews Analytics Lead input
            task3 = progress.add_task("👨‍💼 CFO reviewing financial and analytics assessment...", total=None)
            
            cfo_prompt = f"""
            As the CFO, you need to review your Analytics Lead's assessment and make a recommendation to the CEO about this project:
            
            Project Description:
            {project_description}
            
            Analytics Lead's Assessment:
            {lead_inputs["Analytics Lead"]}
            
            Please provide:
            1. Your evaluation of the financial aspects of this project
            2. Key financial considerations the CEO should know
            3. Budget implications and resource requirements
            4. Your recommendation from a financial perspective
            
            Keep your recommendation under 250 words, focused on strategic financial considerations.
            """
            
            cfo_response = self.finance_vp_agent["chain"].invoke({"input": cfo_prompt})
            dept_recommendations["CFO"] = cfo_response.content
            progress.update(task3, completed=True)
        
        # Display department head recommendations
        console.print()
        for dept, recommendation in dept_recommendations.items():
            console.print(Panel(recommendation[:300] + "..." if len(recommendation) > 300 else recommendation, 
                               title=f"[bold]{dept} Recommendation[/bold]", 
                               border_style="blue",
                               padding=(1, 2)))
            console.print()
        
        return dept_recommendations
    
    def get_ceo_decision(self, project_description: str, dept_recommendations: Dict[str, str]) -> str:
        """CEO reviews department head recommendations and makes final decision"""
        console.print("[bold yellow]Phase 3: CEO Final Decision[/bold yellow]")
        
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            console=console,
        ) as progress:
            task = progress.add_task("🏢 CEO evaluating all recommendations and making final decision...", total=None)
            
            # Compile all recommendations
            all_recommendations = "\n\n".join([f"## {dept} Recommendation:\n{rec}" for dept, rec in dept_recommendations.items()])
            
            ceo_prompt = f"""
            As the CEO, you need to make a final decision about this project after reviewing recommendations from your leadership team:
            
            Project Description:
            {project_description}
            
            Department Recommendations:
            {all_recommendations}
            
            Please provide your final decision in this format:
            
            ## Decision
            [Approve/Reject/Request More Information]
            
            ## Rationale
            [Explanation of your decision, considering all department input]
            
            ## Implementation Directives
            [If approved, key directives for implementation]
            [If rejected, explanation of why and possible alternatives]
            [If more information needed, specific questions for departments]
            
            ## Priority Level
            [High/Medium/Low]
            
            Keep your decision under 350 words, focused on executive-level strategic considerations.
            """
            
            ceo_response = self.ceo_agent["chain"].invoke({"input": ceo_prompt})
            final_decision = ceo_response.content
            
            progress.update(task, completed=True)
        
        return final_decision
    
    def display_header(self):
        """Display demo header"""
        header = Panel.fit(
            "[bold blue]👔 Hierarchical Pattern Demo - Corporate Decision Making[/bold blue]\n"
            "[dim]Agents organized in a management hierarchy with different levels of authority[/dim]",
            border_style="blue"
        )
        console.print(header)
        console.print()
    
    def display_hierarchy(self):
        """Display the organizational hierarchy"""
        tree = Tree("🏢 [bold]Corporate Hierarchy[/bold]", guide_style="dim")
        
        # Add CEO
        ceo_node = tree.add("[bold blue]CEO[/bold blue] (Final Decision Maker)")
        
        # Add department heads
        cto_node = ceo_node.add("[bold cyan]CTO[/bold cyan] (Technical Strategy)")
        cmo_node = ceo_node.add("[bold magenta]CMO[/bold magenta] (Marketing Strategy)")
        cfo_node = ceo_node.add("[bold yellow]CFO[/bold yellow] (Financial Strategy)")
        
        # Add team leads
        cto_node.add("[green]Development Lead[/green] (Technical Implementation)")
        cmo_node.add("[green]Design Lead[/green] (UX & Design)")
        cfo_node.add("[green]Analytics Lead[/green] (Data & Metrics)")
        
        console.print(tree)
        console.print()
        
        # Display information flow
        console.print("[bold cyan]Decision-Making Information Flow:[/bold cyan]")
        console.print("[dim]1. Team Leads provide specialized assessments[/dim]")
        console.print("[dim]2. Department Heads review and make strategic recommendations[/dim]")
        console.print("[dim]3. CEO evaluates all input and makes final decision[/dim]")
        console.print("[dim]4. Decisions flow back down for implementation[/dim]")
        console.print()
    
    def demonstrate_hierarchical_pattern(self, project_description: str):
        """Demonstrate the hierarchical pattern with a business decision"""
        
        console.print(f"[bold green]Project Proposal:[/bold green] {project_description}")
        console.print()
        
        start_time = time.time()
        
        # Phase 1: Team Leads provide initial input
        lead_inputs = self.get_input_from_team_leads(project_description)
        
        # Phase 2: Department Heads review and make recommendations
        dept_recommendations = self.get_department_recommendations(project_description, lead_inputs)
        
        # Phase 3: CEO makes final decision
        final_decision = self.get_ceo_decision(project_description, dept_recommendations)
        
        # Display final decision
        console.print(Panel(
            final_decision,
            title="[bold green]CEO Final Decision[/bold green]",
            border_style="green",
            padding=(1, 2)
        ))
        
        end_time = time.time()
        processing_time = end_time - start_time
        
        # Show performance summary
        console.print()
        summary_table = Table(show_header=False, box=None, padding=(0, 2))
        summary_table.add_column("Metric", style="dim")
        summary_table.add_column("Value", style="bold")
        
        summary_table.add_row("⏱️  Total Processing Time:", f"{processing_time:.2f} seconds")
        summary_table.add_row("🔄 Pattern Used:", "Hierarchical (Management Structure)")
        summary_table.add_row("👥 Organization Levels:", "3 (Executive, Department, Team)")
        summary_table.add_row("🔁 Decision Process Steps:", "3 (Assessment, Recommendation, Decision)")
        
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
        
        console.print("[bold]Demonstrating Hierarchical Pattern with Corporate Decision Making[/bold]\n")
        
        # Example project proposal
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
        
        # Run the demo
        demo.demonstrate_hierarchical_pattern(project_description)
        
        console.print("\n[bold green]Hierarchical Pattern Demo Complete![/bold green]")
    
    except KeyboardInterrupt:
        console.print("\n[yellow]Demo interrupted by user. Goodbye! 👋[/yellow]")
    except Exception as e:
        console.print(f"[red]❌ Error running demo: {str(e)}[/red]")
        console.print("[dim]Make sure you have installed all requirements: pip install -r requirements.txt[/dim]")

if __name__ == "__main__":
    main()
