"""
Aggregator Pattern Demo - Weather Forecast System
Demonstrates collecting and synthesizing information from multiple specialized data sources
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
from rich.columns import Columns

# Import LangChain components
from langchain_aws import ChatBedrock
from langchain.prompts import ChatPromptTemplate

# Load environment variables
load_dotenv()

console = Console()

class AggregatorPatternDemo:
    def __init__(self):
        self.console = console
        self.setup_agents()
    
    def setup_agents(self):
        """Setup specialized data source agents and the aggregator"""
        
        # HARDCODED: Use supported model ID that doesn't require inference profiles
        claude_model = "anthropic.claude-3-5-sonnet-20240620-v1:0"  # Hardcoded to bypass .env issues
        region_name = os.getenv("AWS_DEFAULT_REGION", "us-east-1")
        
        print(f"Using model: {claude_model}")
        
        # Create LangChain model
        self.llm = ChatBedrock(model_id=claude_model, region_name=region_name)
        
        # Satellite Data Agent
        self.satellite_agent = self.create_agent(
            name="Satellite Data Agent",
            role="Satellite imagery and data analyst",
            instructions="""
            You analyze satellite imagery and atmospheric data from space-based instruments.
            Focus on cloud patterns, atmospheric pressure systems, and global weather patterns.
            Provide satellite-based weather observations and predictions.
            Include information about cloud cover, storm systems visible from space, and atmospheric conditions.
            Format your response in concise, technical language appropriate for meteorologists.
            """
        )
        
        # Ground Station Agent
        self.ground_agent = self.create_agent(
            name="Ground Station Agent", 
            role="Ground-based weather station analyst",
            instructions="""
            You analyze data from ground-based weather stations and sensors.
            Focus on temperature, humidity, precipitation, and local wind conditions.
            Provide ground-level weather observations and measurements.
            Include specific numeric measurements when possible (temperature ranges, precipitation amounts).
            Format your response in concise, technical language appropriate for meteorologists.
            """
        )
        
        # Historical Data Agent
        self.historical_agent = self.create_agent(
            name="Historical Data Agent", 
            role="Weather pattern historian",
            instructions="""
            You analyze historical weather patterns and seasonal trends.
            Compare current conditions with historical records.
            Provide insights on seasonal norms, historical extremes, and pattern recognition.
            Include information about how current forecasts compare to typical weather for this location and time.
            Format your response in concise, technical language appropriate for meteorologists.
            """
        )
        
        # Weather Model Agent
        self.model_agent = self.create_agent(
            name="Weather Model Agent", 
            role="Computational weather model analyst",
            instructions="""
            You analyze outputs from computational weather prediction models.
            Focus on forecast models like GFS, ECMWF, and ensemble predictions.
            Provide model-based weather predictions and confidence levels.
            Include information about model agreement/disagreement and prediction reliability.
            Format your response in concise, technical language appropriate for meteorologists.
            """
        )
        
        # Forecast Aggregator Agent
        self.aggregator_agent = self.create_agent(
            name="Forecast Aggregator Agent",
            role="Weather forecast synthesizer",
            instructions="""
            You synthesize weather data from multiple sources into a comprehensive forecast.
            Integrate satellite, ground, historical, and model data to create a unified prediction.
            Resolve any conflicts between data sources and explain reasoning.
            Provide a structured forecast including:
            1. Overall weather outlook (1-2 sentences)
            2. Temperature and precipitation forecasts
            3. Wind conditions and atmospheric pressure
            4. Notable patterns or concerns
            5. Forecast confidence level (low, medium, or high)
            
            Format your response as a professional weather forecast that is both accurate and accessible to the general public.
            Include a headline summary followed by details organized in clear sections.
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
    
    def get_satellite_data(self, location: str, date: str) -> str:
        """Get weather data from satellite sources"""
        prompt = f"""
        Provide satellite weather data analysis for {location} on {date}.
        Include observations about:
        - Cloud patterns and coverage
        - Atmospheric pressure systems
        - Storm systems visible from space
        - Upper atmosphere conditions
        """
        response = self.satellite_agent["chain"].invoke({"input": prompt})
        return response.content
    
    def get_ground_data(self, location: str, date: str) -> str:
        """Get weather data from ground stations"""
        prompt = f"""
        Provide ground station weather data analysis for {location} on {date}.
        Include observations about:
        - Temperature ranges and averages
        - Humidity levels
        - Precipitation measurements
        - Wind speed and direction
        - Barometric pressure readings
        """
        response = self.ground_agent["chain"].invoke({"input": prompt})
        return response.content
    
    def get_historical_data(self, location: str, date: str) -> str:
        """Get historical weather pattern data"""
        prompt = f"""
        Provide historical weather pattern analysis for {location} around {date}.
        Include:
        - Typical weather patterns for this time of year
        - Comparison to historical averages
        - Notable historical weather events around this date
        - Seasonal trends relevant to forecasting
        """
        response = self.historical_agent["chain"].invoke({"input": prompt})
        return response.content
    
    def get_model_data(self, location: str, date: str) -> str:
        """Get computational weather model predictions"""
        prompt = f"""
        Provide weather model prediction analysis for {location} on {date}.
        Include:
        - Forecasts from major prediction models
        - Model agreement/disagreement
        - Confidence levels in predictions
        - Potential alternative scenarios
        """
        response = self.model_agent["chain"].invoke({"input": prompt})
        return response.content
    
    def aggregate_forecast(self, location: str, date: str, data_sources: Dict[str, str]) -> str:
        """Aggregate data from all sources into a unified forecast"""
        
        # Format all source data into the prompt
        sources_text = "\n\n".join([f"## {name} Report:\n{data}" for name, data in data_sources.items()])
        
        prompt = f"""
        Synthesize the following weather data sources into a comprehensive forecast for {location} on {date}.
        
        {sources_text}
        
        Create a unified weather forecast that integrates all this information.
        """
        
        response = self.aggregator_agent["chain"].invoke({"input": prompt})
        return response.content
    
    def display_header(self):
        """Display demo header"""
        header = Panel.fit(
            "[bold blue]🌦️ Aggregator Pattern Demo - Weather Forecast System[/bold blue]\n"
            "[dim]Collecting and synthesizing information from multiple specialized sources[/dim]",
            border_style="blue"
        )
        console.print(header)
        console.print()
    
    def display_agents(self):
        """Display participating agents"""
        table = Table(title="Weather Forecast System Agents", show_header=True, header_style="bold magenta")
        table.add_column("Agent", style="cyan", no_wrap=True)
        table.add_column("Role", style="green")
        table.add_column("Data Provided", style="yellow")
        
        agents_info = [
            ("Satellite Data Agent", "Space-based Observer", "Cloud patterns, atmospheric systems"),
            ("Ground Station Agent", "Surface Observer", "Temperature, humidity, precipitation"),
            ("Historical Data Agent", "Pattern Historian", "Historical trends, seasonal norms"),
            ("Weather Model Agent", "Computational Analyst", "Model predictions, forecast confidence"),
            ("Forecast Aggregator", "Data Synthesizer", "Integrated comprehensive forecast")
        ]
        
        for agent, role, data in agents_info:
            table.add_row(agent, role, data)
        
        console.print(table)
        console.print()
    
    def demonstrate_aggregator_pattern(self, location: str, date: str):
        """Demonstrate the aggregator pattern with a weather forecast"""
        
        console.print(f"[bold green]Weather Forecast Request:[/bold green] {location}, {date}")
        console.print()
        
        # Storage for all data sources
        data_sources = {}
        start_time = time.time()
        
        # Collect data from all sources (can be parallelized in real systems)
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            console=console,
        ) as progress:
            # Get satellite data
            task1 = progress.add_task("🛰️ Collecting satellite imagery and data...", total=None)
            satellite_data = self.get_satellite_data(location, date)
            data_sources["Satellite Data"] = satellite_data
            progress.update(task1, completed=True)
            
            # Get ground station data
            task2 = progress.add_task("🌡️ Collecting ground station measurements...", total=None)
            ground_data = self.get_ground_data(location, date)
            data_sources["Ground Station Data"] = ground_data
            progress.update(task2, completed=True)
            
            # Get historical data
            task3 = progress.add_task("📚 Analyzing historical weather patterns...", total=None)
            historical_data = self.get_historical_data(location, date)
            data_sources["Historical Data"] = historical_data
            progress.update(task3, completed=True)
            
            # Get model predictions
            task4 = progress.add_task("💻 Running computational weather models...", total=None)
            model_data = self.get_model_data(location, date)
            data_sources["Weather Model Predictions"] = model_data
            progress.update(task4, completed=True)
        
        # Display each data source
        console.print("\n[bold cyan]Individual Data Source Reports:[/bold cyan]")
        
        panels = []
        for source_name, source_data in data_sources.items():
            # Truncate for display if too long
            display_data = source_data[:250] + "..." if len(source_data) > 250 else source_data
            
            panel = Panel(
                display_data,
                title=f"[bold]{source_name}[/bold]",
                border_style="dim",
                width=60,
                height=10
            )
            panels.append(panel)
        
        # Show panels in columns layout
        console.print(Columns(panels))
        console.print()
        
        # Aggregate all data into a unified forecast
        console.print("[bold yellow]Aggregating Weather Data Sources...[/bold yellow]")
        
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            console=console,
        ) as progress:
            task = progress.add_task("🔄 Synthesizing comprehensive forecast...", total=None)
            
            aggregated_forecast = self.aggregate_forecast(location, date, data_sources)
            
            progress.update(task, completed=True)
        
        console.print()
        
        # Display the final aggregated forecast
        forecast_panel = Panel(
            aggregated_forecast,
            title=f"[bold green]Comprehensive Weather Forecast for {location}, {date}[/bold green]",
            border_style="green",
            padding=(1, 2)
        )
        console.print(forecast_panel)
        
        end_time = time.time()
        processing_time = end_time - start_time
        
        # Show performance summary
        console.print()
        summary_table = Table(show_header=False, box=None, padding=(0, 2))
        summary_table.add_column("Metric", style="dim")
        summary_table.add_column("Value", style="bold")
        
        summary_table.add_row("⏱️  Total Processing Time:", f"{processing_time:.2f} seconds")
        summary_table.add_row("🔄 Pattern Used:", "Aggregator (Multi-source Integration)")
        summary_table.add_row("📊 Data Sources:", f"{len(data_sources)}")
        
        console.print(summary_table)
        console.print()

def main():
    """Main function to run the Aggregator Pattern demo"""
    
    # Check for AWS credentials
    if not os.getenv("AWS_ACCESS_KEY_ID") or not os.getenv("AWS_SECRET_ACCESS_KEY"):
        console.print("[red]❌ Error: AWS credentials not found in environment variables.[/red]")
        console.print("[yellow]Please copy .env.example to .env and add your AWS credentials.[/yellow]")
        return
    
    try:
        demo = AggregatorPatternDemo()
        demo.display_header()
        demo.display_agents()
        
        console.print("[bold]Demonstrating Aggregator Pattern with Weather Forecasting[/bold]\n")
        
        # Example forecast request
        demo.demonstrate_aggregator_pattern("New York City", "July 15, 2025")
        
        console.print("\n[bold green]Aggregator Pattern Demo Complete![/bold green]")
    
    except KeyboardInterrupt:
        console.print("\n[yellow]Demo interrupted by user. Goodbye! 👋[/yellow]")
    except Exception as e:
        console.print(f"[red]❌ Error running demo: {str(e)}[/red]")
        console.print("[dim]Make sure you have installed all requirements: pip install -r requirements.txt[/dim]")

if __name__ == "__main__":
    main()
