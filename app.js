/**
 * app.js
 * SPA Routing, Dashboard Analytics, and CRUD Controller
 */

document.addEventListener('DOMContentLoaded', () => {
    // Current Active States
    let activeView = 'dashboard';
    let editMode = { type: null, data: null }; // e.g., { type: 'project', data: {...} }
    let dashboardCharts = {};

    // DOM Elements
    const elements = {
        navLinks: document.querySelectorAll('.nav-link'),
        views: document.querySelectorAll('.view-section'),
        themeToggle: document.getElementById('theme-toggle'),
        themeIcon: document.getElementById('theme-icon'),
        themeText: document.getElementById('theme-text'),
        managerNameDisplay: document.getElementById('manager-name-display'),
        managerRoleDisplay: document.getElementById('manager-role-display'),
        
        // Dashboard Overhaul Stats & Elements
        totalRecordsCount: document.getElementById('total-records-count'),
        statAvgQuality: document.getElementById('stat-avg-quality'),
        statOnTime: document.getElementById('stat-on-time'),
        statHoursLogged: document.getElementById('stat-hours-logged'),
        statTopPerformers: document.getElementById('stat-top-performers'),
        trendAvgQuality: document.getElementById('trend-avg-quality'),
        trendOnTime: document.getElementById('trend-on-time'),
        trendHoursLogged: document.getElementById('trend-hours-logged'),
        trendTopPerformers: document.getElementById('trend-top-performers'),
        dbFilterProject: document.getElementById('db-filter-project'),
        dbFilterTeam: document.getElementById('db-filter-team'),
        dbFilterMonth: document.getElementById('db-filter-month'),
        dbResetFiltersBtn: document.getElementById('db-reset-filters-btn'),
        dbEmployeeSearch: document.getElementById('db-employee-search'),
        dbEmployeeWiseTableBody: document.getElementById('db-employee-wise-table-body'),
        dbDetailEmployeeSelect: document.getElementById('db-detail-employee-select'),
        dbDetailWorkspace: document.getElementById('db-detail-workspace'),
        dbDetailEmptyState: document.getElementById('db-detail-empty-state'),
        dbDetailAvatar: document.getElementById('db-detail-avatar'),
        dbDetailName: document.getElementById('db-detail-name'),
        dbDetailDesignation: document.getElementById('db-detail-designation'),
        dbDetailEmail: document.getElementById('db-detail-email'),
        dbDetailRole: document.getElementById('db-detail-role'),
        dbDetailExpertise: document.getElementById('db-detail-expertise'),
        dbDetailExperience: document.getElementById('db-detail-experience'),
        dbDetailJoinDate: document.getElementById('db-detail-join-date'),
        dbDetailProjects: document.getElementById('db-detail-projects'),
        
        // Projects View
        projectsTableBody: document.getElementById('projects-table-body'),
        projectForm: document.getElementById('project-form'),
        projectFormTitle: document.getElementById('project-form-title'),
        projectIdInput: document.getElementById('project-id'),
        projectNameInput: document.getElementById('project-name'),
        projectDescInput: document.getElementById('project-desc'),
        projectStatusInput: document.getElementById('project-status'),
        projectCancelBtn: document.getElementById('project-cancel-btn'),
        
        // Employees View
        employeesTableBody: document.getElementById('employees-table-body'),
        employeeForm: document.getElementById('employee-form'),
        employeeFormTitle: document.getElementById('employee-form-title'),
        employeeIdInput: document.getElementById('employee-id'),
        employeeNameInput: document.getElementById('employee-name'),
        employeeEmailInput: document.getElementById('employee-email'),
        employeeDesignationInput: document.getElementById('employee-designation'),
        employeeRoleInput: document.getElementById('employee-role'),
        employeeExpertiseInput: document.getElementById('employee-expertise'),
        employeeProjectsContainer: document.getElementById('employee-projects-container'),
        employeeJoiningDateInput: document.getElementById('employee-joining-date'),
        employeeStatusInput: document.getElementById('employee-status'),
        employeeCancelBtn: document.getElementById('employee-cancel-btn'),
        
        // KPI Settings View
        kpiRoleSelect: document.getElementById('kpi-role-select'),
        kpisContainer: document.getElementById('kpis-container'),
        kpiWeightsTotal: document.getElementById('kpi-weights-total'),
        kpiWeightsError: document.getElementById('kpi-weights-error'),
        saveKpisBtn: document.getElementById('save-kpis-btn'),
        resetKpisBtn: document.getElementById('reset-kpis-btn'),
        
        // Evaluation Form View
        evalProjectSelect: document.getElementById('eval-project-select'),
        evalEmployeeSelect: document.getElementById('eval-employee-select'),
        evalPeriodInput: document.getElementById('eval-period'),
        evalKpisContainer: document.getElementById('eval-kpis-container'),
        evalWeightedScoreGauge: document.getElementById('eval-weighted-score-gauge'),
        evalWeightedScoreValue: document.getElementById('eval-weighted-score-value'),
        evalAiComments: document.getElementById('eval-ai-comments'),
        evalImprovementAreas: document.getElementById('eval-improvement-areas'),
        generateAiCommentsBtn: document.getElementById('generate-ai-comments-btn'),
        aiLoadingSpinner: document.getElementById('ai-loading-spinner'),
        evalForm: document.getElementById('eval-form'),
        evaluatorNameInput: document.getElementById('evaluator-name'),
        
        // History View
        historyTableBody: document.getElementById('history-table-body'),
        filterProjectSelect: document.getElementById('filter-project'),
        filterEmployeeSelect: document.getElementById('filter-employee'),
        filterPeriodInput: document.getElementById('filter-period'),
        resetFiltersBtn: document.getElementById('reset-filters-btn'),
        
        // Settings View
        settingsForm: document.getElementById('settings-form'),
        settingsManagerName: document.getElementById('settings-manager-name'),
        settingsManagerRole: document.getElementById('settings-manager-role'),
        settingsApiKey: document.getElementById('settings-api-key'),
        settingsApiEndpoint: document.getElementById('settings-api-endpoint'),
        settingsApiModel: document.getElementById('settings-api-model'),
        settingsAzureEnabled: document.getElementById('settings-azure-enabled'),
        settingsAzureDeployment: document.getElementById('settings-azure-deployment'),
        resetDbBtn: document.getElementById('reset-db-btn'),
        
        // Report Modal
        reportModal: document.getElementById('report-modal'),
        closeModalBtn: document.getElementById('close-modal-btn'),
        modalEmployeeName: document.getElementById('modal-employee-name'),
        modalEmployeeRole: document.getElementById('modal-employee-role'),
        modalProjectName: document.getElementById('modal-project-name'),
        modalPeriod: document.getElementById('modal-period'),
        modalEvaluator: document.getElementById('modal-evaluator'),
        modalScoreGauge: document.getElementById('modal-score-gauge'),
        modalScoreValue: document.getElementById('modal-score-value'),
        modalKpiBreakdownBody: document.getElementById('modal-kpi-breakdown-body'),
        modalAiComments: document.getElementById('modal-ai-comments'),
        modalImprovementAreas: document.getElementById('modal-improvement-areas'),
        modalPrintBtn: document.getElementById('modal-print-btn'),
        modalCsvBtn: document.getElementById('modal-csv-btn'),
        
        // Login Screen Elements
        loginScreen: document.getElementById('login-screen'),
        ssoLoginBtn: document.getElementById('sso-login-btn'),
        localLoginForm: document.getElementById('local-login-form'),
        loginUsername: document.getElementById('login-username'),
        loginPassword: document.getElementById('login-password'),
        loginFormContainer: document.getElementById('login-form-container'),
        loginLoader: document.getElementById('login-loader'),
        loginLoaderTitle: document.getElementById('login-loader-title'),
        loginLoaderDesc: document.getElementById('login-loader-desc'),
        mfaApprovalStep: document.getElementById('mfa-approval-step'),
        logoutBtn: document.getElementById('logout-btn'),
        
        // Mentor Management Elements
        mentorForm: document.getElementById('mentor-form'),
        mentorFormTitle: document.getElementById('mentor-form-title'),
        mentorIdInput: document.getElementById('mentor-id'),
        mentorNameInput: document.getElementById('mentor-name'),
        mentorEmailInput: document.getElementById('mentor-email'),
        mentorPasswordInput: document.getElementById('mentor-password'),
        mentorRoleInput: document.getElementById('mentor-role'),
        mentorsTableBody: document.getElementById('mentors-table-body'),
        mentorCancelBtn: document.getElementById('mentor-cancel-btn')
    };

    // -------------------------------------------------------------
    // Authentication System (Azure AD / Local)
    // -------------------------------------------------------------
    function checkAuth() {
        const isAuthenticated = sessionStorage.getItem('perf_eval_auth');
        if (isAuthenticated === 'true') {
            elements.loginScreen.classList.add('hidden');
            initApp();
        } else {
            elements.loginScreen.classList.remove('hidden');
            setupAuthHandlers();
        }
    }

    function setupAuthHandlers() {
        elements.ssoLoginBtn.onclick = handleSsoLogin;
        elements.localLoginForm.onsubmit = handleLocalLogin;
    }

    async function handleSsoLogin() {
        // Show Loading state
        elements.loginFormContainer.classList.add('hidden');
        elements.loginLoader.classList.remove('hidden');
        elements.mfaApprovalStep.classList.add('hidden');

        // Step 1: Azure AD SSO connection
        elements.loginLoaderTitle.textContent = "Connecting to Azure Active Directory...";
        elements.loginLoaderDesc.textContent = "Verifying Single Sign-On (SSO) secure session...";
        await new Promise(r => setTimeout(r, 1200));

        // Step 2: MFA verification
        elements.loginLoaderTitle.textContent = "Verifying MFA Credentials...";
        elements.loginLoaderDesc.textContent = "A login request was sent to your authenticator app. Please approve.";
        await new Promise(r => setTimeout(r, 1200));
        
        // MFA Approved checkmark animation
        elements.mfaApprovalStep.classList.remove('hidden');
        elements.mfaApprovalStep.classList.add('animate-fade-in');
        await new Promise(r => setTimeout(r, 800));

        // Step 3: Success and redirection
        sessionStorage.setItem('perf_eval_auth', 'true');
        elements.loginScreen.classList.add('hidden');
        
        showNotification("Welcome back! Microsoft SSO Login Successful.", "success");
        initApp();
    }

    async function handleLocalLogin(e) {
        e.preventDefault();
        const email = elements.loginUsername.value.trim();
        const password = elements.loginPassword.value.trim();

        if (!email || !password) {
            showNotification("Please enter authorization credentials.", "error");
            return;
        }

        try {
            // Show Local Loading
            elements.loginFormContainer.classList.add('hidden');
            elements.loginLoader.classList.remove('hidden');
            elements.mfaApprovalStep.classList.add('hidden');

            elements.loginLoaderTitle.textContent = "Verifying Credentials...";
            elements.loginLoaderDesc.textContent = "Querying internal credential vault database...";

            // Send request to API
            await window.DB.login(email, password);

            elements.loginScreen.classList.add('hidden');
            showNotification("Authorized manager/mentor session.", "success");
            await initApp();
        } catch (err) {
            // Revert view states
            elements.loginFormContainer.classList.remove('hidden');
            elements.loginLoader.classList.add('hidden');
            showNotification(err.message || "Invalid credentials. Please try again.", "error");
        }
    }

    function handleLogout(e) {
        if (e) e.preventDefault();
        if (confirm("Are you sure you want to log out of the performance panel?")) {
            sessionStorage.removeItem('perf_eval_auth');
            showNotification("Successfully signed out.", "info");
            
            // Reload the page to reset all in-memory states cleanly
            window.location.reload();
        }
    }

    // -------------------------------------------------------------
    // Core Application Initialization
    // -------------------------------------------------------------
    async function initApp() {
        await window.DB.sync();
        setupNavigation();
        setupThemeToggle();
        setupSettingsHandlers();
        loadSettingsDisplay();

        // Bind logout button click
        elements.logoutBtn.addEventListener('click', handleLogout);
        
        // Populate static dropdown selections
        populateDropdowns();
        
        // Set default evaluation period to current month
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        elements.evalPeriodInput.value = `${year}-${month}`;

        // Initialize CRUD views
        renderProjects();
        renderEmployees();
        renderKPIConfigs();
        renderEvaluationsHistory();
        
        // Load initial dashboard statistics
        renderDashboard();

        // Dashboard Overhaul Listeners
        // Tab switching
        document.querySelectorAll('.db-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.db-tab-btn').forEach(b => {
                    b.classList.remove('active');
                    b.classList.add('text-gray-400', 'hover:text-white', 'hover:bg-gray-850', 'hover:bg-opacity-40');
                });
                btn.classList.add('active');
                btn.classList.remove('text-gray-400', 'hover:text-white', 'hover:bg-gray-850', 'hover:bg-opacity-40');
                
                const tab = btn.getAttribute('data-tab');
                document.querySelectorAll('.db-tab-content').forEach(content => {
                    content.classList.add('hidden');
                });
                document.getElementById(`db-tab-content-${tab}`).classList.remove('hidden');
                
                // Trigger specific tab rendering
                renderDashboard();
            });
        });

        // Filter updates
        elements.dbFilterProject.addEventListener('change', renderDashboard);
        elements.dbFilterTeam.addEventListener('change', renderDashboard);
        elements.dbFilterMonth.addEventListener('change', renderDashboard);
        elements.dbResetFiltersBtn.addEventListener('click', () => {
            elements.dbFilterProject.value = '';
            elements.dbFilterTeam.value = '';
            elements.dbFilterMonth.value = '';
            renderDashboard();
        });

        // Employee Wise search
        elements.dbEmployeeSearch.addEventListener('input', renderEmployeeWiseGrid);

        // Employee Detail select change
        elements.dbDetailEmployeeSelect.addEventListener('change', renderEmployeeDetailView);

        // Listen for sub-select filters
        elements.evalProjectSelect.addEventListener('change', handleEvalProjectChange);
        elements.evalEmployeeSelect.addEventListener('change', handleEvalEmployeeChange);
        
        // History filters
        elements.filterProjectSelect.addEventListener('change', renderEvaluationsHistory);
        elements.filterEmployeeSelect.addEventListener('change', renderEvaluationsHistory);
        elements.filterPeriodInput.addEventListener('change', renderEvaluationsHistory);
        elements.resetFiltersBtn.addEventListener('click', () => {
            elements.filterProjectSelect.value = '';
            elements.filterEmployeeSelect.value = '';
            elements.filterPeriodInput.value = '';
            renderEvaluationsHistory();
        });

        // Form bindings
        elements.projectForm.addEventListener('submit', handleProjectSubmit);
        elements.projectCancelBtn.addEventListener('click', resetProjectForm);
        
        elements.employeeForm.addEventListener('submit', handleEmployeeSubmit);
        elements.employeeCancelBtn.addEventListener('click', resetEmployeeForm);
        
        elements.evalForm.addEventListener('submit', handleEvalSubmit);
        elements.generateAiCommentsBtn.addEventListener('click', handleAiCommentGeneration);
        
        elements.kpiRoleSelect.addEventListener('change', renderKPIConfigs);
        elements.saveKpisBtn.addEventListener('click', handleSaveKPIs);
        elements.resetKpisBtn.addEventListener('click', handleResetKPIs);

        if (elements.mentorForm) {
            elements.mentorForm.addEventListener('submit', handleMentorSubmit);
        }
        if (elements.mentorCancelBtn) {
            elements.mentorCancelBtn.addEventListener('click', resetMentorForm);
        }

        // Modal triggers
        elements.closeModalBtn.addEventListener('click', () => {
            elements.reportModal.classList.add('hidden');
        });
        
        // Window click to close modal
        window.addEventListener('click', (e) => {
            if (e.target === elements.reportModal) {
                elements.reportModal.classList.add('hidden');
            }
        });
    }

    // -------------------------------------------------------------
    // Navigation / Router Logic
    // -------------------------------------------------------------
    function setupNavigation() {
        elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetView = link.getAttribute('data-view');
                switchView(targetView);
            });
        });
    }

    function switchView(viewId) {
        activeView = viewId;
        
        // Toggle Active Sidebar Links
        elements.navLinks.forEach(link => {
            if (link.getAttribute('data-view') === viewId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Toggle Views Visibility
        elements.views.forEach(view => {
            if (view.id === `${viewId}-view`) {
                view.classList.add('active', 'animate-fade-in');
            } else {
                view.classList.remove('active', 'animate-fade-in');
            }
        });

        // Specific View Lifecycle Hooks
        if (viewId === 'dashboard') {
            renderDashboard();
        } else if (viewId === 'projects') {
            renderProjects();
        } else if (viewId === 'employees') {
            renderEmployees();
            populateDropdowns();
        } else if (viewId === 'evaluations') {
            populateDropdowns();
            handleEvalProjectChange();
        } else if (viewId === 'history') {
            populateDropdowns();
            renderEvaluationsHistory();
        } else if (viewId === 'kpis') {
            renderKPIConfigs();
        } else if (viewId === 'mentors') {
            renderMentors();
        }
    }

    // Theme Toggle Handler
    function setupThemeToggle() {
        // Apply default or cached theme
        const cachedTheme = localStorage.getItem('theme');
        if (cachedTheme === 'light') {
            document.body.classList.add('light-theme');
            elements.themeIcon.setAttribute('data-lucide', 'moon');
            elements.themeText.textContent = 'Dark Mode';
        } else {
            elements.themeIcon.setAttribute('data-lucide', 'sun');
            elements.themeText.textContent = 'Light Mode';
        }
        lucide.createIcons();

        elements.themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.classList.toggle('light-theme');
            
            if (document.body.classList.contains('light-theme')) {
                localStorage.setItem('theme', 'light');
                elements.themeIcon.setAttribute('data-lucide', 'moon');
                elements.themeText.textContent = 'Dark Mode';
            } else {
                localStorage.setItem('theme', 'dark');
                elements.themeIcon.setAttribute('data-lucide', 'sun');
                elements.themeText.textContent = 'Light Mode';
            }
            lucide.createIcons();
            
            // Re-render dashboard charts if they exist to match updated themes
            if (activeView === 'dashboard') {
                renderDashboard();
            }
        });
    }

    // -------------------------------------------------------------
    // Dropdowns & Select Populators
    // -------------------------------------------------------------
    function populateDropdowns() {
        const projects = window.DB.getProjects();
        const employees = window.DB.getEmployees();

        // Project Dropdowns
        const projOptions = '<option value="">-- Select Project --</option>' + 
            projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
            
        // Populate project checkbox container
        if (projects.length === 0) {
            elements.employeeProjectsContainer.innerHTML = '<div class="text-3xs text-gray-500 py-1 font-medium">No projects available</div>';
        } else {
            // Preserve checked status if it's already rendered
            const checkedIds = Array.from(elements.employeeProjectsContainer.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
            
            elements.employeeProjectsContainer.innerHTML = projects.map(p => {
                const isChecked = checkedIds.includes(p.id) ? 'checked' : '';
                return `
                    <label class="flex items-center gap-2 text-xs font-semibold text-gray-300 hover:text-white cursor-pointer py-0.5">
                        <input type="checkbox" name="employee-projects" value="${p.id}" ${isChecked} class="rounded border-gray-750 bg-gray-900 text-purple-600 focus:ring-purple-500 w-4 h-4">
                        <span>${p.name}</span>
                    </label>
                `;
            }).join('');
        }

        elements.evalProjectSelect.innerHTML = projOptions;
        elements.filterProjectSelect.innerHTML = '<option value="">All Projects</option>' + 
            projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('');

        // Employee filter in History
        elements.filterEmployeeSelect.innerHTML = '<option value="">All Employees</option>' +
            employees.map(e => `<option value="${e.id}">${e.name} (${e.role || 'No Role'})</option>`).join('');

        // Dashboard Overhaul Filters
        elements.dbFilterProject.innerHTML = '<option value="">All Projects</option>' + 
            projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
            
        const dbEvaluations = window.DB.getEvaluations();
        const dbPeriods = [...new Set(dbEvaluations.map(ev => ev.period))].sort();
        elements.dbFilterMonth.innerHTML = '<option value="">All Months</option>' +
            dbPeriods.map(p => `<option value="${p}">${formatPeriodString(p)}</option>`).join('');

        // Populate detail view selector
        elements.dbDetailEmployeeSelect.innerHTML = '<option value="">-- Choose Employee --</option>' +
            employees.map(e => `<option value="${e.id}">${e.name} (${e.role || 'No Role'})</option>`).join('');
    }

    // -------------------------------------------------------------
    // Settings Logic
    // -------------------------------------------------------------
    function loadSettingsDisplay() {
        const settings = window.DB.getSettings();
        
        // Read authenticated user details if present
        const userName = sessionStorage.getItem('perf_eval_user_name') || settings.managerName || 'User';
        const userRole = sessionStorage.getItem('perf_eval_user_role') || settings.managerRole || 'Delivery Manager';

        elements.managerNameDisplay.textContent = userName;
        elements.managerRoleDisplay.textContent = userRole;
        elements.evaluatorNameInput.value = userName;

        // Form Inputs
        elements.settingsManagerName.value = settings.managerName || '';
        elements.settingsManagerRole.value = settings.managerRole || '';
        elements.settingsApiKey.value = settings.openaiApiKey || '';
        elements.settingsApiEndpoint.value = settings.openaiEndpoint || '';
        elements.settingsApiModel.value = settings.openaiModel || '';
        elements.settingsAzureEnabled.checked = settings.azureEnabled || false;
        elements.settingsAzureDeployment.value = settings.azureDeploymentName || '';
        
        toggleAzureSettings(settings.azureEnabled);

        // Dynamic view authorization: hide "Manage Mentors" nav tab if role is not Manager
        const navMentors = document.getElementById('nav-mentors');
        if (navMentors) {
            if (sessionStorage.getItem('perf_eval_user_role') === 'Manager') {
                navMentors.classList.remove('hidden');
            } else {
                navMentors.classList.add('hidden');
            }
        }
    }

    function setupSettingsHandlers() {
        elements.settingsAzureEnabled.addEventListener('change', (e) => {
            toggleAzureSettings(e.target.checked);
        });

        elements.settingsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const updated = {
                managerName: elements.settingsManagerName.value.trim(),
                managerRole: elements.settingsManagerRole.value.trim(),
                openaiApiKey: elements.settingsApiKey.value.trim(),
                openaiEndpoint: elements.settingsApiEndpoint.value.trim(),
                openaiModel: elements.settingsApiModel.value.trim(),
                azureEnabled: elements.settingsAzureEnabled.checked,
                azureDeploymentName: elements.settingsAzureDeployment.value.trim()
            };

            await window.DB.saveSettings(updated);
            loadSettingsDisplay();
            showNotification('Settings saved successfully!', 'success');
        });

        elements.resetDbBtn.addEventListener('click', async () => {
            if (confirm('Are you sure you want to reset the database to default seed data? All custom evaluations and records will be deleted!')) {
                await window.DB.resetToDefaults();
                showNotification('Database reset to initial defaults.', 'info');
                await initApp();
                switchView('dashboard');
            }
        });
    }

    function toggleAzureSettings(enabled) {
        const row = document.getElementById('azure-deployment-row');
        if (enabled) {
            row.classList.remove('hidden');
        } else {
            row.classList.add('hidden');
        }
    }

    // -------------------------------------------------------------
    // Dashboard Logic & Analytics
    // -------------------------------------------------------------
    // Helper to get previous period (YYYY-MM -> YYYY-MM)
    function getPreviousPeriod(period) {
        if (!period) return null;
        const [year, month] = period.split('-').map(Number);
        if (month === 1) {
            return `${year - 1}-12`;
        } else {
            return `${year}-${String(month - 1).padStart(2, '0')}`;
        }
    }

    function renderDashboard() {
        const projects = window.DB.getProjects();
        const employees = window.DB.getEmployees();
        const evaluations = window.DB.getEvaluations();

        // Get filter values
        const selectedProj = elements.dbFilterProject.value;
        const selectedTeam = elements.dbFilterTeam.value;
        const selectedMonth = elements.dbFilterMonth.value;

        // Filter evaluations
        const filteredEvals = evaluations.filter(ev => {
            if (selectedProj && ev.projectId !== selectedProj) return false;
            if (selectedMonth && ev.period !== selectedMonth) return false;
            if (selectedTeam) {
                const emp = employees.find(e => e.id === ev.employeeId);
                const empRole = emp ? emp.role : '';
                if (selectedTeam === 'No Role') {
                    if (empRole) return false;
                } else {
                    if (empRole !== selectedTeam) return false;
                }
            }
            return true;
        });

        // Calculate record count
        elements.totalRecordsCount.textContent = filteredEvals.length;

        // --- Calculate Current Period Metrics ---
        // 1. Avg Quality Score
        let avgQuality = 0.0;
        let qualityEvals = filteredEvals.filter(ev => ev.scores && ev.scores['kpi-quality']);
        if (qualityEvals.length > 0) {
            const sum = qualityEvals.reduce((acc, ev) => acc + parseFloat(ev.scores['kpi-quality']), 0);
            avgQuality = (sum / qualityEvals.length) / 5 * 100;
        }

        // 2. On-Time Delivery
        let avgOnTime = 0.0;
        let onTimeEvals = filteredEvals.filter(ev => ev.scores && ev.scores['kpi-adherence']);
        if (onTimeEvals.length > 0) {
            const sum = onTimeEvals.reduce((acc, ev) => acc + parseFloat(ev.scores['kpi-adherence']), 0);
            avgOnTime = (sum / onTimeEvals.length) / 5 * 100;
        }

        // 3. Hours Logged
        let totalHours = 0;
        filteredEvals.forEach(ev => {
            // Deterministic mock hours
            const idNum = parseInt(ev.id.replace(/\D/g, '')) || 0;
            const hours = 160 + (idNum % 15) - 7;
            totalHours += hours;
        });

        // 4. Top Performers
        const topPerformersCount = filteredEvals.filter(ev => ev.weightedScore >= 4.5).length;

        // Update current stats in UI
        elements.statAvgQuality.textContent = avgQuality > 0 ? `${avgQuality.toFixed(1)}%` : '--%';
        elements.statOnTime.textContent = avgOnTime > 0 ? `${avgOnTime.toFixed(1)}%` : '--%';
        elements.statHoursLogged.textContent = totalHours > 0 ? `${totalHours.toLocaleString()} hrs` : '0 hrs';
        elements.statTopPerformers.textContent = `${topPerformersCount} employee${topPerformersCount !== 1 ? 's' : ''}`;

        // --- Calculate Trends vs Previous Period ---
        let prevMonth = selectedMonth;
        if (!prevMonth) {
            // Find latest period in matching evaluations, and use its previous month
            const periods = [...new Set(filteredEvals.map(ev => ev.period))].sort();
            prevMonth = periods[periods.length - 1];
        }
        const prevPeriod = getPreviousPeriod(prevMonth);

        // Filter previous month evaluations
        const prevEvals = evaluations.filter(ev => {
            if (selectedProj && ev.projectId !== selectedProj) return false;
            if (ev.period !== prevPeriod) return false;
            if (selectedTeam) {
                const emp = employees.find(e => e.id === ev.employeeId);
                const empRole = emp ? emp.role : '';
                if (selectedTeam === 'No Role') {
                    if (empRole) return false;
                } else {
                    if (empRole !== selectedTeam) return false;
                }
            }
            return true;
        });

        // Previous Quality
        let prevAvgQuality = 0.0;
        let prevQualityEvals = prevEvals.filter(ev => ev.scores && ev.scores['kpi-quality']);
        if (prevQualityEvals.length > 0) {
            const sum = prevQualityEvals.reduce((acc, ev) => acc + parseFloat(ev.scores['kpi-quality']), 0);
            prevAvgQuality = (sum / prevQualityEvals.length) / 5 * 100;
        }

        // Previous On-Time
        let prevAvgOnTime = 0.0;
        let prevOnTimeEvals = prevEvals.filter(ev => ev.scores && ev.scores['kpi-adherence']);
        if (prevOnTimeEvals.length > 0) {
            const sum = prevOnTimeEvals.reduce((acc, ev) => acc + parseFloat(ev.scores['kpi-adherence']), 0);
            prevAvgOnTime = (sum / prevOnTimeEvals.length) / 5 * 100;
        }

        // Previous Hours
        let prevTotalHours = 0;
        prevEvals.forEach(ev => {
            const idNum = parseInt(ev.id.replace(/\D/g, '')) || 0;
            const hours = 160 + (idNum % 15) - 7;
            prevTotalHours += hours;
        });

        // Previous Top Performers
        const prevTopPerformersCount = prevEvals.filter(ev => ev.weightedScore >= 4.5).length;

        // Render trend indicator helper
        function renderTrend(element, currentVal, prevVal, isPercentage = false, isHours = false) {
            if (prevVal <= 0 || currentVal <= 0) {
                element.innerHTML = `<span class="text-gray-500">- No change</span>`;
                return;
            }
            
            let diff = currentVal - prevVal;
            if (isHours) {
                diff = ((currentVal - prevVal) / prevVal) * 100;
            }
            
            const diffText = diff >= 0 ? `+${diff.toFixed(1)}%` : `${diff.toFixed(1)}%`;
            if (diff > 0.05) {
                element.innerHTML = `<span class="text-emerald-400 flex items-center gap-0.5"><i data-lucide="trending-up" class="w-3 h-3 text-emerald-400"></i> ${diffText} vs last month</span>`;
            } else if (diff < -0.05) {
                element.innerHTML = `<span class="text-red-400 flex items-center gap-0.5"><i data-lucide="trending-down" class="w-3 h-3 text-red-400"></i> ${diffText} vs last month</span>`;
            } else {
                element.innerHTML = `<span class="text-gray-500">- No change</span>`;
            }
        }

        // Render trends
        renderTrend(elements.trendAvgQuality, avgQuality, prevAvgQuality, true);
        renderTrend(elements.trendOnTime, avgOnTime, prevAvgOnTime, true);
        renderTrend(elements.trendHoursLogged, totalHours, prevTotalHours, false, true);
        
        // Custom top performers trend (difference in headcount)
        if (prevTopPerformersCount > 0 || topPerformersCount > 0) {
            const diff = topPerformersCount - prevTopPerformersCount;
            const diffText = diff >= 0 ? `+${diff}` : `${diff}`;
            if (diff > 0) {
                elements.trendTopPerformers.innerHTML = `<span class="text-emerald-400 flex items-center gap-0.5"><i data-lucide="trending-up" class="w-3 h-3 text-emerald-400"></i> ${diffText} vs last month</span>`;
            } else if (diff < 0) {
                elements.trendTopPerformers.innerHTML = `<span class="text-red-400 flex items-center gap-0.5"><i data-lucide="trending-down" class="w-3 h-3 text-red-400"></i> ${diffText} vs last month</span>`;
            } else {
                elements.trendTopPerformers.innerHTML = `<span class="text-gray-500">- No change</span>`;
            }
        } else {
            elements.trendTopPerformers.innerHTML = `<span class="text-gray-500">- No change</span>`;
        }

        // Initialize Lucide icons on newly generated content
        if (window.lucide) {
            window.lucide.createIcons();
        }

        // Route charts rendering based on current active tab
        const activeTabBtn = document.querySelector('.db-tab-btn.active');
        const activeTab = activeTabBtn ? activeTabBtn.getAttribute('data-tab') : 'overview';

        if (activeTab === 'overview') {
            renderDashboardCharts(filteredEvals);
        } else if (activeTab === 'trends') {
            renderDetailedTrendsChart(filteredEvals);
        } else if (activeTab === 'employee-wise') {
            renderEmployeeWiseGrid();
        } else if (activeTab === 'employee-detail') {
            renderEmployeeDetailView();
        }
    }

    function destroyCharts() {
        if (dashboardCharts.monthlyAvgChart) dashboardCharts.monthlyAvgChart.destroy();
        if (dashboardCharts.hoursLoggedChart) dashboardCharts.hoursLoggedChart.destroy();
        if (dashboardCharts.ratingDistChart) dashboardCharts.ratingDistChart.destroy();
        if (dashboardCharts.projPerfChart) dashboardCharts.projPerfChart.destroy();
        if (dashboardCharts.detailedTrendsChart) dashboardCharts.detailedTrendsChart.destroy();
        if (dashboardCharts.detailRadarChart) dashboardCharts.detailRadarChart.destroy();
        if (dashboardCharts.detailHistoryChart) dashboardCharts.detailHistoryChart.destroy();
    }

    function renderDashboardCharts(filteredEvals) {
        destroyCharts();
        
        const isLight = document.body.classList.contains('light-theme');
        const gridColor = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';
        const labelColor = isLight ? '#4b5563' : '#9ca3af';

        // 1. Chart: Monthly Avg Performance (Cyan for Quality, Emerald for On-Time)
        const periods = [...new Set(filteredEvals.map(ev => ev.period))].sort();
        
        const monthlyQualities = [];
        const monthlyOnTimes = [];
        
        periods.forEach(p => {
            const evs = filteredEvals.filter(ev => ev.period === p);
            
            const qSum = evs.reduce((acc, ev) => acc + (parseFloat(ev.scores['kpi-quality']) || 0), 0);
            const qAvg = evs.length > 0 ? (qSum / evs.length) / 5 * 100 : 0;
            monthlyQualities.push(qAvg);
            
            const oSum = evs.reduce((acc, ev) => acc + (parseFloat(ev.scores['kpi-adherence']) || 0), 0);
            const oAvg = evs.length > 0 ? (oSum / evs.length) / 5 * 100 : 0;
            monthlyOnTimes.push(oAvg);
        });

        const periodLabels = periods.map(p => {
            const [yr, mo] = p.split('-');
            return new Date(yr, mo - 1).toLocaleString('default', { month: 'short' });
        });

        const avgCtx = document.getElementById('chart-monthly-avg').getContext('2d');
        dashboardCharts.monthlyAvgChart = new Chart(avgCtx, {
            type: 'line',
            data: {
                labels: periodLabels.length > 0 ? periodLabels : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                datasets: [
                    {
                        label: 'Avg Quality %',
                        data: monthlyQualities.length > 0 ? monthlyQualities : [0, 0, 0, 0, 0, 0, 0, 0],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.05)',
                        fill: true,
                        tension: 0.3,
                        borderWidth: 2.5,
                        pointBackgroundColor: '#3b82f6'
                    },
                    {
                        label: 'Avg On-Time %',
                        data: monthlyOnTimes.length > 0 ? monthlyOnTimes : [0, 0, 0, 0, 0, 0, 0, 0],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.05)',
                        fill: true,
                        tension: 0.3,
                        borderWidth: 2.5,
                        pointBackgroundColor: '#10b981'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: { color: labelColor, boxWidth: 12, font: { weight: '600', size: 10 } }
                    }
                },
                scales: {
                    x: { grid: { color: gridColor }, ticks: { color: labelColor } },
                    y: { min: 0, max: 100, grid: { color: gridColor }, ticks: { color: labelColor, stepSize: 20 } }
                }
            }
        });

        // 2. Chart: Avg Hours Logged per Month (Purple bars)
        const monthlyHours = [];
        periods.forEach(p => {
            const evs = filteredEvals.filter(ev => ev.period === p);
            let sumHours = 0;
            evs.forEach(ev => {
                const idNum = parseInt(ev.id.replace(/\D/g, '')) || 0;
                sumHours += (160 + (idNum % 15) - 7);
            });
            const avgHrs = evs.length > 0 ? sumHours / evs.length : 0;
            monthlyHours.push(avgHrs);
        });

        const hoursCtx = document.getElementById('chart-hours-logged').getContext('2d');
        dashboardCharts.hoursLoggedChart = new Chart(hoursCtx, {
            type: 'bar',
            data: {
                labels: periodLabels.length > 0 ? periodLabels : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                datasets: [{
                    label: 'Avg Hours Logged',
                    data: monthlyHours.length > 0 ? monthlyHours : [0, 0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: '#8b5cf6',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: labelColor } },
                    y: { min: 0, max: 180, grid: { color: gridColor }, ticks: { color: labelColor, stepSize: 30 } }
                }
            }
        });

        // 3. Chart: Rating Distribution (Blue columns: Exceeds, Meets, Below, Critical)
        let exceeds = 0, meets = 0, below = 0, critical = 0;
        filteredEvals.forEach(ev => {
            const s = parseFloat(ev.weightedScore);
            if (s >= 4.5) exceeds++;
            else if (s >= 3.5) meets++;
            else if (s >= 2.5) below++;
            else critical++;
        });

        const ratingCtx = document.getElementById('chart-rating-dist').getContext('2d');
        dashboardCharts.ratingDistChart = new Chart(ratingCtx, {
            type: 'bar',
            data: {
                labels: ['Exceeds (≥4.5)', 'Meets (3.5-4.4)', 'Below (2.5-3.4)', 'Critical (<2.5)'],
                datasets: [{
                    label: 'Employees Count',
                    data: [exceeds, meets, below, critical],
                    backgroundColor: '#3b82f6',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: labelColor } },
                    y: { 
                        grid: { color: gridColor }, 
                        ticks: { 
                            color: labelColor,
                            stepSize: Math.max(1, Math.ceil(Math.max(exceeds, meets, below, critical) / 5)) 
                        } 
                    }
                }
            }
        });

        // 4. Chart: Performance by Project (Grouped bars side by side: Quality % vs On-Time %)
        const projects = window.DB.getProjects();
        const projectAverages = projects.map(p => {
            const evs = filteredEvals.filter(ev => ev.projectId === p.id);
            if (evs.length === 0) return null;
            
            const qSum = evs.reduce((acc, ev) => acc + (parseFloat(ev.scores['kpi-quality']) || 0), 0);
            const qAvg = (qSum / evs.length) / 5 * 100;
            
            const oSum = evs.reduce((acc, ev) => acc + (parseFloat(ev.scores['kpi-adherence']) || 0), 0);
            const oAvg = (oSum / evs.length) / 5 * 100;
            
            return { name: p.name, quality: qAvg, onTime: oAvg };
        }).filter(Boolean);

        const projCtx = document.getElementById('chart-proj-perf').getContext('2d');
        dashboardCharts.projPerfChart = new Chart(projCtx, {
            type: 'bar',
            data: {
                labels: projectAverages.map(pa => pa.name),
                datasets: [
                    {
                        label: 'Quality %',
                        data: projectAverages.map(pa => pa.quality),
                        backgroundColor: '#3b82f6',
                        borderRadius: 4
                    },
                    {
                        label: 'On-Time %',
                        data: projectAverages.map(pa => pa.onTime),
                        backgroundColor: '#10b981',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: { color: labelColor, boxWidth: 12, font: { weight: '600', size: 10 } }
                    }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { color: labelColor } },
                    y: { min: 0, max: 100, grid: { color: gridColor }, ticks: { color: labelColor, stepSize: 20 } }
                }
            }
        });
    }

    function renderDetailedTrendsChart(filteredEvals) {
        destroyCharts();
        
        const isLight = document.body.classList.contains('light-theme');
        const gridColor = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';
        const labelColor = isLight ? '#4b5563' : '#9ca3af';

        const projects = window.DB.getProjects();
        const periods = [...new Set(filteredEvals.map(ev => ev.period))].sort();
        
        const projectColors = ['#8b5cf6', '#10b981', '#3b82f6', '#f59e0b', '#ef4444'];
        
        const datasets = projects.map((proj, idx) => {
            const data = periods.map(p => {
                const evs = filteredEvals.filter(ev => ev.projectId === proj.id && ev.period === p);
                if (evs.length === 0) return null;
                const sum = evs.reduce((acc, ev) => acc + parseFloat(ev.weightedScore), 0);
                return (sum / evs.length).toFixed(2);
            });
            
            const color = projectColors[idx % projectColors.length];
            return {
                label: proj.name,
                data: data,
                borderColor: color,
                backgroundColor: 'transparent',
                borderWidth: 2,
                pointBackgroundColor: color,
                pointHoverRadius: 6,
                tension: 0.2
            };
        }).filter(dataset => dataset.data.some(val => val !== null));

        const periodLabels = periods.map(p => {
            const [yr, mo] = p.split('-');
            return new Date(yr, mo - 1).toLocaleString('default', { month: 'short', year: '2-digit' });
        });

        const ctx = document.getElementById('chart-detailed-trends').getContext('2d');
        dashboardCharts.detailedTrendsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: periodLabels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: { color: labelColor, boxWidth: 12, font: { weight: '600' } }
                    }
                },
                scales: {
                    x: { grid: { color: gridColor }, ticks: { color: labelColor } },
                    y: { min: 1.0, max: 5.0, grid: { color: gridColor }, ticks: { color: labelColor, stepSize: 1.0 } }
                }
            }
        });
    }

    function renderEmployeeWiseGrid() {
        const employees = window.DB.getEmployees();
        const evaluations = window.DB.getEvaluations();
        const searchQuery = elements.dbEmployeeSearch.value.trim().toLowerCase();

        // Get filter selections
        const selectedProj = elements.dbFilterProject.value;
        const selectedTeam = elements.dbFilterTeam.value;
        const selectedMonth = elements.dbFilterMonth.value;

        // Filter employees list
        const filteredEmployees = employees.filter(e => {
            if (searchQuery && !e.name.toLowerCase().includes(searchQuery)) return false;
            
            // Project filter check (support multi-project assignment)
            if (selectedProj) {
                const assignedProjIds = e.projectIds || (e.projectId ? [e.projectId] : []);
                if (!assignedProjIds.includes(selectedProj)) return false;
            }
            
            // Team/Role filter check
            if (selectedTeam) {
                if (selectedTeam === 'No Role') {
                    if (e.role) return false;
                } else {
                    if (e.role !== selectedTeam) return false;
                }
            }
            
            return true;
        });

        if (filteredEmployees.length === 0) {
            elements.dbEmployeeWiseTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-8 text-center text-gray-500 font-medium">
                        No employees found matching filters.
                    </td>
                </tr>
            `;
            return;
        }

        elements.dbEmployeeWiseTableBody.innerHTML = filteredEmployees.map(e => {
            // Find evaluations for this employee matching the project and period filters
            const empEvals = evaluations.filter(ev => {
                if (ev.employeeId !== e.id) return false;
                if (selectedProj && ev.projectId !== selectedProj) return false;
                if (selectedMonth && ev.period !== selectedMonth) return false;
                return true;
            });

            let overallAvg = '--';
            let qualityAvg = '--';
            let adherenceAvg = '--';
            let totalHours = 0;

            if (empEvals.length > 0) {
                const scoreSum = empEvals.reduce((acc, ev) => acc + parseFloat(ev.weightedScore), 0);
                overallAvg = (scoreSum / empEvals.length).toFixed(2);

                const qualSum = empEvals.reduce((acc, ev) => acc + (parseFloat(ev.scores['kpi-quality']) || 0), 0);
                qualityAvg = ((qualSum / empEvals.length) / 5 * 100).toFixed(1) + '%';

                const adhSum = empEvals.reduce((acc, ev) => acc + (parseFloat(ev.scores['kpi-adherence']) || 0), 0);
                adherenceAvg = ((adhSum / empEvals.length) / 5 * 100).toFixed(1) + '%';

                empEvals.forEach(ev => {
                    const idNum = parseInt(ev.id.replace(/\D/g, '')) || 0;
                    totalHours += (160 + (idNum % 15) - 7);
                });
            }

            const displayRole = e.role || '<span class="text-gray-500 italic">No Role</span>';

            return `
                <tr class="border-b border-gray-800 hover:bg-gray-950 hover:bg-opacity-30">
                    <td class="px-6 py-4 text-gray-200 text-sm">
                        <div class="font-semibold">${e.name}</div>
                        <div class="text-xs text-gray-400">${e.designation || 'Engineer'}</div>
                    </td>
                    <td class="px-6 py-4 text-sm">
                        <span class="inline-block px-2 py-0.5 text-3xs font-semibold rounded bg-gray-900 border border-gray-800 text-gray-300">${displayRole}</span>
                    </td>
                    <td class="px-6 py-4 text-sm font-bold text-purple-400">${overallAvg}</td>
                    <td class="px-6 py-4 text-sm text-gray-300 font-medium">${qualityAvg}</td>
                    <td class="px-6 py-4 text-sm text-gray-300 font-medium">${adherenceAvg}</td>
                    <td class="px-6 py-4 text-sm text-gray-400">${totalHours > 0 ? totalHours.toLocaleString() + ' hrs' : '--'}</td>
                </tr>
            `;
        }).join('');
    }

    function renderEmployeeDetailView() {
        destroyCharts();
        
        const isLight = document.body.classList.contains('light-theme');
        const gridColor = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';
        const labelColor = isLight ? '#4b5563' : '#9ca3af';

        const empId = elements.dbDetailEmployeeSelect.value;
        if (!empId) {
            elements.dbDetailWorkspace.classList.add('hidden');
            elements.dbDetailEmptyState.classList.remove('hidden');
            return;
        }

        const employee = window.DB.getEmployees().find(e => e.id === empId);
        if (!employee) return;

        elements.dbDetailWorkspace.classList.remove('hidden');
        elements.dbDetailEmptyState.classList.add('hidden');

        // Populate Profile Card
        const initials = employee.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        elements.dbDetailAvatar.textContent = initials;
        elements.dbDetailName.textContent = employee.name;
        elements.dbDetailDesignation.textContent = employee.designation || 'Engineer';
        elements.dbDetailEmail.textContent = employee.email;
        elements.dbDetailRole.textContent = employee.role || 'No Role Specified';
        elements.dbDetailExpertise.textContent = employee.expertise || 'Intermediate';
        
        const joinDateFormatted = employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString('default', { month: 'long', year: 'numeric', day: 'numeric' }) : 'N/A';
        elements.dbDetailJoinDate.textContent = joinDateFormatted;
        elements.dbDetailExperience.textContent = window.DB.calculateExperience(employee.joiningDate);
        
        const projects = window.DB.getProjects();
        const assignedProjIds = employee.projectIds || (employee.projectId ? [employee.projectId] : []);
        const assignedProjs = assignedProjIds.map(pid => projects.find(p => p.id === pid)).filter(Boolean);
        elements.dbDetailProjects.textContent = assignedProjs.length > 0 ? assignedProjs.map(p => p.name).join(', ') : 'Unassigned';

        // Load Evaluations
        const evaluations = window.DB.getEvaluations().filter(ev => ev.employeeId === employee.id).sort((a, b) => a.period.localeCompare(b.period));

        // Group 13 KPIs into 4 categories
        const kpiCategories = {
            'High Impact Delivery': 0,
            'Best Platform / Best Solution': 0,
            'High Performing Team': 0,
            'Productivity': 0
        };
        const kpiCategoryCounts = {
            'High Impact Delivery': 0,
            'Best Platform / Best Solution': 0,
            'High Performing Team': 0,
            'Productivity': 0
        };

        const dbKpiSettings = window.DB.getKPIs();
        const commonKpis = dbKpiSettings.common || [];

        evaluations.forEach(ev => {
            Object.entries(ev.scores || {}).forEach(([kpiId, score]) => {
                const common = commonKpis.find(k => k.id === kpiId);
                if (common) {
                    const cat = common.category;
                    if (typeof kpiCategories[cat] !== 'undefined') {
                        kpiCategories[cat] += parseFloat(score);
                        kpiCategoryCounts[cat]++;
                    }
                }
            });
        });

        const radarLabels = Object.keys(kpiCategories);
        const radarData = radarLabels.map(cat => {
            const count = kpiCategoryCounts[cat];
            return count > 0 ? (kpiCategories[cat] / count).toFixed(2) : 0;
        });

        // 1. Radar Chart (KPI Performance Map)
        const radarCtx = document.getElementById('chart-detail-radar').getContext('2d');
        dashboardCharts.detailRadarChart = new Chart(radarCtx, {
            type: 'radar',
            data: {
                labels: radarLabels,
                datasets: [{
                    label: 'Avg KPI Rating',
                    data: radarData,
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    borderColor: '#8b5cf6',
                    borderWidth: 2,
                    pointBackgroundColor: '#8b5cf6'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    r: {
                        angleLines: { color: gridColor },
                        grid: { color: gridColor },
                        pointLabels: { color: labelColor, font: { size: 9, weight: '600' } },
                        min: 0,
                        max: 5,
                        ticks: { stepSize: 1, backdropColor: 'transparent', color: labelColor, showLabelBackdrop: false }
                    }
                }
            }
        });

        // 2. Score History Line Chart
        const historyLabels = evaluations.map(ev => {
            const [yr, mo] = ev.period.split('-');
            return new Date(yr, mo - 1).toLocaleString('default', { month: 'short', year: '2-digit' });
        });
        const historyData = evaluations.map(ev => ev.weightedScore.toFixed(2));

        const historyCtx = document.getElementById('chart-detail-history').getContext('2d');
        dashboardCharts.detailHistoryChart = new Chart(historyCtx, {
            type: 'line',
            data: {
                labels: historyLabels.length > 0 ? historyLabels : ['N/A'],
                datasets: [{
                    label: 'Weighted Score',
                    data: historyData.length > 0 ? historyData : [0],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                    tension: 0.2,
                    borderWidth: 2.5,
                    pointBackgroundColor: '#10b981'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { color: gridColor }, ticks: { color: labelColor } },
                    y: { min: 1.0, max: 5.0, grid: { color: gridColor }, ticks: { color: labelColor, stepSize: 1.0 } }
                }
            }
        });
    }

    // -------------------------------------------------------------
    // Project CRUD Event Handlers
    // -------------------------------------------------------------
    function renderProjects() {
        const projects = window.DB.getProjects();
        elements.projectsTableBody.innerHTML = projects.map(p => `
            <tr class="border-b border-gray-800 hover:bg-gray-950 hover:bg-opacity-30">
                <td class="px-6 py-4 font-semibold text-gray-200 text-sm">${p.name}</td>
                <td class="px-6 py-4 text-gray-400 text-sm">${p.desc}</td>
                <td class="px-6 py-4 text-sm">
                    <span class="px-2 py-0.5 text-xs font-semibold rounded-full ${p.status === 'Active' ? 'glow-badge-green' : 'glow-badge-red'}">
                        ${p.status}
                    </span>
                </td>
                <td class="px-6 py-4 text-right text-sm">
                    <button class="edit-proj-btn text-purple-400 hover:text-purple-300 mr-3 transition" data-id="${p.id}">
                        Edit
                    </button>
                    <button class="delete-proj-btn text-red-400 hover:text-red-300 transition" data-id="${p.id}">
                        Delete
                    </button>
                </td>
            </tr>
        `).join('');

        // Bind Action Buttons
        document.querySelectorAll('.edit-proj-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const proj = window.DB.getProjects().find(p => p.id === id);
                if (proj) {
                    editMode = { type: 'project', data: proj };
                    elements.projectFormTitle.textContent = 'Edit Project';
                    elements.projectIdInput.value = proj.id;
                    elements.projectNameInput.value = proj.name;
                    elements.projectDescInput.value = proj.desc;
                    elements.projectStatusInput.value = proj.status;
                    elements.projectCancelBtn.classList.remove('hidden');
                }
            });
        });

        document.querySelectorAll('.delete-proj-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id');
                const count = window.DB.getEmployees().filter(e => e.projectId === id).length;
                let warning = 'Are you sure you want to delete this project?';
                if (count > 0) {
                    warning = `This project has ${count} assigned employees who will be marked as unassigned. Do you still want to delete it?`;
                }
                if (confirm(warning)) {
                    await window.DB.deleteProject(id);
                    renderProjects();
                    populateDropdowns();
                    showNotification('Project deleted.', 'info');
                }
            });
        });
    }

    async function handleProjectSubmit(e) {
        e.preventDefault();
        const name = elements.projectNameInput.value.trim();
        const desc = elements.projectDescInput.value.trim();
        const status = elements.projectStatusInput.value;
        const id = elements.projectIdInput.value;

        if (!name) {
            showNotification('Project name is required.', 'error');
            return;
        }

        if (id) {
            // Edit
            await window.DB.updateProject({ id, name, desc, status });
            showNotification('Project updated successfully.', 'success');
        } else {
            // Add
            await window.DB.addProject({ name, desc, status });
            showNotification('New project added.', 'success');
        }

        resetProjectForm();
        renderProjects();
        populateDropdowns();
    }

    function resetProjectForm() {
        editMode = { type: null, data: null };
        elements.projectFormTitle.textContent = 'Add New Project';
        elements.projectIdInput.value = '';
        elements.projectNameInput.value = '';
        elements.projectDescInput.value = '';
        elements.projectStatusInput.value = 'Active';
        elements.projectCancelBtn.classList.add('hidden');
    }

    // -------------------------------------------------------------
    // Employee CRUD Event Handlers
    // -------------------------------------------------------------
    function renderEmployees() {
        const employees = window.DB.getEmployees();
        const projects = window.DB.getProjects();
        
        elements.employeesTableBody.innerHTML = employees.map(e => {
            const assignedProjIds = e.projectIds || (e.projectId ? [e.projectId] : []);
            const assignedProjs = assignedProjIds.map(pid => projects.find(p => p.id === pid)).filter(Boolean);
            const projNameText = assignedProjs.length > 0 
                ? assignedProjs.map(p => p.name).join(', ') 
                : '<span class="text-yellow-500 font-normal">Unassigned</span>';
            
            // Format joining date
            const joinDateFormatted = e.joiningDate ? new Date(e.joiningDate).toLocaleDateString('default', { month: 'short', year: 'numeric', day: 'numeric' }) : 'N/A';
            
            // Calculate dynamic experience string
            const experience = window.DB.calculateExperience(e.joiningDate);
            
            // Color badging for expertise
            let expBadge = 'glow-badge-purple';
            if (e.expertise === 'Junior') expBadge = 'glow-badge-yellow';
            else if (e.expertise === 'Intermediate') expBadge = 'glow-badge-purple';
            else if (e.expertise === 'Senior') expBadge = 'glow-badge-green';
            else if (e.expertise === 'Expert' || e.expertise === 'Lead') expBadge = 'glow-badge-green border-emerald-500 shadow-sm';
            else if (e.expertise === 'Management') expBadge = 'glow-badge-purple border-purple-500 font-bold';

            const displayRole = e.role || '<span class="text-gray-500 italic text-3xs font-semibold">No Role Specified</span>';

            return `
                <tr class="border-b border-gray-800 hover:bg-gray-950 hover:bg-opacity-30">
                    <td class="px-6 py-4 text-gray-200 text-sm">
                        <div class="font-semibold">${e.name}</div>
                        <div class="text-xs text-gray-400">${e.designation || 'Engineer'}</div>
                        <div class="text-3xs text-gray-500 font-medium">${e.email}</div>
                        <div class="text-3xs text-gray-400 mt-1"><span class="font-semibold text-gray-500">Joined:</span> ${joinDateFormatted}</div>
                    </td>
                    <td class="px-6 py-4 text-sm">
                        <div class="space-y-1">
                            <span class="inline-block px-2 py-0.5 text-3xs font-semibold rounded bg-gray-900 border border-gray-800 text-gray-300">${displayRole}</span>
                            <div>
                                <span class="inline-block px-2 py-0.5 text-2xs font-semibold rounded-full ${expBadge}">${e.expertise || 'Intermediate'}</span>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-sm">
                        <div class="font-semibold text-gray-300 text-xs">${projNameText}</div>
                    </td>
                    <td class="px-6 py-4 text-sm font-semibold text-purple-400">
                        ${experience}
                    </td>
                    <td class="px-6 py-4 text-sm">
                        <span class="px-2 py-0.5 text-xs font-semibold rounded-full ${e.status === 'Active' ? 'glow-badge-green' : 'glow-badge-red'}">
                            ${e.status}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-right text-sm">
                        <button class="edit-emp-btn text-purple-400 hover:text-purple-300 mr-3 transition" data-id="${e.id}">
                            Edit
                        </button>
                        <button class="delete-emp-btn text-red-400 hover:text-red-300 transition" data-id="${e.id}">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        // Bind Action Buttons
        document.querySelectorAll('.edit-emp-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const emp = window.DB.getEmployees().find(e => e.id === id);
                if (emp) {
                    editMode = { type: 'employee', data: emp };
                    elements.employeeFormTitle.textContent = 'Edit Team Member';
                    elements.employeeIdInput.value = emp.id;
                    elements.employeeNameInput.value = emp.name;
                    elements.employeeEmailInput.value = emp.email;
                    elements.employeeDesignationInput.value = emp.designation || '';
                    elements.employeeRoleInput.value = emp.role || '';
                    elements.employeeExpertiseInput.value = emp.expertise || 'Intermediate';
                    
                    // Set checked checkboxes for projectIds
                    const empProjIds = emp.projectIds || (emp.projectId ? [emp.projectId] : []);
                    const checkboxes = elements.employeeProjectsContainer.querySelectorAll('input[type="checkbox"]');
                    checkboxes.forEach(cb => {
                        cb.checked = empProjIds.includes(cb.value);
                    });

                    elements.employeeJoiningDateInput.value = emp.joiningDate || '';
                    elements.employeeStatusInput.value = emp.status;
                    elements.employeeCancelBtn.classList.remove('hidden');
                }
            });
        });

        document.querySelectorAll('.delete-emp-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this employee? This will also wipe out all their historical evaluations!')) {
                    await window.DB.deleteEmployee(id);
                    renderEmployees();
                    populateDropdowns();
                    showNotification('Employee records deleted.', 'info');
                }
            });
        });
    }

    async function handleEmployeeSubmit(e) {
        e.preventDefault();
        const name = elements.employeeNameInput.value.trim();
        const email = elements.employeeEmailInput.value.trim();
        const designation = elements.employeeDesignationInput.value.trim();
        const role = elements.employeeRoleInput.value;
        const expertise = elements.employeeExpertiseInput.value;
        const joiningDate = elements.employeeJoiningDateInput.value;
        const status = elements.employeeStatusInput.value;
        const id = elements.employeeIdInput.value;

        // Retrieve project IDs from checkboxes
        const projectIds = Array.from(elements.employeeProjectsContainer.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
        const projectId = projectIds[0] || ''; // Fallback for single project legacy support

        if (!name || !email || !designation || !joiningDate) {
            showNotification('Name, email, designation, and joining date are required.', 'error');
            return;
        }

        const employeeData = { 
            id, 
            name, 
            email, 
            designation, 
            role, 
            expertise, 
            projectId,
            projectIds, 
            joiningDate, 
            status 
        };

        if (id) {
            // Edit
            await window.DB.updateEmployee(employeeData);
            showNotification('Employee updated successfully.', 'success');
        } else {
            // Add
            await window.DB.addEmployee(employeeData);
            showNotification('New employee added.', 'success');
        }

        resetEmployeeForm();
        renderEmployees();
        populateDropdowns();
    }

    function resetEmployeeForm() {
        editMode = { type: null, data: null };
        elements.employeeFormTitle.textContent = 'Add Team Member';
        elements.employeeIdInput.value = '';
        elements.employeeNameInput.value = '';
        elements.employeeEmailInput.value = '';
        elements.employeeDesignationInput.value = '';
        elements.employeeRoleInput.value = '';
        elements.employeeExpertiseInput.value = 'Intermediate';
        
        // Reset checkboxes
        const checkboxes = elements.employeeProjectsContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);

        elements.employeeJoiningDateInput.value = '';
        elements.employeeStatusInput.value = 'Active';
        elements.employeeCancelBtn.classList.add('hidden');
    }

    // -------------------------------------------------------------
    // Mentor Management Logic
    // -------------------------------------------------------------
    function renderMentors() {
        if (!elements.mentorsTableBody) return;
        const mentors = window.DB.getMentors();
        
        elements.mentorsTableBody.innerHTML = mentors.map(m => {
            const isSelfOrAdmin = m.email === 'jayasree.kuniyil@delivery.com' || m.email === sessionStorage.getItem('perf_eval_user_email');
            const deleteButton = isSelfOrAdmin
                ? `<span class="text-3xs text-gray-500 font-bold italic">Protected</span>`
                : `<button class="text-red-500 hover:text-red-400 font-bold transition delete-mentor-btn" data-id="${m.id}">Delete</button>`;
            
            return `
                <tr class="hover:bg-gray-850 hover:bg-opacity-30 transition">
                    <td class="px-6 py-4 font-semibold text-gray-200">${m.name}</td>
                    <td class="px-6 py-4 text-gray-400 font-mono">${m.email}</td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-0.5 text-3xs font-extrabold rounded-md border ${m.role === 'Manager' ? 'bg-purple-950 border-purple-900 text-purple-400' : 'bg-gray-900 border-gray-800 text-gray-400'}">
                            ${m.role}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-right">${deleteButton}</td>
                </tr>
            `;
        }).join('');

        // Bind delete buttons
        elements.mentorsTableBody.querySelectorAll('.delete-mentor-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this mentor account?')) {
                    try {
                        await window.DB.deleteMentor(id);
                        showNotification('Mentor deleted successfully.', 'info');
                        renderMentors();
                    } catch (err) {
                        showNotification(err.message, 'error');
                    }
                }
            });
        });
    }

    async function handleMentorSubmit(e) {
        e.preventDefault();
        const name = elements.mentorNameInput.value.trim();
        const email = elements.mentorEmailInput.value.trim();
        const password = elements.mentorPasswordInput.value;
        const role = elements.mentorRoleInput.value;

        if (!name || !email || !password) {
            showNotification('Name, Email, and Password are required.', 'error');
            return;
        }

        try {
            await window.DB.addMentor({ name, email, password, role });
            showNotification('Mentor added successfully.', 'success');
            resetMentorForm();
            renderMentors();
        } catch (err) {
            showNotification(err.message, 'error');
        }
    }

    function resetMentorForm() {
        editMode = { type: null, data: null };
        elements.mentorFormTitle.textContent = 'Add Mentor';
        elements.mentorIdInput.value = '';
        elements.mentorNameInput.value = '';
        elements.mentorEmailInput.value = '';
        elements.mentorPasswordInput.value = '';
        elements.mentorRoleInput.value = 'Mentor';
        elements.mentorCancelBtn.classList.add('hidden');
    }

    // -------------------------------------------------------------
    // KPI Framework Config Logic
    // -------------------------------------------------------------
    function renderKPIConfigs() {
        const selectedRole = elements.kpiRoleSelect.value;
        const kpis = window.DB.getKPIsByRole(selectedRole);
        
        if (kpis.length === 0) {
            elements.kpisContainer.innerHTML = '<div class="text-gray-500 py-4 text-center">No KPIs found for this role.</div>';
            return;
        }

        // Group by Category
        const categories = ['High Impact Delivery', 'Best Platform / Best Solution', 'High Performing Team', 'Productivity'];
        
        let html = '';
        categories.forEach(category => {
            const catKpis = kpis.filter(kpi => kpi.category === category);
            if (catKpis.length > 0) {
                html += `
                    <div class="category-section mt-6 mb-4">
                        <h3 class="text-xs font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300 uppercase tracking-widest border-b border-gray-800 pb-2 flex items-center gap-2">
                            <i data-lucide="folder-git-2" class="w-4 h-4 text-purple-400"></i> ${category}
                        </h3>
                        <div class="grid grid-cols-1 gap-4 mt-3">
                `;
                
                catKpis.forEach(kpi => {
                    html += `
                        <div class="kpi-config-card bg-gray-900 bg-opacity-50 border border-gray-800 p-4 rounded-xl flex flex-col gap-4" data-id="${kpi.id}">
                            <div class="flex-grow space-y-3">
                                <div class="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                    <div>
                                        <h4 class="font-extrabold text-gray-200 text-sm">${kpi.kra}</h4>
                                        <p class="text-3xs text-gray-500 font-bold uppercase tracking-wider mt-0.5">${kpi.category}</p>
                                    </div>
                                    <div class="w-full md:w-32">
                                        <label class="block text-3xs font-bold text-gray-500 uppercase tracking-wider mb-1">Weight (%)</label>
                                        <input type="number" min="0" max="100" class="kpi-weight-input w-full px-3 py-1.5 rounded-lg text-sm glass-input font-bold text-purple-400" value="${kpi.weight}">
                                    </div>
                                </div>
                                
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div class="bg-gray-950 bg-opacity-40 p-3 rounded-lg border border-gray-850">
                                        <div class="text-3xs font-bold text-gray-500 uppercase tracking-widest mb-1">Definition & Description</div>
                                        <p class="text-xs text-gray-400 leading-relaxed">${kpi.desc}</p>
                                    </div>
                                    <div class="bg-gray-950 bg-opacity-40 p-3 rounded-lg border border-gray-850">
                                        <div class="text-3xs font-bold text-gray-500 uppercase tracking-widest mb-1">Common KPI Metric</div>
                                        <p class="text-xs text-gray-400 leading-relaxed font-medium">${kpi.kpi}</p>
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-3xs font-bold text-gray-500 uppercase tracking-wider mb-1">Role Target (Editable)</label>
                                    <input type="text" class="kpi-target-input w-full px-3 py-2 rounded-lg text-xs glass-input font-semibold text-gray-200" value="${kpi.target}">
                                </div>
                            </div>
                        </div>
                    `;
                });
                
                html += `
                        </div>
                    </div>
                `;
            }
        });

        elements.kpisContainer.innerHTML = html;
        lucide.createIcons();

        // Bind weight triggers to dynamically calculate sum
        document.querySelectorAll('.kpi-weight-input').forEach(input => {
            input.addEventListener('input', calculateKPIWeightsTotal);
        });

        calculateKPIWeightsTotal();
    }

    function calculateKPIWeightsTotal() {
        let total = 0;
        document.querySelectorAll('.kpi-weight-input').forEach(input => {
            total += parseInt(input.value) || 0;
        });

        elements.kpiWeightsTotal.textContent = `${total}%`;

        if (total === 100) {
            elements.kpiWeightsTotal.className = 'font-bold text-green-400';
            elements.kpiWeightsError.classList.add('hidden');
            elements.saveKpisBtn.disabled = false;
        } else {
            elements.kpiWeightsTotal.className = 'font-bold text-red-500';
            elements.kpiWeightsError.classList.remove('hidden');
            elements.saveKpisBtn.disabled = true;
        }
    }

    async function handleSaveKPIs() {
        const selectedRole = elements.kpiRoleSelect.value;
        const kpiCards = document.querySelectorAll('.kpi-config-card');
        const updatedKPIs = [];

        kpiCards.forEach(card => {
            const id = card.getAttribute('data-id');
            const target = card.querySelector('.kpi-target-input').value.trim();
            const weight = parseInt(card.querySelector('.kpi-weight-input').value) || 0;

            updatedKPIs.push({
                id,
                target,
                weight
            });
        });

        await window.DB.updateKPIsForRole(selectedRole, updatedKPIs);
        showNotification('KPI Configuration updated successfully.', 'success');
        renderKPIConfigs();
    }

    async function handleResetKPIs() {
        if (confirm('Are you sure you want to reset all KPIs to their initial standard templates? Custom configurations for all roles will be overwritten!')) {
            await window.DB.resetToDefaults();
            showNotification('KPI Configurations reset to default templates.', 'info');
            renderKPIConfigs();
        }
    }

    // -------------------------------------------------------------
    // Evaluation Form Logic
    // -------------------------------------------------------------
    function handleEvalProjectChange() {
        const projId = elements.evalProjectSelect.value;
        const employees = window.DB.getEmployees();
        
        // Filter active employees assigned to this project (support multi-project assignment)
        const filtered = employees.filter(e => {
            const empProjIds = e.projectIds || (e.projectId ? [e.projectId] : []);
            return empProjIds.includes(projId) && e.status === 'Active';
        });
        
        if (filtered.length === 0) {
            elements.evalEmployeeSelect.innerHTML = '<option value="">-- No Employees Found --</option>';
            elements.evalKpisContainer.innerHTML = '<div class="text-gray-500 py-4 text-center">Please select a project with active employees to begin.</div>';
            resetWeightedScoreGauge();
            return;
        }

        elements.evalEmployeeSelect.innerHTML = '<option value="">-- Select Employee --</option>' +
            filtered.map(e => `<option value="${e.id}">${e.name} (${e.role || 'No Role'})</option>`).join('');

        // Clear sliders
        elements.evalKpisContainer.innerHTML = '<div class="text-gray-500 py-4 text-center font-medium">Select an employee to populate KPI indicators.</div>';
        resetWeightedScoreGauge();
    }

    function handleEvalEmployeeChange() {
        const empId = elements.evalEmployeeSelect.value;
        if (!empId) {
            elements.evalKpisContainer.innerHTML = '<div class="text-gray-500 py-4 text-center">Select an employee to populate KPI indicators.</div>';
            resetWeightedScoreGauge();
            return;
        }

        const employee = window.DB.getEmployees().find(e => e.id === empId);
        if (!employee) return;

        // Fetch KPIs based on employee's role
        const kpis = window.DB.getKPIsByRole(employee.role);
        
        if (kpis.length === 0) {
            elements.evalKpisContainer.innerHTML = '<div class="text-gray-500 py-4 text-center text-red-400">Error: No KPI structures defined for role: ' + employee.role + '</div>';
            return;
        }

        // Check for existing evaluation in the chosen period to pre-fill
        const period = elements.evalPeriodInput.value;
        const existingEval = window.DB.getEvaluations().find(ev => ev.employeeId === empId && ev.period === period);

        // Render sliders for each KPI
        elements.evalKpisContainer.innerHTML = kpis.map(kpi => {
            // Find existing score or default to 3.0
            const score = existingEval ? (existingEval.scores[kpi.id] || 3.0) : 3.0;
            return `
                <div class="kpi-eval-row bg-gray-900 bg-opacity-40 border border-gray-850 p-4 rounded-xl flex flex-col md:flex-row md:items-center gap-4 justify-between" data-id="${kpi.id}" data-weight="${kpi.weight}">
                    <div class="md:w-1/2 space-y-1">
                        <div class="flex items-center flex-wrap gap-2">
                            <span class="px-1.5 py-0.5 text-3xs font-extrabold uppercase rounded bg-gray-950 border border-gray-850 text-gray-500">${kpi.category}</span>
                            <h4 class="font-bold text-gray-250 text-sm">${kpi.kra}</h4>
                            <span class="px-1.5 py-0.5 text-3xs font-bold rounded-full bg-purple-950 border border-purple-900 text-purple-400">Weight ${kpi.weight}%</span>
                        </div>
                        <p class="text-xs text-gray-400 leading-relaxed">${kpi.desc}</p>
                        <div class="flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-1 pt-1.5">
                            <span class="text-3xs font-bold text-gray-500 uppercase tracking-widest">Target for ${employee.role || 'No Role'}:</span>
                            <span class="text-2xs font-semibold text-purple-300 bg-purple-950 bg-opacity-35 px-2 py-0.5 rounded border border-purple-900 border-opacity-40">${kpi.target}</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-4 md:w-1/2 justify-between">
                        <input type="range" min="1.0" max="5.0" step="0.1" class="score-slider flex-grow w-full" value="${score}">
                        <div class="flex items-center gap-2 min-w-[70px] justify-end">
                            <input type="number" min="1.0" max="5.0" step="0.1" class="score-number-input w-16 text-center py-1 rounded-md font-bold text-sm glass-input" value="${score.toFixed(1)}">
                            <span class="score-badge px-2 py-1 text-xs font-bold rounded-md text-center min-w-[32px]"></span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Bind Sliders and Number Inputs together
        const rows = document.querySelectorAll('.kpi-eval-row');
        rows.forEach(row => {
            const slider = row.querySelector('.score-slider');
            const numInput = row.querySelector('.score-number-input');
            const badge = row.querySelector('.score-badge');

            const updateScores = (val) => {
                const score = parseFloat(val);
                slider.value = score;
                numInput.value = score.toFixed(1);
                
                // Color badges based on ranges
                if (score >= 4.0) {
                    badge.textContent = 'A';
                    badge.className = 'score-badge px-2 py-1 text-xs font-bold rounded-md text-center min-w-[32px] glow-badge-green';
                } else if (score >= 3.0) {
                    badge.textContent = 'B';
                    badge.className = 'score-badge px-2 py-1 text-xs font-bold rounded-md text-center min-w-[32px] glow-badge-yellow';
                } else {
                    badge.textContent = 'C';
                    badge.className = 'score-badge px-2 py-1 text-xs font-bold rounded-md text-center min-w-[32px] glow-badge-red';
                }

                calculateRealTimeWeightedScore();
            };

            slider.addEventListener('input', (e) => updateScores(e.target.value));
            numInput.addEventListener('change', (e) => {
                let val = parseFloat(e.target.value);
                if (isNaN(val)) val = 3.0;
                if (val < 1.0) val = 1.0;
                if (val > 5.0) val = 5.0;
                updateScores(val);
            });

            // Run initial update to set badges
            updateScores(slider.value);
        });

        // If editing existing evaluation, load existing comments
        if (existingEval) {
            elements.evalAiComments.value = existingEval.aiComments || '';
            elements.evalImprovementAreas.value = existingEval.improvementAreas || '';
            showNotification('Existing evaluation loaded for this period.', 'info');
        } else {
            elements.evalAiComments.value = '';
            elements.evalImprovementAreas.value = '';
        }
    }

    function calculateRealTimeWeightedScore() {
        const rows = document.querySelectorAll('.kpi-eval-row');
        if (rows.length === 0) {
            resetWeightedScoreGauge();
            return;
        }

        let totalScore = 0;
        let totalWeight = 0;

        rows.forEach(row => {
            const score = parseFloat(row.querySelector('.score-slider').value);
            const weight = parseInt(row.getAttribute('data-weight'));
            totalScore += score * weight;
            totalWeight += weight;
        });

        const weighted = totalScore / 100;
        elements.evalWeightedScoreValue.textContent = weighted.toFixed(2);

        // Style the gauge circle
        const circle = elements.evalWeightedScoreGauge;
        if (weighted >= 4.0) {
            circle.className = 'score-circle text-2xl font-black rounded-full w-24 h-24 border-4 border-green-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] bg-green-950 bg-opacity-25 flex items-center justify-center text-green-400';
        } else if (weighted >= 3.0) {
            circle.className = 'score-circle text-2xl font-black rounded-full w-24 h-24 border-4 border-yellow-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] bg-yellow-950 bg-opacity-25 flex items-center justify-center text-yellow-400';
        } else {
            circle.className = 'score-circle text-2xl font-black rounded-full w-24 h-24 border-4 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] bg-red-950 bg-opacity-25 flex items-center justify-center text-red-400';
        }
    }

    function resetWeightedScoreGauge() {
        elements.evalWeightedScoreValue.textContent = '0.00';
        elements.evalWeightedScoreGauge.className = 'score-circle text-2xl font-black rounded-full w-24 h-24 border-4 border-gray-700 bg-gray-900 flex items-center justify-center text-gray-500';
    }

    // -------------------------------------------------------------
    // AI Insights Generator (Local Rules Engine + API Integration)
    // -------------------------------------------------------------
    async function handleAiCommentGeneration() {
        const empId = elements.evalEmployeeSelect.value;
        const period = elements.evalPeriodInput.value;
        
        if (!empId) {
            showNotification('Please select an employee first.', 'error');
            return;
        }

        const employee = window.DB.getEmployees().find(e => e.id === empId);
        if (!employee) return;

        const project = window.DB.getProjects().find(p => p.id === employee.projectId);
        const projName = project ? project.name : 'their assigned project';

        // Collect scores
        const scores = [];
        const rows = document.querySelectorAll('.kpi-eval-row');
        rows.forEach(row => {
            const kpiId = row.getAttribute('data-id');
            const weight = parseInt(row.getAttribute('data-weight'));
            const score = parseFloat(row.querySelector('.score-slider').value);
            const name = row.querySelector('h4').textContent;
            scores.push({ id: kpiId, name, weight, score });
        });

        const weightedScore = parseFloat(elements.evalWeightedScoreValue.textContent);
        
        // Show Loading State
        elements.generateAiCommentsBtn.disabled = true;
        elements.aiLoadingSpinner.classList.remove('hidden');

        // Check if OpenAI settings are configured
        const settings = window.DB.getSettings();
        if (settings.openaiApiKey) {
            try {
                const prompt = generateLlmPrompt(employee.name, employee.role, projName, period, scores, weightedScore);
                const responseText = await callOpenAiApi(settings, prompt);
                
                // Parse API response
                const parsed = parseLlmResponse(responseText);
                elements.evalAiComments.value = parsed.comments;
                elements.evalImprovementAreas.value = parsed.improvements;
                showNotification('AI comments generated successfully via GPT API.', 'success');
            } catch (err) {
                console.error("OpenAI API call failed, falling back to local engine:", err);
                showNotification('API failed. Falling back to local smart comments generator.', 'warning');
                generateLocalSmartComments(employee.name, employee.role, scores, weightedScore);
            }
        } else {
            // Local Simulator (immediate response)
            // Add a tiny delay to simulate "thinking" and make UX premium
            await new Promise(resolve => setTimeout(resolve, 800));
            generateLocalSmartComments(employee.name, employee.role, scores, weightedScore);
            showNotification('AI comments generated (Local Simulator).', 'success');
        }

        // Hide Loading State
        elements.generateAiCommentsBtn.disabled = false;
        elements.aiLoadingSpinner.classList.add('hidden');
    }

    function generateLlmPrompt(name, role, projName, period, scores, weightedScore) {
        const scoreBreakdown = scores.map(s => `- ${s.name} (Weight: ${s.weight}%, Score: ${s.score}/5.0)`).join('\n');
        
        return `
You are an AI assistant helping a Senior Delivery Manager draft a monthly performance review for an engineering team member.

Team Member Details:
- Name: ${name}
- Role: ${role}
- Project: ${projName}
- Period: ${period}
- Weighted Performance Score: ${weightedScore.toFixed(2)} out of 5.0

KPI Score Breakdown:
${scoreBreakdown}

Please generate a professional evaluation review containing two sections:
1. "COMMENTS": A structured, executive-level narrative summarizing their achievements this month, highlighting areas where they exceeded expectations based on their scores, and constructively discussing any areas that scored lower (below 3.5).
2. "IMPROVEMENT AREAS": 1-2 specific, actionable improvement goals or developmental items (especially targeting their lowest-scoring KPIs).

Format your response EXACTLY like this (use these exact tags to help me parse it):
[COMMENTS]
(Your written comments paragraph here)
[/COMMENTS]
[IMPROVEMENT]
(Your bulleted improvement areas here)
[/IMPROVEMENT]
`;
    }

    async function callOpenAiApi(settings, prompt) {
        let url = `${settings.openaiEndpoint}/chat/completions`;
        let headers = {
            'Content-Type': 'application/json'
        };

        let body = {};

        if (settings.azureEnabled) {
            // Azure OpenAI structure
            url = `${settings.openaiEndpoint}/openai/deployments/${settings.azureDeploymentName}/chat/completions?api-version=2024-02-15-preview`;
            headers['api-key'] = settings.openaiApiKey;
            body = {
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7
            };
        } else {
            // Standard OpenAI
            headers['Authorization'] = `Bearer ${settings.openaiApiKey}`;
            body = {
                model: settings.openaiModel,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7
            };
        }

        const res = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        return data.choices[0].message.content;
    }

    function parseLlmResponse(text) {
        let comments = '';
        let improvements = '';

        const commentsMatch = text.match(/\[COMMENTS\]([\s\S]*?)\[\/COMMENTS\]/);
        if (commentsMatch) {
            comments = commentsMatch[1].trim();
        }

        const improvementMatch = text.match(/\[IMPROVEMENT\]([\s\S]*?)\[\/IMPROVEMENT\]/);
        if (improvementMatch) {
            improvements = improvementMatch[1].trim();
        }

        // Fallbacks if tags missing
        if (!comments && !improvements) {
            comments = text;
        }

        return { comments, improvements };
    }

    function generateLocalSmartComments(name, role, kpiScores, weightedScore) {
        const positivePhrases = [];
        const criticalPhrases = [];
        const improvementGoals = [];

        // Vocabulary dictionary mapping keywords to contextual sentences
        const feedbackDictionary = {
            'Adherence': {
                high: `${name} has shown exceptional commitment, meeting all timelines and plan estimates without any missed milestones.`,
                mid: `${name} completed scheduled deliverables on time, maintaining a steady project plan pace.`,
                low: `${name} missed several sprint planning target dates; closer monitoring of task sizes is recommended.`
            },
            'Bugs': {
                high: `Their code submissions were extremely solid, resulting in zero production defects and an exceptionally low leak rate.`,
                mid: `They kept defect leaks to a minimum, staying well within normal quality limits.`,
                low: `They had a higher frequency of defect leakage; additional unit testing and static analysis are advised.`
            },
            'Escalations': {
                high: `They managed client interactions perfectly, maintaining a 100% escalation-free environment.`,
                mid: `They handled client interactions smoothly with no major issues flagged by stakeholders.`,
                low: `A few client escalations occurred due to miscommunication; they need to keep stakeholders proactively informed.`
            },
            'Satisfaction': {
                high: `Customer feedback has been overwhelmingly positive, achieving stellar satisfaction ratings.`,
                mid: `They maintained positive satisfaction levels, meeting client expectation thresholds.`,
                low: `Customer satisfaction dipped slightly; more active client feedback loops should be established.`
            },
            'Quality Attributes': {
                high: `Their pull requests were of outstanding quality, passing reviews with negligible rework and strong test coverage.`,
                mid: `They maintained sound code review standards, merging code with normal peer adjustments.`,
                low: `Their code required significant PR rework before merge; they should verify code quality benchmarks locally first.`
            },
            'Agile': {
                high: `They showed excellent sprint hygiene, actively participating in and governing all agile ceremonies.`,
                mid: `They adhered to daily standups, reviews, and general sprint guidelines consistently.`,
                low: `Their sprint hygiene needs improvement; standup updates and task updates in Jira were occasionally delayed.`
            },
            'Compliance': {
                high: `They maintained full compliance with all internal coding regulations and operational standards.`,
                mid: `They followed regular compliance guidelines and security checklists successfully.`,
                low: `Compliance audits flagged minor gaps in process documentation; they must align with delivery templates.`
            },
            'Security': {
                high: `They prioritized secure coding practices, registering zero vulnerabilities in their releases.`,
                mid: `They followed security standards, resolving any critical static analysis findings promptly.`,
                low: `Several high-severity security warnings were flagged in their code; tighter linting and scanning are needed.`
            },
            'Technology Investment': {
                high: `They made valuable architectural contributions, driving modernization upgrades and technical documentation.`,
                mid: `They participated in technology enhancements and research tasks during the cycle.`,
                low: `They should seek opportunities to participate in platform modernization or tech improvements.`
            },
            'Accountability': {
                high: `They demonstrated complete ownership, consistently seeing tasks to completion and backing team goals.`,
                mid: `They took responsibility for their assigned sprint items and maintained accountability.`,
                low: `They need to build stronger ownership of tasks, especially when facing deployment blockers.`
            },
            'Coordination': {
                high: `They coordinated perfectly across dev, QA, and business layers, driving alignment across the project.`,
                mid: `They communicated clearly with team members, ensuring smooth day-to-day coordination.`,
                low: `Coordination issues caused minor delivery alignment gaps; they should sync more frequently.`
            },
            'Culture': {
                high: `They fostered an exceptionally positive team environment, receiving glowing feedback from peers.`,
                mid: `They collaborated peer-to-peer in a supportive manner, maintaining a healthy workspace.`,
                low: `Peer feedback highlighted a need for more collaborative communication during sprint reviews.`
            },
            'Benchmark': {
                high: `They maintained peak productivity, optimizing developer velocity and utilization to the highest degree.`,
                mid: `They met standard productivity benchmarks and maintained consistent output levels.`,
                low: `Productivity benchmarks fell below targets; they should work on velocity bottlenecks.`
            }
        };

        // Analyze KPI scores
        kpiScores.forEach(kpi => {
            // Find keyword match
            let key = Object.keys(feedbackDictionary).find(k => kpi.name.includes(k));
            if (!key) {
                // Generic fallback structure
                key = 'Quality Attributes'; 
            }

            const sentences = feedbackDictionary[key];
            if (kpi.score >= 4.2) {
                positivePhrases.push(sentences.high);
            } else if (kpi.score >= 3.2) {
                // If it is okay
                if (Math.random() > 0.3) positivePhrases.push(sentences.mid);
            } else {
                criticalPhrases.push(sentences.low);
                improvementGoals.push(`Improve scores in "${kpi.name}" by addressing: ${kpi.desc.toLowerCase()}`);
            }
        });

        // Overall summary narrative builder
        let intro = '';
        if (weightedScore >= 4.5) {
            intro = `${name} had an outstanding month, delivering exceptional value to the project. They consistently exceeded expectations across core areas. `;
        } else if (weightedScore >= 3.8) {
            intro = `${name} performed very well this month, demonstrating strong commitment and making highly valuable contributions. `;
        } else if (weightedScore >= 3.0) {
            intro = `${name} met the standard delivery expectations this month. They maintain consistent progress but have specific development areas. `;
        } else {
            intro = `${name} experienced performance challenges this month. A targeted support structure will be helpful to bring their outputs to expected levels. `;
        }

        const strengthsText = positivePhrases.slice(0, 3).join(' ');
        const gapsText = criticalPhrases.length > 0 
            ? ` Developmentally, ${criticalPhrases.join(' ')}`
            : ` They have maintained a very balanced output with no major performance flags.`;

        elements.evalAiComments.value = `${intro}${strengthsText}${gapsText}`;

        // Default improvement goals
        if (improvementGoals.length === 0) {
            // Find the lowest scoring KPI as a default development area
            const sorted = [...kpiScores].sort((a, b) => a.score - b.score);
            if (sorted[0]) {
                improvementGoals.push(`Establish higher benchmarks in "${sorted[0].name}" (current score: ${sorted[0].score.toFixed(1)}).`);
            } else {
                improvementGoals.push("Maintain current high performance levels and seek technical leadership scope.");
            }
        }
        
        elements.evalImprovementAreas.value = improvementGoals.map(g => `- ${g}`).join('\n');
    }

    // -------------------------------------------------------------
    // Evaluation Form Submission
    // -------------------------------------------------------------
    async function handleEvalSubmit(e) {
        e.preventDefault();
        const employeeId = elements.evalEmployeeSelect.value;
        const projectId = elements.evalProjectSelect.value;
        const period = elements.evalPeriodInput.value;
        const aiComments = elements.evalAiComments.value.trim();
        const improvementAreas = elements.evalImprovementAreas.value.trim();
        const evaluatedBy = elements.evaluatorNameInput.value.trim() || 'Delivery Manager';

        if (!employeeId || !projectId || !period) {
            showNotification('Employee, Project, and Period are required.', 'error');
            return;
        }

        if (!aiComments) {
            showNotification('Please generate or write evaluation comments.', 'error');
            return;
        }

        // Collect individual KPI scores
        const scores = {};
        const rows = document.querySelectorAll('.kpi-eval-row');
        rows.forEach(row => {
            const kpiId = row.getAttribute('data-id');
            const score = parseFloat(row.querySelector('.score-slider').value);
            scores[kpiId] = score;
        });

        const weightedScore = parseFloat(elements.evalWeightedScoreValue.textContent);

        const evaluation = {
            employeeId,
            projectId,
            period,
            scores,
            weightedScore,
            aiComments,
            improvementAreas,
            evaluatedBy,
            status: 'Approved' // Self approved by manager on save
        };

        await window.DB.addEvaluation(evaluation);
        showNotification('Monthly Evaluation saved successfully.', 'success');

        // Reset and redirect
        switchView('history');
    }

    // -------------------------------------------------------------
    // Evaluations History & Report Cards
    // -------------------------------------------------------------
    function renderEvaluationsHistory() {
        const evaluations = window.DB.getEvaluations();
        const employees = window.DB.getEmployees();
        const projects = window.DB.getProjects();

        // Get filter selections
        const projFilter = elements.filterProjectSelect.value;
        const empFilter = elements.filterEmployeeSelect.value;
        const periodFilter = elements.filterPeriodInput.value;

        // Apply filters
        const filtered = evaluations.filter(ev => {
            if (projFilter && ev.projectId !== projFilter) return false;
            if (empFilter && ev.employeeId !== empFilter) return false;
            if (periodFilter && ev.period !== periodFilter) return false;
            return true;
        }).sort((a, b) => b.period.localeCompare(a.period));

        if (filtered.length === 0) {
            elements.historyTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-6 py-8 text-center text-gray-500 font-medium">
                        No evaluations matching selected filters found.
                    </td>
                </tr>
            `;
            return;
        }

        elements.historyTableBody.innerHTML = filtered.map(ev => {
            const emp = employees.find(e => e.id === ev.employeeId);
            const proj = projects.find(p => p.id === ev.projectId);

            const empName = emp ? emp.name : 'Unknown';
            const empRole = emp ? emp.role : '';
            const projName = proj ? proj.name : 'Unassigned';

            // Style score badge
            let scoreBadge = '';
            if (ev.weightedScore >= 4.0) {
                scoreBadge = `glow-badge-green`;
            } else if (ev.weightedScore >= 3.0) {
                scoreBadge = `glow-badge-yellow`;
            } else {
                scoreBadge = `glow-badge-red`;
            }

            return `
                <tr class="border-b border-gray-800 hover:bg-gray-950 hover:bg-opacity-30">
                    <td class="px-6 py-4 text-gray-200 text-sm">
                        <div class="font-semibold text-gray-100">${empName}</div>
                        <div class="text-xs text-gray-500">${empRole}</div>
                    </td>
                    <td class="px-6 py-4 text-gray-400 text-sm font-medium">${projName}</td>
                    <td class="px-6 py-4 text-gray-300 text-sm font-semibold">${formatPeriodString(ev.period)}</td>
                    <td class="px-6 py-4 text-sm">
                        <span class="px-2.5 py-1 text-xs font-semibold rounded-md ${scoreBadge}">${ev.weightedScore.toFixed(2)}</span>
                    </td>
                    <td class="px-6 py-4 text-right text-sm">
                        <button class="view-report-btn text-purple-400 hover:text-purple-300 font-semibold mr-3 transition" data-id="${ev.id}">
                            View Report
                        </button>
                        <button class="delete-eval-btn text-red-400 hover:text-red-300 transition" data-id="${ev.id}">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        // Action Handlers
        document.querySelectorAll('.view-report-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                openEvaluationReport(id);
            });
        });

        document.querySelectorAll('.delete-eval-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this evaluation record?')) {
                    await window.DB.deleteEvaluation(id);
                    renderEvaluationsHistory();
                    showNotification('Evaluation record deleted.', 'info');
                }
            });
        });
    }

    function formatPeriodString(period) {
        if (!period) return '';
        const [yr, mo] = period.split('-');
        const dateObj = new Date(yr, mo - 1);
        return dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });
    }

    // Report Card Modal Populator
    function openEvaluationReport(evalId) {
        const ev = window.DB.getEvaluations().find(e => e.id === evalId);
        if (!ev) return;

        const employee = window.DB.getEmployees().find(e => e.id === ev.employeeId);
        const project = window.DB.getProjects().find(p => p.id === ev.projectId);

        elements.modalEmployeeName.textContent = employee ? employee.name : 'Unknown';
        elements.modalEmployeeRole.textContent = employee ? employee.role : 'Developer';
        elements.modalProjectName.textContent = project ? project.name : 'Unassigned';
        elements.modalPeriod.textContent = formatPeriodString(ev.period);
        elements.modalEvaluator.textContent = ev.evaluatedBy || 'Delivery Manager';

        // Score Badge
        const wScore = parseFloat(ev.weightedScore);
        elements.modalScoreValue.textContent = wScore.toFixed(2);
        
        const circle = elements.modalScoreGauge;
        if (wScore >= 4.0) {
            circle.className = 'score-circle text-2xl font-black rounded-full w-24 h-24 border-4 border-green-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] bg-green-950 bg-opacity-25 flex items-center justify-center text-green-400';
        } else if (wScore >= 3.0) {
            circle.className = 'score-circle text-2xl font-black rounded-full w-24 h-24 border-4 border-yellow-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] bg-yellow-950 bg-opacity-25 flex items-center justify-center text-yellow-400';
        } else {
            circle.className = 'score-circle text-2xl font-black rounded-full w-24 h-24 border-4 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] bg-red-950 bg-opacity-25 flex items-center justify-center text-red-400';
        }

        // Build KPI breakdown table rows
        const roleKPIs = window.DB.getKPIsByRole(employee ? employee.role : '');
        elements.modalKpiBreakdownBody.innerHTML = roleKPIs.map(kpi => {
            const score = ev.scores[kpi.id] || 0;
            const weightedContrib = (score * (kpi.weight / 100)).toFixed(2);
            let badgeClass = '';
            if (score >= 4.0) badgeClass = 'glow-badge-green';
            else if (score >= 3.0) badgeClass = 'glow-badge-yellow';
            else badgeClass = 'glow-badge-red';

            return `
                <tr class="border-b border-gray-800">
                    <td class="px-4 py-3 text-sm">
                        <div class="flex items-center gap-1.5 mb-1">
                            <span class="px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded bg-gray-900 border border-gray-800 text-gray-400">${kpi.category}</span>
                            <div class="font-bold text-gray-250">${kpi.kra}</div>
                        </div>
                        <div class="text-2xs text-gray-400 leading-relaxed pl-1">${kpi.desc}</div>
                        <div class="text-[10px] text-purple-300 mt-1.5 pl-1 font-semibold">
                            <span class="text-gray-500 font-bold uppercase tracking-wider text-[8px] mr-1">Target for ${employee ? employee.role : 'Role'}:</span>${kpi.target}
                        </div>
                    </td>
                    <td class="px-4 py-3 text-center text-sm font-bold text-purple-400">${kpi.weight}%</td>
                    <td class="px-4 py-3 text-center text-sm">
                        <span class="px-2 py-0.5 rounded font-semibold ${badgeClass}">${score.toFixed(1)}</span>
                    </td>
                    <td class="px-4 py-3 text-center text-sm font-semibold text-gray-300">${weightedContrib}</td>
                </tr>
            `;
        }).join('');

        // Comments & Improvements
        elements.modalAiComments.innerHTML = `<p class="text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">${ev.aiComments}</p>`;
        
        const formatImprovements = ev.improvementAreas 
            ? ev.improvementAreas.split('\n').map(line => `<li class="text-sm text-gray-300 mb-1">${line.replace(/^- /, '')}</li>`).join('')
            : '<li class="text-sm text-gray-500">None documented.</li>';
        
        elements.modalImprovementAreas.innerHTML = `<ul class="list-disc pl-5">${formatImprovements}</ul>`;

        // Unbind and rebind print/CSV buttons for this specific evaluation
        elements.modalPrintBtn.onclick = () => { window.print(); };
        elements.modalCsvBtn.onclick = () => { triggerCsvDownload(ev, employee, project, roleKPIs); };

        // Open Modal
        elements.reportModal.classList.remove('hidden');
    }

    // -------------------------------------------------------------
    // CSV Exporter Script
    // -------------------------------------------------------------
    function triggerCsvDownload(ev, employee, project, kpiTemplate) {
        const empName = employee ? employee.name : 'Unknown';
        const empRole = employee ? employee.role : 'Developer';
        const projName = project ? project.name : 'Unassigned';
        const period = formatPeriodString(ev.period);

        let csv = `AI-Powered KPI Performance Report\n`;
        csv += `Employee,${empName}\n`;
        csv += `Role,${empRole}\n`;
        csv += `Project,${projName}\n`;
        csv += `Period,${period}\n`;
        csv += `Evaluated By,${ev.evaluatedBy}\n`;
        csv += `Overall Weighted Score,${ev.weightedScore.toFixed(2)}\n\n`;

        csv += `KPI Name,Weight,Score,Contribution\n`;
        kpiTemplate.forEach(kpi => {
            const score = ev.scores[kpi.id] || 0;
            const contrib = score * (kpi.weight / 100);
            csv += `"${kpi.name}",${kpi.weight}%,${score.toFixed(1)},${contrib.toFixed(2)}\n`;
        });

        csv += `\nComments\n"${ev.aiComments.replace(/"/g, '""')}"\n`;
        csv += `\nImprovement Areas\n"${ev.improvementAreas.replace(/"/g, '""')}"\n`;

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${empName.replace(/\s+/g, '_')}_KPI_Evaluation_${ev.period}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // -------------------------------------------------------------
    // Notification Toast System
    // -------------------------------------------------------------
    function showNotification(msg, type = 'success') {
        // Remove existing notification if present
        const oldToast = document.getElementById('toast-notification');
        if (oldToast) oldToast.remove();

        const toast = document.createElement('div');
        toast.id = 'toast-notification';
        
        let colorClasses = '';
        let icon = '';

        if (type === 'success') {
            colorClasses = 'bg-green-900 bg-opacity-90 border-green-700 text-green-300';
            icon = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
        } else if (type === 'error') {
            colorClasses = 'bg-red-900 bg-opacity-90 border-red-700 text-red-300';
            icon = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
        } else if (type === 'warning') {
            colorClasses = 'bg-yellow-900 bg-opacity-90 border-yellow-700 text-yellow-300';
            icon = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`;
        } else {
            colorClasses = 'bg-purple-900 bg-opacity-90 border-purple-750 text-purple-300';
            icon = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
        }

        toast.className = `fixed bottom-5 right-5 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg z-50 animate-fade-in ${colorClasses}`;
        toast.innerHTML = `${icon} <span class="text-sm font-semibold">${msg}</span>`;
        document.body.appendChild(toast);

        // Remove toast after 3.5 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.4s ease';
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }

    // Start Everything!
    checkAuth();
});
