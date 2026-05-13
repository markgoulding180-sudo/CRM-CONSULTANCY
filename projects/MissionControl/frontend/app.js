/**
 * Mission Control - Data Layer
 * Zero-cost operation: reads local JSON state files only
 */

class MissionControlData {
    constructor() {
        this.agents = new Map();
        this.projects = new Map();
        this.logs = [];
        this.lastUpdate = 0;
        this.updateInterval = 2000; // Check files every 2 seconds (local only, no API cost)
    }

    // Initialize and start watching for updates
    init() {
        this.loadInitialData();
        this.startWatching();
    }

    // Load data from local state files
    async loadInitialData() {
        try {
            // Try to load agent state from local file
            const agentState = await this.loadJSON('/.openclaw/agent-state.json');
            if (agentState) {
                this.updateAgents(agentState);
            }
        } catch (e) {
            console.log('Using default agent data');
            this.setDefaultAgents();
        }

        try {
            const projectState = await this.loadJSON('/.openclaw/project-state.json');
            if (projectState) {
                this.updateProjects(projectState);
            }
        } catch (e) {
            this.setDefaultProjects();
        }

        this.notifyUpdate();
    }

    // Load JSON from local file
    async loadJSON(path) {
        try {
            const response = await fetch(path, { cache: 'no-store' });
            if (response.ok) {
                return await response.json();
            }
        } catch (e) {
            // File doesn't exist yet
        }
        return null;
    }

    // Default agent data
    setDefaultAgents() {
        this.agents.set('qwen2.5-coder', {
            id: 'qwen2.5-coder',
            name: 'qwen2.5-coder',
            status: 'working',
            task: 'Writing dashboard components...',
            project: 'Mission Control',
            progress: 65,
            lastActive: Date.now()
        });

        this.agents.set('phi3', {
            id: 'phi3',
            name: 'phi3',
            status: 'idle',
            task: 'Standby',
            project: null,
            progress: 0,
            lastActive: Date.now() - 300000
        });

        this.agents.set('gemma', {
            id: 'gemma',
            name: 'gemma',
            status: 'idle',
            task: 'Waiting for task...',
            project: null,
            progress: 0,
            lastActive: Date.now() - 600000
        });

        this.agents.set('gemma4:e4b', {
            id: 'gemma4:e4b',
            name: 'gemma4:e4b',
            status: 'working',
            task: 'Processing complex analysis...',
            project: 'TestProject1',
            progress: 82,
            lastActive: Date.now()
        });

        this.agents.set('llama3', {
            id: 'llama3',
            name: 'llama3',
            status: 'idle',
            task: 'Standby mode',
            project: null,
            progress: 0,
            lastActive: Date.now() - 900000
        });
    }

    // Default project data
    setDefaultProjects() {
        this.projects.set('Mission Control', {
            name: 'Mission Control',
            progress: 65,
            agents: 2,
            tasks: 4,
            status: 'active'
        });

        this.projects.set('TestProject1', {
            name: 'TestProject1',
            progress: 82,
            agents: 1,
            tasks: 6,
            status: 'active'
        });

        this.projects.set('TestProject2', {
            name: 'TestProject2',
            progress: 30,
            agents: 1,
            tasks: 2,
            status: 'active'
        });
    }

    // Update agents from state file
    updateAgents(state) {
        if (state.agents) {
            for (const [id, data] of Object.entries(state.agents)) {
                this.agents.set(id, { ...this.agents.get(id), ...data });
            }
        }
    }

    // Update projects from state file
    updateProjects(state) {
        if (state.projects) {
            for (const [name, data] of Object.entries(state.projects)) {
                this.projects.set(name, data);
            }
        }
    }

    // Start watching for file changes
    startWatching() {
        setInterval(() => this.checkForUpdates(), this.updateInterval);
    }

    // Check if state files have been updated
    async checkForUpdates() {
        try {
            const agentState = await this.loadJSON('/.openclaw/agent-state.json');
            if (agentState && agentState.timestamp > this.lastUpdate) {
                this.updateAgents(agentState);
                this.lastUpdate = agentState.timestamp;
                this.notifyUpdate();
            }
        } catch (e) {
            // Silent fail - file may not exist
        }
    }

    // Notify UI of data update
    notifyUpdate() {
        window.dispatchEvent(new CustomEvent('missioncontrol:update', {
            detail: {
                agents: Array.from(this.agents.values()),
                projects: Array.from(this.projects.values()),
                stats: this.getStats()
            }
        }));
    }

    // Get current stats
    getStats() {
        const agentList = Array.from(this.agents.values());
        return {
            active: agentList.filter(a => a.status === 'working' || a.status === 'thinking').length,
            idle: agentList.filter(a => a.status === 'idle').length,
            total: agentList.length,
            projects: this.projects.size,
            tasksCompleted: agentList.reduce((sum, a) => sum + (a.tasksCompleted || 0), 0)
        };
    }

    // Add log entry
    addLog(agent, action, type = 'info') {
        const entry = {
            time: new Date().toISOString(),
            agent,
            action,
            type
        };
        this.logs.unshift(entry);
        
        // Keep only last 100 entries
        if (this.logs.length > 100) {
            this.logs = this.logs.slice(0, 100);
        }

        window.dispatchEvent(new CustomEvent('missioncontrol:log', { detail: entry }));
    }

    // Get agent by ID
    getAgent(id) {
        return this.agents.get(id);
    }

    // Get all agents
    getAllAgents() {
        return Array.from(this.agents.values());
    }

    // Get all projects
    getAllProjects() {
        return Array.from(this.projects.values());
    }

    // Update agent status (called by external systems)
    setAgentStatus(id, status, task, progress) {
        const agent = this.agents.get(id);
        if (agent) {
            const oldStatus = agent.status;
            agent.status = status;
            if (task) agent.task = task;
            if (progress !== undefined) agent.progress = progress;
            agent.lastActive = Date.now();

            // Log status change
            if (oldStatus !== status) {
                this.addLog(id, `Status changed: ${oldStatus} → ${status}`, 'info');
            }

            this.notifyUpdate();
        }
    }
}

// Export for use
window.MissionControlData = MissionControlData;