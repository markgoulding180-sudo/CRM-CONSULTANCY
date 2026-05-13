# Mission Control — Project Plan

## What We Are Building
A real-time, zero-cost agent monitoring dashboard. Single HTML file with embedded CSS/JS that reads local data sources to display agent status, projects, and task history.

## Tech Stack
- **Frontend:** Pure HTML5/CSS3/JavaScript (no frameworks)
- **Data Source:** Local file system via fetch/XHR reading JSON state files
- **Updates:** File-system watchers or manual refresh (zero API cost)
- **Animations:** CSS animations for agent states

## Architecture

### Data Flow (Zero-Cost Design)
```
Agent Activity → Write to local JSON file → Dashboard reads JSON → UI updates
```

No heartbeats. No API calls. Just local file I/O.

### State Files (JSON)
- `~/.openclaw/workspace/.openclaw/agent-state.json` — Current agent statuses
- `~/.openclaw/workspace/.openclaw/session-log.json` — Session/task history
- `~/.openclaw/workspace/projects/*/status.json` — Per-project progress

### Agent States
| State | Visual | Animation |
|-------|--------|-----------|
| Working | 🟢 Green pulse | Breathing glow + activity spinner |
| Idle | ⚪ Grey static | Subtle pulse every 5s |
| Thinking | 🟡 Yellow/orange | Rapid shimmer + "thinking" dots |
| Error | 🔴 Red | Flashing alert |
| Offline | ⚫ Dark grey | None |

## Task Breakdown

### Phase 1: Dashboard Structure
**Agent:** qwen2.5-coder:7b
- HTML layout with agent grid
- CSS grid/flexbox for responsive panels
- Each agent gets a card with: name, status, current task, project, history

### Phase 2: Visual Design & Animations
**Agent:** qwen2.5-coder:7b
- Dark theme (mission control aesthetic)
- CSS animations for agent states
- Progress bars with gradient fills
- Terminal/console aesthetic for logs

### Phase 3: Data Integration
**Agent:** qwen2.5-coder:7b
- JavaScript to read local state files
- Parse agent data and populate UI
- Auto-refresh via file timestamp checking (not API polling)

### Phase 4: Project Progress Tracking
**Agent:** qwen2.5-coder:7b
- Parse project folders for completion status
- Calculate progress percentages
- Visual progress bars per project

### Phase 5: History & Logging
**Agent:** qwen2.5-coder:7b
- Task history display per agent
- Scrollable log view
- Filter/search capabilities

### Phase 6: Integration & Testing
**Agent:** HAL 9000 (me)
- Wire up data flow
- Test with real agent data
- Optimise refresh strategy

## File Structure
```
MissionControl/
├── frontend/
│   ├── index.html      ← Main dashboard (single file)
│   ├── style.css       ← All styles + animations
│   └── app.js          ← Data reading + UI logic
├── backend/
│   └── state-writer.py ← Writes agent state to JSON
└── docs/
    └── data-format.md  ← State file specifications
```

## Cost Analysis
| Approach | Cost |
|----------|------|
| Heartbeat polling | ❌ API calls every N seconds |
| File watcher | ✅ Zero cost — local filesystem only |
| Manual refresh button | ✅ Zero cost — user triggered |

**Selected:** File watcher with 5-second local file check (no network)

## Agent Assignments
| Task | Agent |
|------|-------|
| HTML structure | qwen2.5-coder:7b |
| CSS + animations | qwen2.5-coder:7b |
| JavaScript data layer | qwen2.5-coder:7b |
| State file integration | qwen2.5-coder:7b |
| Testing & polish | qwen2.5-coder:7b |

## Success Metrics
- [ ] Dashboard displays all agents
- [ ] Real-time status updates (≤5s latency)
- [ ] Smooth animations at 60fps
- [ ] Zero API calls during operation
- [ ] Works offline entirely