# Mission Control - Project Logger
# Creates detailed, project-specific logs for debugging and history
# Includes log rotation to prevent massive files

import json
import os
import gzip
from datetime import datetime
from pathlib import Path

class ProjectLogger:
    MAX_LOG_SIZE = 1024 * 1024  # 1MB max per log file
    MAX_DASHBOARD_LINES = 100   # Keep only last 100 lines in dashboard view
    
    def __init__(self, project_name):
        self.project_name = project_name
        self.project_dir = Path(f"C:/Users/markg/.openclaw/workspace/projects/{project_name}")
        self.logs_dir = self.project_dir / "logs"
        self.log_file = self.logs_dir / f"{datetime.now().strftime('%Y-%m-%d')}.log"
        self.session_file = self.logs_dir / "session.json"
        
        # Dashboard folder (for browser access)
        self.dashboard_dir = Path("C:/Users/markg/.openclaw/workspace/projects/MissionControl/frontend")
        self.dashboard_log = self.dashboard_dir / f"{project_name}-logs.txt"
        
        # Ensure logs directory exists
        self.logs_dir.mkdir(parents=True, exist_ok=True)
        
        # Load or create session history
        self.session = self._load_session()
        
        # Rotate logs if too big
        self._rotate_if_needed()
    
    def _load_session(self):
        """Load existing session data"""
        if self.session_file.exists():
            with open(self.session_file, 'r') as f:
                return json.load(f)
        return {
            "project": self.project_name,
            "created": datetime.now().isoformat(),
            "sessions": []
        }
    
    def _rotate_if_needed(self):
        """Rotate log files if they get too big"""
        if self.log_file.exists() and self.log_file.stat().st_size > self.MAX_LOG_SIZE:
            # Create timestamped backup
            timestamp = datetime.now().strftime('%H%M%S')
            backup_file = self.logs_dir / f"{datetime.now().strftime('%Y-%m-%d')}_{timestamp}.log"
            self.log_file.rename(backup_file)
            
            # Compress old backup
            with open(backup_file, 'rb') as f_in:
                with gzip.open(f"{backup_file}.gz", 'wb') as f_out:
                    f_out.write(f_in.read())
            backup_file.unlink()  # Remove uncompressed file
    
    def _trim_dashboard_log(self):
        """Keep dashboard log at manageable size"""
        if self.dashboard_log.exists():
            lines = self.dashboard_log.read_text().split('\n')
            if len(lines) > self.MAX_DASHBOARD_LINES:
                # Keep only last 100 lines
                trimmed = '\n'.join(lines[-self.MAX_DASHBOARD_LINES:])
                self.dashboard_log.write_text(trimmed)
    
    def _save_session(self):
        """Save session data"""
        with open(self.session_file, 'w') as f:
            json.dump(self.session, f, indent=2)
    
    def log_action(self, agent, action, details=None, status="info"):
        """Log a detailed action with timestamp"""
        timestamp = datetime.now()
        entry = {
            "time": timestamp.strftime("%H:%M:%S"),
            "timestamp": timestamp.isoformat(),
            "agent": agent,
            "action": action,
            "details": details or {},
            "status": status
        }
        
        # Write to daily log file
        log_line = f"[{entry['time']}] [{status.upper()}] {agent}: {action}"
        if details:
            log_line += f" | {json.dumps(details)}"
        log_line += "\n"
        
        with open(self.log_file, 'a') as f:
            f.write(log_line)
        
        # Also copy to dashboard for real-time viewing
        try:
            with open(self.dashboard_log, 'a') as f:
                f.write(log_line)
            # Trim dashboard log if it gets too big
            self._trim_dashboard_log()
        except Exception:
            pass  # Dashboard copy is optional
        
        # Add to session history
        self.session["sessions"].append(entry)
        self._save_session()
        
        return entry
    
    def log_task_start(self, agent, task_name, description=""):
        """Log when a task starts"""
        return self.log_action(agent, f"STARTED: {task_name}", {
            "description": description,
            "type": "task_start"
        }, "info")
    
    def log_task_progress(self, agent, task_name, progress_percent, note=""):
        """Log task progress update"""
        return self.log_action(agent, f"PROGRESS: {task_name} ({progress_percent}%)", {
            "progress": progress_percent,
            "note": note,
            "type": "task_progress"
        }, "info")
    
    def log_task_complete(self, agent, task_name, result_summary=""):
        """Log when a task completes"""
        return self.log_action(agent, f"COMPLETED: {task_name}", {
            "result": result_summary,
            "type": "task_complete"
        }, "success")
    
    def log_error(self, agent, error_message, context=None):
        """Log an error with full context"""
        return self.log_action(agent, f"ERROR: {error_message}", {
            "context": context or {},
            "type": "error"
        }, "error")
    
    def log_decision(self, agent, decision, reasoning=""):
        """Log a decision made by an agent"""
        return self.log_action(agent, f"DECISION: {decision}", {
            "reasoning": reasoning,
            "type": "decision"
        }, "info")
    
    def get_session_history(self):
        """Get full session history"""
        return self.session["sessions"]
    
    def get_log_file_path(self):
        """Get path to today's log file"""
        return str(self.log_file)

# Convenience function
def get_logger(project_name):
    return ProjectLogger(project_name)