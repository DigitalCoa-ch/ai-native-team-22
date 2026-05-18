"""
Configuration for ExpenseContext AI
"""

# API Configuration
API_HOST = "0.0.0.0"
API_PORT = 5000
DEBUG = True

# Multi-Agent Configuration
PARALLEL_EXECUTION = True  # Run context agents in parallel
MAX_WORKERS = 4  # Max parallel agent workers

# Demo Configuration
DEMO_MODE = True  # Enable demo features (realistic delays, mock data)
DEMO_DELAY_MS = 300  # Artificial delay to simulate processing