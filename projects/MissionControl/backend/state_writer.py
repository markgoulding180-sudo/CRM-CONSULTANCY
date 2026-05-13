# Mission Control - State Writer
# Writes agent activity to JSON files for the dashboard to read
# Zero cost - local file operations only

import json
import os
import time
from datetime import datetime
from pathlib import Path

class MissionControlState:
    def __init__(self):
        self.workspace = Path("C:/Users/markg/.openclaw/workspace")
        self.state_dir = self.workspace / ".openclaw"
        self.state_file = self.state_dir / "agent-state.json"
        self.log_file = self.state_dir / "mission-control.log"
        
        # Dashboard folder (for browser access)
        self.dashboard_file = self.workspace / "projects" / "MissionControl" / "frontend" / "agent-state.json"
        
        # Ensure state directory exists
        self.state_dir.mkdir(parents=True, exist_ok=True)
        
        # Load existing state if available
        self._load_existing_state()
        
        # Agent registry (only set defaults if no existing state)
        if not hasattr(self, 'agents') or not self.agents:
            self.agents = {
            "qwen2.5-coder": {
                "name": "qwen2.5-coder",
                "model": "ollama/qwen2.5-coder:7b",
                "status": "idle",
                "task": "",
                "project": None,
                "progress": 0,
                "last_active": None,
                "tasks_completed": 0
            },
            "phi3": {
                "name": "phi3", 
                "model": "ollama/phi3",
                "status": "idle",
                "task": "",
                "project": None,
                "progress": 0,
                "last_active": None,
                "tasks_completed": 0
            },
            "gemma": {
                "name": "gemma",
                "model": "ollama/gemma",
                "status": "idle", 
                "task": "",
                "project": None,
                "progress": 0,
                "last_active": None,
                "tasks_completed": 0
            },
            "gemma4:e4b": {
                "name": "gemma4:e4b",
                "model": "ollama/gemma4:e4b",
                "status": "idle",
                "task": "",
                "project": None,
                "progress": 0,
                "last_active": None,
                "tasks_completed": 0
            },
            "llama3": {
                "name": "llama3",
                "model": "ollama/llama3",
                "status": "idle",
                "task": "",
                "project": None,
                "progress": 0,
                "last_active": None,
                "tasks_completed": 0
            },
            "HAL-9000": {
                "name": "HAL-9000",
                "model": "HAL 9000",
                "status": "idle",
                "task": "",
                "project": None,
                "progress": 0,
                "last_active": None,
                "tasks_completed": 0
            }
        }
        
        self.projects = {}
    
    def _load_existing_state(self):
        """Load existing state from file if available"""
        try:
            if self.state_file.exists():
                with open(self.state_file, 'r') as f:
                    data = json.load(f)
                    if 'agents' in data:
                        self.agents = data['agents']
                    if 'projects' in data:
                        self.projects = data['projects']
        except Exception:
            pass  # If loading fails, use defaults
    
    def set_agent_working(self, agent_id, task, project=None):
        """Mark an agent as working on a task"""
        if agent_id in self.agents:
            self.agents[agent_id]["status"] = "working"
            self.agents[agent_id]["task"] = task
            self.agents[agent_id]["project"] = project
            self.agents[agent_id]["last_active"] = datetime.now().isoformat()
            self._save_state()
            self._log(f"{agent_id} started: {task}")
    
    def set_agent_thinking(self, agent_id, task, project=None):
        """Mark an agent as thinking/processing"""
        if agent_id in self.agents:
            self.agents[agent_id]["status"] = "thinking"
            self.agents[agent_id]["task"] = task
            self.agents[agent_id]["project"] = project
            self.agents[agent_id]["last_active"] = datetime.now().isoformat()
            self._save_state()
    
    def set_agent_idle(self, agent_id):
        """Mark an agent as idle"""
        if agent_id in self.agents:
            self.agents[agent_id]["status"] = "idle"
            self.agents[agent_id]["task"] = ""
            self.agents[agent_id]["progress"] = 0
            self.agents[agent_id]["last_active"] = datetime.now().isoformat()
            self.agents[agent_id]["tasks_completed"] += 1
            self._save_state()
            self._log(f"{agent_id} completed task")
    
    def set_agent_error(self, agent_id, error_msg):
        """Mark an agent as having an error"""
        if agent_id in self.agents:
            self.agents[agent_id]["status"] = "error"
            self.agents[agent_id]["task"] = f"Error: {error_msg}"
            self.agents[agent_id]["last_active"] = datetime.now().isoformat()
            self._save_state()
            self._log(f"{agent_id} error: {error_msg}", level="ERROR")
    
    def update_progress(self, agent_id, progress, task_note=None):
        """Update an agent's progress (0-100)"""
        if agent_id in self.agents:
            self.agents[agent_id]["progress"] = max(0, min(100, progress))
            self.agents[agent_id]["last_active"] = datetime.now().isoformat()
            if task_note:
                self.agents[agent_id]["task"] = task_note
            self._save_state()
            if task_note:
                self._log(f"{agent_id} {task_note}")
    
    def update_project(self, project_name, progress, agents=0, tasks=0, status="active"):
        """Update project status"""
        self.projects[project_name] = {
            "name": project_name,
            "progress": progress,
            "agents": agents,
            "tasks": tasks,
            "status": status,
            "updated": datetime.now().isoformat()
        }
        self._save_state()
    
    def _save_state(self):
        """Save current state to JSON file"""
        state = {
            "timestamp": time.time(),
            "updated": datetime.now().isoformat(),
            "agents": self.agents,
            "projects": self.projects
        }
        
        # Write to temp file first, then rename for atomic update
        temp_file = self.state_file.with_suffix('.tmp')
        with open(temp_file, 'w') as f:
            json.dump(state, f, indent=2)
        temp_file.replace(self.state_file)
        
        # Also copy to dashboard folder for browser access
        try:
            with open(self.dashboard_file, 'w') as f:
                json.dump(state, f, indent=2)
        except Exception:
            pass  # Dashboard file is optional
    
    def _log(self, message, level="INFO"):
        """Write to mission control log"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        log_entry = f"[{timestamp}] {level}: {message}\n"
        
        with open(self.log_file, 'a') as f:
            f.write(log_entry)
    
    def get_state(self):
        """Get current state as dict"""
        return {
            "timestamp": time.time(),
            "agents": self.agents,
            "projects": self.projects
        }

# Singleton instance
_state = None

def get_state():
    global _state
    if _state is None:
        _state = MissionControlState()
    return _state

# Convenience functions
def agent_working(agent_id, task, project=None):
    get_state().set_agent_working(agent_id, task, project)

def agent_thinking(agent_id, task, project=None):
    get_state().set_agent_thinking(agent_id, task, project)

def agent_idle(agent_id):
    get_state().set_agent_idle(agent_id)

def agent_error(agent_id, error_msg):
    get_state().set_agent_error(agent_id, error_msg)

def update_progress(agent_id, progress):
    get_state().update_progress(agent_id, progress)

def update_project(project_name, progress, agents=0, tasks=0, status="active"):
    get_state().update_project(project_name, progress, agents, tasks, status)

if __name__ == "__main__":
    # Test the state writer
    state = get_state()
    
    print("Mission Control State Writer")
    print(f"State file: {state.state_file}")
    print(f"Log file: {state.log_file}")
    print()
    
    # Simulate some activity
    agent_working("qwen2.5-coder", "Writing HTML structure", "Mission Control")
    update_progress("qwen2.5-coder", 65)
    update_project("Mission Control", 65, agents=2, tasks=4)
    
    print("State updated. Check the dashboard to see live data.")