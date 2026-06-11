/**
 * db.js
 * API Client Database Manager for Performance Evaluation Platform
 * Communicates with Python FastAPI Backend via in-memory sync cache
 */

const API_URL = (typeof window !== 'undefined' && window.location.hostname)
    ? (window.location.port === '8080'
        ? `${window.location.protocol}//${window.location.hostname}:8000/api`
        : `${window.location.origin}/api`)
    : 'http://localhost:8000/api';

class Database {
    constructor() {
        this.projects = [];
        this.employees = [];
        this.evaluations = [];
        this.kpis = { common: [], targets: {} };
        this.settings = {};
    }

    // Sync all data tables from backend into local memory cache
    async sync() {
        try {
            const [projRes, empRes, evalRes, kpiRes, settingsRes] = await Promise.all([
                fetch(`${API_URL}/projects`),
                fetch(`${API_URL}/employees`),
                fetch(`${API_URL}/evaluations`),
                fetch(`${API_URL}/kpis`),
                fetch(`${API_URL}/settings`)
            ]);

            const projData = await projRes.json();
            const empData = await empRes.json();
            const evalData = await evalRes.json();
            const kpiData = await kpiRes.json();
            const settingsData = await settingsRes.json();

            // Map projects (snake_case from backend to camelCase for frontend)
            this.projects = projData.map(p => ({
                id: p.id,
                name: p.name,
                desc: p.desc || p.description || '',
                description: p.description || p.desc || '',
                status: p.status || 'Active'
            }));

            // Map employees
            this.employees = empData.map(e => ({
                id: e.id,
                name: e.name,
                email: e.email,
                role: e.role,
                designation: e.designation,
                joiningDate: e.joining_date || e.joiningDate || '',
                expertise: e.expertise,
                status: e.status || 'Active',
                projectIds: e.project_ids || e.projectIds || [],
                projectId: (e.project_ids && e.project_ids.length > 0) ? e.project_ids[0] : (e.projectId || '')
            }));

            // Map evaluations
            this.evaluations = evalData.map(ev => ({
                id: ev.id,
                employeeId: ev.employee_id || ev.employeeId,
                projectId: ev.project_id || ev.projectId,
                period: ev.period,
                scores: ev.scores,
                weightedScore: ev.weighted_score || ev.weightedScore,
                aiComments: ev.ai_comments || ev.aiComments || '',
                improvementAreas: ev.improvement_areas || ev.improvementAreas || '',
                status: ev.status,
                evaluatedBy: ev.evaluated_by || ev.evaluatedBy || '',
                updatedAt: ev.updated_at || ev.updatedAt || ''
            }));

            // Map KPIs
            this.kpis = kpiData;

            // Map settings
            this.settings = {
                managerName: settingsData.manager_name || settingsData.managerName || '',
                managerRole: settingsData.manager_role || settingsData.managerRole || '',
                openaiApiKey: settingsData.openai_api_key || settingsData.openaiApiKey || '',
                openaiEndpoint: settingsData.openai_endpoint || settingsData.openaiEndpoint || '',
                openaiModel: settingsData.openai_model || settingsData.openaiModel || '',
                azureEnabled: settingsData.azure_enabled || settingsData.azureEnabled || false,
                azureDeploymentName: settingsData.azure_deployment_name || settingsData.azureDeploymentName || ''
            };
        } catch (err) {
            console.error("Error syncing with backend database:", err);
        }
    }

    // Calculate dynamic experience in years & months
    calculateExperience(joiningDateStr) {
        if (!joiningDateStr) return '0 mos';
        const joinDate = new Date(joiningDateStr);
        const now = new Date();
        
        let months = (now.getFullYear() - joinDate.getFullYear()) * 12;
        months -= joinDate.getMonth();
        months += now.getMonth();
        
        if (now.getDate() < joinDate.getDate()) {
            months--; 
        }
        
        if (months < 0) return '0 mos';
        
        const yrs = Math.floor(months / 12);
        const mos = months % 12;
        
        if (yrs === 0) {
            return `${mos} mo${mos !== 1 ? 's' : ''}`;
        } else {
            return `${yrs} yr${yrs !== 1 ? 's' : ''} ${mos} mo${mos !== 1 ? 's' : ''}`;
        }
    }

    async resetToDefaults() {
        await fetch(`${API_URL}/reset`, { method: 'POST' });
        await this.sync();
    }

    // Synchronous reads from in-memory cache
    getProjects() {
        return this.projects;
    }

    getEmployees() {
        return this.employees;
    }

    getEvaluations() {
        return this.evaluations;
    }

    getKPIs() {
        return this.kpis;
    }

    getSettings() {
        return this.settings;
    }

    getKPIsByRole(role) {
        const common = this.kpis.common || [];
        const roleTargets = (this.kpis.targets && this.kpis.targets[role]) || {};
        
        return common.map(kpi => {
            const config = roleTargets[kpi.id];
            
            // Allow override of weight or target if stored in DB
            let weight = kpi.weight;
            let target = kpi.kpi;
            
            if (config) {
                if (typeof config.weight !== 'undefined') weight = config.weight;
                if (typeof config.target !== 'undefined') target = config.target;
            }
            
            return {
                id: kpi.id,
                category: kpi.category,
                kra: kpi.kra,
                name: kpi.kra,
                desc: kpi.desc,
                kpi: kpi.kpi,
                weight: weight,
                target: target
            };
        });
    }

    // Async modifying operations (which sync memory cache afterwards)
    async addProject(project) {
        const payload = {
            id: project.id || 'p_' + Date.now(),
            name: project.name,
            desc: project.desc || project.description || '',
            description: project.desc || project.description || '',
            status: project.status || 'Active'
        };
        const res = await fetch(`${API_URL}/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        await this.sync();
        return data;
    }

    async updateProject(project) {
        const payload = {
            id: project.id,
            name: project.name,
            desc: project.desc || project.description || '',
            description: project.desc || project.description || '',
            status: project.status || 'Active'
        };
        const res = await fetch(`${API_URL}/projects/${project.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        await this.sync();
        return data;
    }

    async deleteProject(id) {
        const res = await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE' });
        const data = await res.json();
        await this.sync();
        return data;
    }

    async addEmployee(employee) {
        const payload = {
            id: employee.id || 'e_' + Date.now(),
            name: employee.name,
            email: employee.email,
            role: employee.role || '',
            designation: employee.designation || '',
            joining_date: employee.joiningDate || '',
            expertise: employee.expertise || '',
            status: employee.status || 'Active',
            project_ids: employee.projectIds || []
        };
        const res = await fetch(`${API_URL}/employees`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        await this.sync();
        return data;
    }

    async updateEmployee(employee) {
        const payload = {
            id: employee.id,
            name: employee.name,
            email: employee.email,
            role: employee.role || '',
            designation: employee.designation || '',
            joining_date: employee.joiningDate || '',
            expertise: employee.expertise || '',
            status: employee.status || 'Active',
            project_ids: employee.projectIds || []
        };
        const res = await fetch(`${API_URL}/employees/${employee.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        await this.sync();
        return data;
    }

    async deleteEmployee(id) {
        const res = await fetch(`${API_URL}/employees/${id}`, { method: 'DELETE' });
        const data = await res.json();
        await this.sync();
        return data;
    }

    async updateKPIsForRole(role, kpiArray) {
        const res = await fetch(`${API_URL}/kpis/${encodeURIComponent(role)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(kpiArray)
        });
        const data = await res.json();
        await this.sync();
        return data;
    }

    async addEvaluation(evaluation) {
        const payload = {
            id: evaluation.id || 'ev_' + Date.now(),
            employee_id: evaluation.employeeId,
            project_id: evaluation.projectId,
            period: evaluation.period,
            scores: evaluation.scores,
            weighted_score: parseFloat(evaluation.weightedScore) || 0.0,
            ai_comments: evaluation.aiComments || '',
            improvement_areas: evaluation.improvementAreas || '',
            status: evaluation.status || 'Approved',
            evaluated_by: evaluation.evaluatedBy || ''
        };
        const res = await fetch(`${API_URL}/evaluations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        await this.sync();
        return data;
    }

    async deleteEvaluation(id) {
        const res = await fetch(`${API_URL}/evaluations/${id}`, { method: 'DELETE' });
        const data = await res.json();
        await this.sync();
        return data;
    }

    async saveSettings(settings) {
        const payload = {
            manager_name: settings.managerName,
            manager_role: settings.managerRole,
            openai_api_key: settings.openaiApiKey || '',
            openai_endpoint: settings.openaiEndpoint || '',
            openai_model: settings.openaiModel || '',
            azure_enabled: settings.azureEnabled || false,
            azure_deployment_name: settings.azureDeploymentName || ''
        };
        const res = await fetch(`${API_URL}/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        await this.sync();
        return data;
    }
}

// Attach Database to window object
window.DB = new Database();
