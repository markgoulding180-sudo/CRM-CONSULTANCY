HAL 9000 — Project Workflow
Mission Control Integration (Zero Cost)
All agent activity is tracked in real-time via local state files. No API calls.
To update Mission Control from any session:
```python
import sys
sys.path.insert(0, r'C:\Users\markg\.openclaw\workspace\projects\MissionControl\backend')
from state_writer import agent_working, agent_idle, update_progress, update_project

# When agent starts work
agent_working('qwen2.5-coder', 'Writing HTML structure', 'ProjectName')

# Update progress (0-100)
update_progress('qwen2.5-coder', 65)

# When agent completes
agent_idle('qwen2.5-coder')

# Update project status
update_project('ProjectName', 65, agents=2, tasks=4)
```
Dashboard: `projects/MissionControl/frontend/index.html`
New Project Command
When markg types "New Project", follow these steps exactly:
Step 1 — Get project name
Ask: "What shall we call this project, markg?"
Step 2 — Create folder structure
Create the following folders and placeholder files in C:\Users\markg.openclaw\workspace\projects\PROJECT-NAME\
Folders and placeholders to create:
brief.md (placeholder: "# Project Brief\n[Brief to be added]")
plan.md (placeholder: "# Project Plan\n[Plan to be added]")
README.md (placeholder: "# PROJECT-NAME\n[Description to be added]")
src/.gitkeep
frontend/index.html (placeholder: "<!-- Frontend files -->")
frontend/style.css (placeholder: "/* Styles */")
frontend/app.js (placeholder: "// App logic")
backend/main.py (placeholder: "# Backend entry point")
assets/.gitkeep
docs/notes.md (placeholder: "# Project Notes")
tests/.gitkeep
Step 3 — Confirm creation
Tell markg exactly which folders and files were created.
Step 4 — Get project brief
Ask: "Please describe what we are building, markg. Be as detailed as you like."
Step 5 — Save brief
Save markg's response to brief.md in the project folder.
Step 6 — Create plan
Analyse the brief and create a detailed plan in plan.md covering:
What we are building
Tech stack recommended
Task breakdown
Which local agent handles each task:
qwen2.5-coder:7b for coding
qwen3:14b for architecture decisions
phi3 for quick tasks
gemma for documentation and writing
gemma4:e4b for complex heavy tasks
Step 7 — Confirm plan
Present the plan to markg and ask:
"Does this plan look correct? Any changes or additions before we begin?"
Step 8 — Execute
Once markg confirms, delegate tasks to the appropriate local agents.
Monitor each agent, check for errors, and report progress back to markg.
If an agent encounters an error, report it immediately and propose a fix.
Step 9 — GitHub Setup (runs once per project, immediately after Step 2)
After the project folder and files are created, initialise a Git repository and push to GitHub:
```bash
cd C:\Users\markg\.openclaw\workspace\projects\PROJECT-NAME
git init
git add .
git commit -m "Initial project setup — HAL 9000"
gh repo create PROJECT-NAME --public --push --source=.
```
Confirm to markg:
"✅ GitHub repo live at: https://github.com/markgoulding180-sudo/PROJECT-NAME"
Update Mission Control:
```python
update_project('PROJECT-NAME', 0, agents=0, tasks=0)
```
Log in docs/notes.md:
```
## GitHub
Repo: https://github.com/markgoulding180-sudo/PROJECT-NAME
Created: [date]
```
Step 10 — Auto Commit After Every Completed Task
After every task is completed by any agent, run the following in the project folder:
```bash
cd C:\Users\markg\.openclaw\workspace\projects\PROJECT-NAME
git add .
git commit -m "Task complete: [clear description of what was built or changed]"
git push
```
Then:
Update Mission Control progress
Log the commit in docs/notes.md with timestamp and description
Report to markg: "✅ Pushed to GitHub: [commit description]"
Step 11 — Netlify Auto-Deploy Note
Netlify connects to GitHub once manually by markg.
After that, every git push in Step 10 automatically publishes the live site.
No further action needed from HAL for deployment.
If markg has not yet connected Netlify, remind him:
"⚠️ Remember to connect this repo to Netlify for auto-publishing.
Go to netlify.com → Add new site → Import from Git → select PROJECT-NAME"