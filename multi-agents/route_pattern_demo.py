"""
Route Pattern Demo - Multilingual Support Router
Demonstrates intelligent routing to specialized agents based on query language
"""

import os
import time
from typing import Dict, Any
from dotenv import load_dotenv
from rich.console import Console
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich.table import Table

# Import LangChain components
from langchain_aws import ChatBedrock
from langchain.prompts import ChatPromptTemplate

# Load environment variables
load_dotenv()

console = Console()

class RoutePatternDemo:
    def __init__(self):
        self.console = console
        self.setup_agents()
    
    def setup_agents(self):
        """Setup language-specialized agents"""
        
        # HARDCODED: Use supported model ID that doesn't require inference profiles
        claude_model = "anthropic.claude-3-5-sonnet-20240620-v1:0"  # Hardcoded to bypass .env issues
        region_name = os.getenv("AWS_DEFAULT_REGION", "us-east-1")
        
        print(f"Using model: {claude_model}")
        
        # Create LangChain model
        self.llm = ChatBedrock(model_id=claude_model, region_name=region_name)
        
        # English Support Agent
        self.english_agent = self.create_agent(
            name="English Support Agent",
            role="English language customer support",
            instructions="""
            You are an English-speaking customer support agent. Respond to queries in English only.
            Be friendly, helpful, and concise in your responses.
            Always provide clear instructions and next steps when appropriate.
            Sign your message with 'English Support Team'.
            """
        )
        
        # Spanish Support Agent
        self.spanish_agent = self.create_agent(
            name="Spanish Support Agent", 
            role="Spanish language customer support",
            instructions="""
            Eres un agente de atención al cliente que habla español. Responde a las consultas solo en español.
            Sé amable, servicial y conciso en tus respuestas.
            Siempre proporciona instrucciones claras y próximos pasos cuando sea apropiado.
            Firma tu mensaje con 'Equipo de Soporte en Español'.
            """
        )
        
        # French Support Agent
        self.french_agent = self.create_agent(
            name="French Support Agent", 
            role="French language customer support",
            instructions="""
            Vous êtes un agent de support client francophone. Répondez aux questions uniquement en français.
            Soyez amical, serviable et concis dans vos réponses.
            Fournissez toujours des instructions claires et les prochaines étapes si nécessaire.
            Signez votre message avec 'Équipe de Support Français'.
            """
        )
    
    def create_agent(self, name: str, role: str, instructions: str) -> Any:
        """Create a LangChain agent"""
        system_message = f"# {name}\n## Role: {role}\n\n{instructions}"
        
        prompt_template = ChatPromptTemplate.from_messages([
            ("system", system_message),
            ("human", "{query}")
        ])
        
        # Create agent chain
        agent_chain = prompt_template | self.llm
        
        return {
            "name": name,
            "role": role,
            "chain": agent_chain
        }
    
    def route_query(self, query: str) -> str:
        """Route query to the appropriate language agent"""
        # Create router prompt
        router_prompt = f"""
        Analyze the following customer query and determine the language it's written in.
        Reply with ONLY ONE of these options: "English", "Spanish", "French", or "Unknown".
        Do not include any other text in your response.
        
        Query: {query}
        """
        
        # Get routing decision
        router_response = self.llm.invoke(router_prompt)
        language = router_response.content.strip()
        
        # Map language to appropriate agent
        if "Spanish" in language:
            return "Spanish", self.spanish_agent
        elif "French" in language:
            return "French", self.french_agent
        else:
            # Default to English for unknown languages or explicit English detection
            return "English", self.english_agent
    
    def display_header(self):
        """Display demo header"""
        header = Panel.fit(
            "[bold blue]🌎 Route Pattern Demo - Multilingual Support Router[/bold blue]\n"
            "[dim]Intelligent routing to language-specialized agents[/dim]",
            border_style="blue"
        )
        console.print(header)
        console.print()
    
    def display_agents(self):
        """Display available agents"""
        table = Table(title="Available Language Support Agents", show_header=True, header_style="bold magenta")
        table.add_column("Agent", style="cyan", no_wrap=True)
        table.add_column("Language", style="green")
        table.add_column("Model", style="yellow")
        
        agents_info = [
            ("English Support Agent", "English", "Claude 3.5 Sonnet"),
            ("Spanish Support Agent", "Spanish", "Claude 3.5 Sonnet"),
            ("French Support Agent", "French", "Claude 3.5 Sonnet")
        ]
        
        for agent, language, model in agents_info:
            table.add_row(agent, language, model)
        
        console.print(table)
        console.print()
    
    def demonstrate_routing(self, query: str):
        """Demonstrate the routing process with a specific query"""
        
        console.print(f"[bold green]Customer Query:[/bold green] {query}")
        console.print()
        
        # Show routing analysis
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            console=console,
        ) as progress:
            
            # Step 1: Analyzing language
            task1 = progress.add_task("🔍 Analyzing query language...", total=None)
            
            start_time = time.time()
            
            # Determine the language and get the appropriate agent
            language, selected_agent = self.route_query(query)
            
            progress.update(task1, completed=True)
            
            # Step 2: Processing with selected agent
            task2 = progress.add_task(f"🤖 Processing with {language} Support Agent...", total=None)
            
            # Get response from the selected agent
            response = selected_agent["chain"].invoke({"query": query})
            
            end_time = time.time()
            processing_time = end_time - start_time
            
            progress.update(task2, completed=True)
        
        console.print()
        
        # Display the language detection result
        console.print(f"[yellow]Query detected as:[/yellow] {language}")
        console.print(f"[yellow]Selected agent:[/yellow] {selected_agent['name']}")
        console.print()
        
        # Display the response
        response_panel = Panel(
            response.content,
            title=f"[bold green]{selected_agent['name']} Response[/bold green]",
            border_style="green",
            padding=(1, 2)
        )
        console.print(response_panel)
        
        # Show performance metrics
        console.print()
        metrics_table = Table(show_header=False, box=None, padding=(0, 2))
        metrics_table.add_column("Metric", style="dim")
        metrics_table.add_column("Value", style="bold")
        
        metrics_table.add_row("⏱️  Processing Time:", f"{processing_time:.2f} seconds")
        metrics_table.add_row("🎯 Pattern Used:", "Route (Language-based Routing)")
        metrics_table.add_row("🤖 Agent:", selected_agent["name"])
        
        console.print(metrics_table)
        console.print()

def main():
    """Main function to run the Route Pattern demo"""
    
    # Check for AWS credentials
    if not os.getenv("AWS_ACCESS_KEY_ID") or not os.getenv("AWS_SECRET_ACCESS_KEY"):
        console.print("[red]❌ Error: AWS credentials not found in environment variables.[/red]")
        console.print("[yellow]Please copy .env.example to .env and add your AWS credentials.[/yellow]")
        return
    
    try:
        demo = RoutePatternDemo()
        demo.display_header()
        demo.display_agents()
        
        console.print("[bold]Demonstrating Route Pattern with Different Languages[/bold]\n")
        
        # English example
        demo.demonstrate_routing("Hey I am Ganapathy, How can I reset my password? I can't log into my account.")
        console.print("\n" + "="*80 + "\n")
        
        # Spanish example
        demo.demonstrate_routing("¿Cómo puedo restablecer mi contraseña? No puedo iniciar sesión en mi cuenta.")
        console.print("\n" + "="*80 + "\n")
        
        # French example
        # demo.demonstrate_routing("Comment puis-je réinitialiser mon mot de passe? Je ne peux pas me connecter à mon compte.")
        
        # console.print("\n[bold green]Route Pattern Demo Complete![/bold green]")
    
    except KeyboardInterrupt:
        console.print("\n[yellow]Demo interrupted by user. Goodbye! 👋[/yellow]")
    except Exception as e:
        console.print(f"[red]❌ Error running demo: {str(e)}[/red]")
        console.print("[dim]Make sure you have installed all requirements: pip install -r requirements.txt[/dim]")

if __name__ == "__main__":
    main()
