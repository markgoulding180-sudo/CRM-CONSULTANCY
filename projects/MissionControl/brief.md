# Mission Control — Project Brief

## Overview
A real-time HTML dashboard to monitor all agents, their current status, projects, and task history.

## Requirements

### Core Features
1. **Agent Status Display** — Show what each agent is currently doing
2. **Project Assignment** — Display which project each agent is working on
3. **Task History** — Show history of tasks completed by each agent
4. **Individual Agent Sections** — Each agent has their own dedicated panel
5. **Project Progress Bar** — Visual progress indicator for active projects
6. **Agent State Visualisation** — Animated indicators showing:
   - Working (active animation)
   - Idle (static/paused)
   - Thinking (processing animation)

### Technical Constraints
- **Zero ongoing costs** — No heartbeat API calls or recurring charges
- **Real-time updates** — Must reflect current state without expensive polling
- **Self-contained** — Single HTML file with embedded CSS/JS if possible
- **Local data source** — Read from local files (session logs, project files)

### Data Sources
- Session logs and agent activity files
- Project folder structure and status
- Local agent state tracking

## Success Criteria
- At-a-glance visibility of all agent activity
- Clear visual distinction between agent states
- No API costs for operation
- Fast, responsive interface