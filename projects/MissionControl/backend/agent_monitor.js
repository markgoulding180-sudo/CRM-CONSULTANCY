/**
 * Mission Control - Agent Monitor
 * Integrates with subagent spawning to track activity automatically
 * Zero cost - local file operations only
 */

const { exec } = require('child_process');
const path = require('path');

class AgentMonitor {
    constructor() {
        this.stateWriterPath = path.join(__dirname, 'state_writer.py');
    }

    /**
     * Track a subagent task from start to completion
     * @param {string} agentId - Agent identifier (e.g., 'qwen2.5-coder')
     * @param {string} task - Description of the task
     * @param {string} project - Project name
     * @param {Promise} taskPromise - The subagent promise to monitor
     */
    async trackTask(agentId, task, project, taskPromise) {
        // Mark agent as working
        await this.setAgentWorking(agentId, task, project);

        try {
            // Wait for task completion
            const result = await taskPromise;
            
            // Mark agent as idle (completed)
            await this.setAgentIdle(agentId);
            
            return result;
        } catch (error) {
            // Mark agent as error
            await this.setAgentError(agentId, error.message);
            throw error;
        }
    }

    /**
     * Update agent status to working
     */
    setAgentWorking(agentId, task, project) {
        return this._runPython(`agent_working('${agentId}', '${task}', '${project}')`);
    }

    /**
     * Update agent progress (0-100)
     */
    updateProgress(agentId, progress) {
        return this._runPython(`update_progress('${agentId}', ${progress})`);
    }

    /**
     * Mark agent as idle (completed)
     */
    setAgentIdle(agentId) {
        return this._runPython(`agent_idle('${agentId}')`);
    }

    /**
     * Mark agent as error
     */
    setAgentError(agentId, errorMsg) {
        return this._runPython(`agent_error('${agentId}', '${errorMsg.replace(/'/g, "\\'")}')`);
    }

    /**
     * Update project status
     */
    updateProject(projectName, progress, agents = 0, tasks = 0) {
        return this._runPython(`update_project('${projectName}', ${progress}, ${agents}, ${tasks})`);
    }

    /**
     * Run Python state writer command
     */
    _runPython(command) {
        return new Promise((resolve, reject) => {
            const pythonCmd = `python -c "import sys; sys.path.insert(0, r'${__dirname}'); from state_writer import ${command.split('(')[0]}; ${command}"`;
            
            exec(pythonCmd, (error, stdout, stderr) => {
                if (error) {
                    // Silently fail - don't block operations if tracking fails
                    console.log(`Mission Control update skipped: ${error.message}`);
                    resolve();
                } else {
                    resolve(stdout);
                }
            });
        });
    }
}

// Export singleton
module.exports = new AgentMonitor();