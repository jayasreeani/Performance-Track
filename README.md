# AI-Powered Team Performance Evaluation & KPI Management Platform

This is a premium Single-Page Application (SPA) designed to automate, standardize, and streamline monthly employee evaluations. It is tailored for Delivery Managers overseeing multiple client delivery teams.

## Tech Stack Overview

- **Core:** HTML5, CSS3, ES6+ JavaScript.
- **Styling:** Custom CSS + Tailwind CSS (via CDN) with a sleek dark-mode slate/violet color palette.
- **Visualizations:** Chart.js (via CDN) for historical score line graphs and project averages.
- **Icons:** Lucide Icons (via CDN).
- **Database/Persistence:** Browser-local `localStorage` wrapper featuring seed data to make the app instantly usable.
- **AI Narrative Generation:** Integrated local rule-based AI prompt simulator for immediate professional reviews, with a settings panel to optionally plug in a live OpenAI or Azure OpenAI API key.
- **Reports:** Custom print-media stylesheets for clean PDF generation and native client-side CSV downloads.

---

## Features

1. **Dashboard Analytics:**
   - Visual charts showing overall historical score trends (over month periods) and project average breakdowns.
   - High-level metric cards showing active staff counts, project totals, and overall average scores.
   - High performers and developing performers quick-lists.

2. **Project Portfolio Manager:**
   - CRUD management panel to register, edit, or archive client delivery projects.

3. **Team Directory (Employees):**
   - Register staff members, assign functional roles, and map them to active projects.

4. **KPI Framework Configurator:**
   - Set custom, role-specific KPI titles, descriptions, and weights.
   - Enforces a validation system where the sum of weights for any role must equal exactly 100%.

5. **Perform Evaluations:**
   - Filter-driven evaluation interface: selecting a project restricts employee selection to that project.
   - Live KPI weight indicators and sliding score bars.
   - Real-time weighted average calculation with colored threshold rings.
   - **Compile Insights:** AI button generating customized professional reviews and goal benchmarks based on individual KPI scoring inputs.

6. **History & Report Cards:**
   - Filterable table logs of previous evaluations.
   - Elegant "Performance Review Card" popups with detailed score matrices, comments, and actionable development milestones.
   - **Print / PDF:** Activates clean, styled paper reports.
   - **Export CSV:** Downloads Excel-compliant data sheets.

---

## How to Run Locally

Since this is a lightweight static client-side application, it can be launched instantly with no installation footprint.

### Step 1: Open PowerShell or Command Prompt
Open your terminal and check that you are in the project root directory:
```powershell
cd c:\Users\JayasreeK\Projects
```

### Step 2: Start the Python Web Server
Run the built-in Python HTTP server module (Python 3 is required and is already installed on this system):
```powershell
python -m http.server 8000
```

### Step 3: Access the Application
Open your web browser of choice (Chrome, Edge, Firefox) and navigate to:
```
http://localhost:8000
```
*(You can also use any port other than 8000 if needed).*
