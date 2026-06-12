import os
from typing import List, Dict, Optional
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

import models
import schemas
import auth
from database import engine, get_db, SessionLocal

app = FastAPI(title="PerfAI API Backend")

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed Data Constants
DEFAULT_PROJECTS = [
    { "id": "p1", "name": "Project Titan", "description": "Cloud migration and core platform revamp", "desc": "Cloud migration and core platform revamp" },
    { "id": "p2", "name": "Project Nebula", "description": "IoT analytics real-time dashboard", "desc": "IoT analytics real-time dashboard" },
    { "id": "p3", "name": "Project Genesis", "description": "E-commerce portal modernization and checkout upgrade", "desc": "E-commerce portal modernization and checkout upgrade" }
]

DEFAULT_EMPLOYEES = [
    { "id": "e1", "name": "Alice Smith", "email": "alice.smith@delivery.com", "role": "Senior Developer", "designation": "Senior React Architect", "joining_date": "2024-03-01", "expertise": "Senior", "status": "Active", "project_ids": ["p1"] },
    { "id": "e2", "name": "Bob Jones", "email": "bob.jones@delivery.com", "role": "Mid-Level Developer", "designation": "Full-Stack Developer", "joining_date": "2025-01-10", "expertise": "Intermediate", "status": "Active", "project_ids": ["p1"] },
    { "id": "e3", "name": "Charlie Brown", "email": "charlie.brown@delivery.com", "role": "Junior Developer", "designation": "Frontend Intern", "joining_date": "2025-11-01", "expertise": "Junior", "status": "Active", "project_ids": ["p2"] },
    { "id": "e4", "name": "Diana Prince", "email": "diana.prince@delivery.com", "role": "QA Engineer", "designation": "Lead QA Automation Engineer", "joining_date": "2024-08-15", "expertise": "Expert", "status": "Active", "project_ids": ["p1"] },
    { "id": "e5", "name": "Ethan Hunt", "email": "ethan.hunt@delivery.com", "role": "Team Lead", "designation": "Delivery Manager & Tech Lead", "joining_date": "2023-06-01", "expertise": "Lead", "status": "Active", "project_ids": ["p1"] },
    { "id": "e6", "name": "Fiona Gallagher", "email": "fiona.gallagher@delivery.com", "role": "QA Engineer", "designation": "QA Analyst", "joining_date": "2025-05-12", "expertise": "Intermediate", "status": "Active", "project_ids": ["p2"] },
    { "id": "e7", "name": "George Clark", "email": "george.clark@delivery.com", "role": "Mid-Level Developer", "designation": "Backend Java Developer", "joining_date": "2025-02-28", "expertise": "Intermediate", "status": "Active", "project_ids": ["p3"] },
    { "id": "e8", "name": "Hannah Abbott", "email": "hannah.abbott@delivery.com", "role": "Senior Developer", "designation": "Technical Architect", "joining_date": "2024-02-01", "expertise": "Senior", "status": "Active", "project_ids": ["p3"] }
]

DEFAULT_SETTINGS = {
    "manager_name": "Jayasree Kuniyil",
    "manager_role": "Senior Delivery Manager",
    "openai_api_key": "",
    "openai_endpoint": "https://api.openai.com/v1",
    "openai_model": "gpt-4o",
    "azure_enabled": False,
    "azure_deployment_name": ""
}

DEFAULT_KPIS_COMMON = [
    { "id": "kpi-adherence", "category": "High Impact Delivery", "kra": "Adherence to Effort Estimate & Project Plan", "desc": "Delivering tasks on schedule and taking ownership of commitments.", "kpi": "≥95% committed items completed on time", "weight": 10 },
    { "id": "kpi-bugs", "category": "High Impact Delivery", "kra": "Application Bugs", "desc": "Writing high quality code to minimize production issues.", "kpi": "100% months with zero critical production bugs, Defect rate ≤ 0.02", "weight": 15 },
    { "id": "kpi-escalations", "category": "High Impact Delivery", "kra": "Customer Escalations", "desc": "Resolving customer inquiries and avoiding escalations.", "kpi": "100% escalation-free sprints", "weight": 10 },
    { "id": "kpi-csat", "category": "High Impact Delivery", "kra": "Customer Satisfaction", "desc": "Ensuring client/delivery expectations are met.", "kpi": "Average customer satisfaction ≥ 4.6/5", "weight": 10 },
    { "id": "kpi-quality", "category": "High Impact Delivery", "kra": "Quality Attributes", "desc": "Maintaining high code standards and peer reviews.", "kpi": "≥97% PRs merged without major rework, Test coverage ≥80%", "weight": 10 },
    { "id": "kpi-agile", "category": "Best Platform / Best Solution", "kra": "Agile Development", "desc": "Following Scrum ceremonies and sprint hygiene.", "kpi": "Process adherence rate", "weight": 5 },
    { "id": "kpi-compliance", "category": "Best Platform / Best Solution", "kra": "Compliance", "desc": "Adhering to internal delivery standards.", "kpi": "Compliance score", "weight": 5 },
    { "id": "kpi-security", "category": "Best Platform / Best Solution", "kra": "Security", "desc": "Adhering to safety standards and code analysis.", "kpi": "Production vulnerabilities rate", "weight": 5 },
    { "id": "kpi-tech-invest", "category": "Best Platform / Best Solution", "kra": "Technology Investment", "desc": "Coding modernizations and tech contributions.", "kpi": "Contributions metric", "weight": 5 },
    { "id": "kpi-accountability", "category": "High Performing Team", "kra": "Accountability", "desc": "Taking responsibility for deliverables and goals.", "kpi": "Commitments met rate", "weight": 10 },
    { "id": "kpi-coordination", "category": "High Performing Team", "kra": "Coordination/Collaboration", "desc": "Fostering developer alignment and teamwork.", "kpi": "Meaningful contributions/month", "weight": 5 },
    { "id": "kpi-culture", "category": "High Performing Team", "kra": "Culture", "desc": "Fostering a positive team dynamic.", "kpi": "Positive feedback rate", "weight": 5 },
    { "id": "kpi-productivity", "category": "Productivity", "kra": "Benchmark", "desc": "Optimizing developer velocity and utilization.", "kpi": "Underutilized report rate", "weight": 5 }
]

DEFAULT_KPIS_TARGETS = {
    "Senior Developer": {
        "kpi-adherence": { "target": "0 missed commitments", "weight": 10 },
        "kpi-bugs": { "target": "0 bugs", "weight": 15 },
        "kpi-escalations": { "target": "0 escalations", "weight": 10 },
        "kpi-csat": { "target": "5/5", "weight": 10 },
        "kpi-quality": { "target": "0 major PR rework", "weight": 10 },
        "kpi-agile": { "target": "≥95% adherence", "weight": 5 },
        "kpi-compliance": { "target": "≥98% compliance", "weight": 5 },
        "kpi-security": { "target": "No vulnerabilities in production, ≤1 high vulnerability", "weight": 5 },
        "kpi-tech-invest": { "target": "≥1 meaningful contribution/month", "weight": 5 },
        "kpi-accountability": { "target": "≥95% commitments met", "weight": 10 },
        "kpi-coordination": { "target": "2–3 meaningful contributions/month", "weight": 5 },
        "kpi-culture": { "target": "≥95% positive feedback", "weight": 5 },
        "kpi-productivity": { "target": "0 underutilized report", "weight": 5 }
    },
    "Mid Senior Role": {
        "kpi-adherence": { "target": "≤1 missed commitment", "weight": 10 },
        "kpi-bugs": { "target": "0 critical production bugs", "weight": 15 },
        "kpi-escalations": { "target": "0 escalations", "weight": 10 },
        "kpi-csat": { "target": "≥4.8/5", "weight": 10 },
        "kpi-quality": { "target": "≤1 major PR rework", "weight": 10 },
        "kpi-agile": { "target": "≥90% adherence", "weight": 5 },
        "kpi-compliance": { "target": "≥95% compliance", "weight": 5 },
        "kpi-security": { "target": "≤2 high vulnerabilities", "weight": 5 },
        "kpi-tech-invest": { "target": "≥1 meaningful contribution/month", "weight": 5 },
        "kpi-accountability": { "target": "≥90% commitments met", "weight": 10 },
        "kpi-coordination": { "target": "1-2 meaningful contributions/month", "weight": 5 },
        "kpi-culture": { "target": "≥90% positive feedback", "weight": 5 },
        "kpi-productivity": { "target": "0 underutilized report", "weight": 5 }
    },
    "Junior Developer": {
        "kpi-adherence": { "target": "≤2 missed commitments", "weight": 10 },
        "kpi-bugs": { "target": "0 critical production bugs", "weight": 15 },
        "kpi-escalations": { "target": "≤1 escalation", "weight": 10 },
        "kpi-csat": { "target": "≥4.5/5", "weight": 10 },
        "kpi-quality": { "target": "≤2 major PR reworks", "weight": 10 },
        "kpi-agile": { "target": "≥85% adherence", "weight": 5 },
        "kpi-compliance": { "target": "≥90% compliance", "weight": 5 },
        "kpi-security": { "target": "≤3 high vulnerabilities", "weight": 5 },
        "kpi-tech-invest": { "target": "1 contribution/2 months", "weight": 5 },
        "kpi-accountability": { "target": "≥85% commitments met", "weight": 10 },
        "kpi-coordination": { "target": "1 meaningful contribution/month", "weight": 5 },
        "kpi-culture": { "target": "≥85% positive feedback", "weight": 5 },
        "kpi-productivity": { "target": "0 underutilized report", "weight": 5 }
    },
    "QA Engineer": {
        "kpi-adherence": { "target": "0 missed commitments", "weight": 10 },
        "kpi-bugs": { "target": "0 bugs", "weight": 15 },
        "kpi-escalations": { "target": "0 escalations", "weight": 10 },
        "kpi-csat": { "target": "5/5", "weight": 10 },
        "kpi-quality": { "target": "0 major bugs leaked", "weight": 10 },
        "kpi-agile": { "target": "≥95% adherence", "weight": 5 },
        "kpi-compliance": { "target": "≥98% compliance", "weight": 5 },
        "kpi-security": { "target": "0 vulnerabilities missed", "weight": 5 },
        "kpi-tech-invest": { "target": "≥1 test framework contribution/month", "weight": 5 },
        "kpi-accountability": { "target": "≥95% test commitments met", "weight": 10 },
        "kpi-coordination": { "target": "2–3 meaningful QA reviews/month", "weight": 5 },
        "kpi-culture": { "target": "≥95% positive feedback", "weight": 5 },
        "kpi-productivity": { "target": "0 underutilized reports", "weight": 5 }
    },
    "Team Lead": {
        "kpi-adherence": { "target": "0 missed team milestones", "weight": 10 },
        "kpi-bugs": { "target": "0 blocker releases", "weight": 15 },
        "kpi-escalations": { "target": "0 customer escalations", "weight": 10 },
        "kpi-csat": { "target": "5/5 team average", "weight": 10 },
        "kpi-quality": { "target": "0 unreviewed code gateways", "weight": 10 },
        "kpi-agile": { "target": "100% ceremony governance", "weight": 5 },
        "kpi-compliance": { "target": "≥98% audit compliance", "weight": 5 },
        "kpi-security": { "target": "0 production vulnerabilities", "weight": 5 },
        "kpi-tech-invest": { "target": "≥2 architecture contributions/month", "weight": 5 },
        "kpi-accountability": { "target": "≥95% team sprint velocities", "weight": 10 },
        "kpi-coordination": { "target": "Client communications managed successfully", "weight": 5 },
        "kpi-culture": { "target": "≥95% positive team feedback", "weight": 5 },
        "kpi-productivity": { "target": "0 underutilized report", "weight": 5 }
    },
    "Business Analyst": {
        "kpi-adherence": { "target": "0 missed commitments", "weight": 10 },
        "kpi-bugs": { "target": "0 defects due to requirements gaps", "weight": 15 },
        "kpi-escalations": { "target": "0 client escalations", "weight": 10 },
        "kpi-csat": { "target": "≥4.8/5 client satisfaction feedback", "weight": 10 },
        "kpi-quality": { "target": "High quality specification documents and user stories", "weight": 10 },
        "kpi-agile": { "target": "100% sprint backlog hygiene", "weight": 5 },
        "kpi-compliance": { "target": "≥98% process compliance", "weight": 5 },
        "kpi-security": { "target": "0 access policy violations", "weight": 5 },
        "kpi-tech-invest": { "target": "BA domain knowledge sharing", "weight": 5 },
        "kpi-accountability": { "target": "≥95% commitments met", "weight": 10 },
        "kpi-coordination": { "target": "Effective coordination between client and engineering", "weight": 5 },
        "kpi-culture": { "target": "≥95% positive team feedback", "weight": 5 },
        "kpi-productivity": { "target": "0 underutilized tasks", "weight": 5 }
    }
}

DEFAULT_EVALUATIONS = [
    {
        "id": "ev-1",
        "employee_id": "e1",
        "project_id": "p1",
        "period": "2026-03",
        "scores": {
            "kpi-adherence": 4.5, "kpi-bugs": 4.0, "kpi-escalations": 4.0, "kpi-csat": 4.5, "kpi-quality": 4.5,
            "kpi-agile": 4.0, "kpi-compliance": 4.5, "kpi-security": 4.5, "kpi-tech-invest": 4.0, "kpi-accountability": 4.5,
            "kpi-coordination": 4.5, "kpi-culture": 4.5, "kpi-productivity": 4.0
        },
        "weighted_score": 4.35,
        "ai_comments": "Alice performed exceptionally well in March 2026. She demonstrated outstanding code quality on the core database migration tasks. Her leadership within the Project Titan dev team helped onboard team members smoothly. To improve further, she can focus on increasing automated unit test coverage.",
        "improvement_areas": "Expand automated unit tests.",
        "status": "Approved",
        "evaluated_by": "Jayasree Kuniyil",
        "updated_at": "2026-03-28T10:00:00Z"
    },
    {
        "id": "ev-2",
        "employee_id": "e1",
        "project_id": "p1",
        "period": "2026-04",
        "scores": {
            "kpi-adherence": 4.8, "kpi-bugs": 4.5, "kpi-escalations": 4.5, "kpi-csat": 4.8, "kpi-quality": 4.8,
            "kpi-agile": 4.5, "kpi-compliance": 4.8, "kpi-security": 4.8, "kpi-tech-invest": 4.5, "kpi-accountability": 4.8,
            "kpi-coordination": 4.8, "kpi-culture": 4.8, "kpi-productivity": 4.5
        },
        "weighted_score": 4.68,
        "ai_comments": "Alice continues to lead key initiatives under Project Titan. Her architectural planning for the cloud migration was exemplary, saving the team hours of rework. She shows high autonomy, resolving complex containerization issues on her own. She is actively mentoring Bob and Charlie.",
        "improvement_areas": "Establish architectural guidelines documentation.",
        "status": "Approved",
        "evaluated_by": "Jayasree Kuniyil",
        "updated_at": "2026-04-29T11:15:00Z"
    },
    {
        "id": "ev-3",
        "employee_id": "e1",
        "project_id": "p1",
        "period": "2026-05",
        "scores": {
            "kpi-adherence": 5.0, "kpi-bugs": 4.8, "kpi-escalations": 4.8, "kpi-csat": 5.0, "kpi-quality": 5.0,
            "kpi-agile": 4.8, "kpi-compliance": 5.0, "kpi-security": 5.0, "kpi-tech-invest": 4.8, "kpi-accountability": 5.0,
            "kpi-coordination": 4.8, "kpi-culture": 5.0, "kpi-productivity": 4.8
        },
        "weighted_score": 4.91,
        "ai_comments": "Outstanding performance this month! Alice has driven the deployment of the Cloud API Gateway ahead of schedule. Her code quality was flawless. She continues to be a pillar of reliability and technical strength for the team. Highly proactive in sharing knowledge.",
        "improvement_areas": "Present a technical seminar on the new API architecture to the wider delivery group.",
        "status": "Approved",
        "evaluated_by": "Jayasree Kuniyil",
        "updated_at": "2026-05-28T09:30:00Z"
    },
    {
        "id": "ev-4",
        "employee_id": "e2",
        "project_id": "p1",
        "period": "2026-03",
        "scores": {
            "kpi-adherence": 3.5, "kpi-bugs": 3.5, "kpi-escalations": 3.0, "kpi-csat": 3.5, "kpi-quality": 3.5,
            "kpi-agile": 3.5, "kpi-compliance": 3.5, "kpi-security": 3.5, "kpi-tech-invest": 3.0, "kpi-accountability": 3.5,
            "kpi-coordination": 3.5, "kpi-culture": 3.5, "kpi-productivity": 3.0
        },
        "weighted_score": 3.40,
        "ai_comments": "Bob showed solid teamwork and willingness to learn in March. He adapted well to the new Docker environments. He completed his sprint tasks on time, though code reviews highlighted a need to pay closer attention to standard styling practices and logging guidelines.",
        "improvement_areas": "Focus on style linting and logging frameworks.",
        "status": "Approved",
        "evaluated_by": "Jayasree Kuniyil",
        "updated_at": "2026-03-28T10:30:00Z"
    },
    {
        "id": "ev-5",
        "employee_id": "e2",
        "project_id": "p1",
        "period": "2026-04",
        "scores": {
            "kpi-adherence": 3.8, "kpi-bugs": 3.8, "kpi-escalations": 3.5, "kpi-csat": 3.8, "kpi-quality": 3.8,
            "kpi-agile": 3.8, "kpi-compliance": 3.8, "kpi-security": 3.8, "kpi-tech-invest": 3.5, "kpi-accountability": 3.8,
            "kpi-coordination": 3.8, "kpi-culture": 3.8, "kpi-productivity": 3.5
        },
        "weighted_score": 3.73,
        "ai_comments": "Bob is making steady progress. He successfully delivered the Redis caching service with minimal code corrections needed. His responsiveness to peer review feedback has improved. He is encouraged to attempt solving trickier debugging tasks independently before raising blockages.",
        "improvement_areas": "Strengthen independent debugging skills.",
        "status": "Approved",
        "evaluated_by": "Jayasree Kuniyil",
        "updated_at": "2026-04-29T14:00:00Z"
    },
    {
        "id": "ev-6",
        "employee_id": "e2",
        "project_id": "p1",
        "period": "2026-05",
        "scores": {
            "kpi-adherence": 4.0, "kpi-bugs": 4.0, "kpi-escalations": 3.8, "kpi-csat": 4.0, "kpi-quality": 4.0,
            "kpi-agile": 4.0, "kpi-compliance": 4.0, "kpi-security": 4.0, "kpi-tech-invest": 3.8, "kpi-accountability": 4.0,
            "kpi-coordination": 4.0, "kpi-culture": 4.0, "kpi-productivity": 3.8
        },
        "weighted_score": 3.96,
        "ai_comments": "A very strong month for Bob. He is stepping up to take on more complex features, showing good adaptation to the backend message queue implementation. He delivered his tasks before the sprint freeze and has become more vocal in sharing constructive feedback in stand-ups.",
        "improvement_areas": "Contribute to database schema optimization tasks in the next cycle.",
        "status": "Approved",
        "evaluated_by": "Jayasree Kuniyil",
        "updated_at": "2026-05-28T14:45:00Z"
    }
]

def seed_database(db: Session):
    # 1. Seed Projects
    if db.query(models.Project).count() == 0:
        for p in DEFAULT_PROJECTS:
            proj = models.Project(id=p["id"], name=p["name"], description=p["description"])
            db.add(proj)
        db.commit()

    # 2. Seed Employees
    if db.query(models.Employee).count() == 0:
        for e in DEFAULT_EMPLOYEES:
            emp = models.Employee(
                id=e["id"],
                name=e["name"],
                email=e["email"],
                role=e["role"],
                designation=e["designation"],
                joining_date=e["joining_date"],
                expertise=e["expertise"],
                status=e["status"],
                project_ids=e["project_ids"]
            )
            db.add(emp)
        db.commit()

    # 3. Seed KPIs Targets
    if db.query(models.KPITarget).count() == 0:
        for role, targets in DEFAULT_KPIS_TARGETS.items():
            for kpi_id, config in targets.items():
                kpi_t = models.KPITarget(
                    role=role,
                    kpi_id=kpi_id,
                    target=config["target"],
                    weight=config["weight"]
                )
                db.add(kpi_t)
        db.commit()

    # 4. Seed Settings
    if db.query(models.Settings).count() == 0:
        sett = models.Settings(
            id=1,
            manager_name=DEFAULT_SETTINGS["manager_name"],
            manager_role=DEFAULT_SETTINGS["manager_role"],
            openai_api_key=DEFAULT_SETTINGS["openai_api_key"],
            openai_endpoint=DEFAULT_SETTINGS["openai_endpoint"],
            openai_model=DEFAULT_SETTINGS["openai_model"],
            azure_enabled=DEFAULT_SETTINGS["azure_enabled"],
            azure_deployment_name=DEFAULT_SETTINGS["azure_deployment_name"]
        )
        db.add(sett)
        db.commit()

    # Seed Admin User
    if db.query(models.User).filter(models.User.email == "jayasree.kuniyil@delivery.com").count() == 0:
        admin_user = models.User(
            id="u_admin",
            name="Jayasree Kuniyil",
            email="jayasree.kuniyil@delivery.com",
            password_hash=auth.hash_password("delivery123"),
            role="Manager"
        )
        db.add(admin_user)
        db.commit()

    # 5. Seed Evaluations
    if db.query(models.Evaluation).count() == 0:
        for ev in DEFAULT_EVALUATIONS:
            evaluation = models.Evaluation(
                id=ev["id"],
                employee_id=ev["employee_id"],
                project_id=ev["project_id"],
                period=ev["period"],
                scores=ev["scores"],
                weighted_score=ev["weighted_score"],
                ai_comments=ev["ai_comments"],
                improvement_areas=ev["improvement_areas"],
                status=ev["status"],
                evaluated_by=ev["evaluated_by"],
                updated_at=ev["updated_at"]
            )
            db.add(evaluation)
        db.commit()

@app.on_event("startup")
def on_startup():
    try:
        # Create DB tables on startup
        models.Base.metadata.create_all(bind=engine)
        # Run Seeding on Startup
        db = SessionLocal()
        try:
            seed_database(db)
        finally:
            db.close()
    except Exception as e:
        print(f"Database initialization or seeding error: {e}")

# -----------------------------------------------------------------------------
# API ROUTE HANDLERS
# -----------------------------------------------------------------------------

# Reset API
@app.post("/api/reset")
def reset_database(db: Session = Depends(get_db)):
    db.query(models.Evaluation).delete()
    db.query(models.Employee).delete()
    db.query(models.Project).delete()
    db.query(models.KPITarget).delete()
    db.query(models.Settings).delete()
    db.query(models.User).delete()
    db.commit()
    seed_database(db)
    return {"status": "success", "message": "Database reset to defaults successfully"}

# Projects
@app.get("/api/projects", response_model=List[schemas.Project])
def get_projects(db: Session = Depends(get_db)):
    projects = db.query(models.Project).all()
    # Add desc compatibility field dynamically
    for p in projects:
        p.desc = p.description
    return projects

@app.post("/api/projects", response_model=schemas.Project)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    # Check if project exists
    db_proj = db.query(models.Project).filter(models.Project.id == project.id).first()
    if db_proj:
        db_proj.name = project.name
        db_proj.description = project.description or project.desc
        db.commit()
        db.refresh(db_proj)
        db_proj.desc = db_proj.description
        return db_proj
    
    new_proj = models.Project(
        id=project.id,
        name=project.name,
        description=project.description or project.desc
    )
    db.add(new_proj)
    db.commit()
    db.refresh(new_proj)
    new_proj.desc = new_proj.description
    return new_proj

@app.put("/api/projects/{id}", response_model=schemas.Project)
def update_project(id: str, project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    db_proj = db.query(models.Project).filter(models.Project.id == id).first()
    if not db_proj:
        raise HTTPException(status_code=404, detail="Project not found")
    db_proj.name = project.name
    db_proj.description = project.description or project.desc
    db.commit()
    db.refresh(db_proj)
    db_proj.desc = db_proj.description
    return db_proj

@app.delete("/api/projects/{id}")
def delete_project(id: str, db: Session = Depends(get_db)):
    db_proj = db.query(models.Project).filter(models.Project.id == id).first()
    if not db_proj:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Cascade updates manually on Employee mapping lists
    employees = db.query(models.Employee).all()
    for emp in employees:
        if emp.project_ids and id in emp.project_ids:
            new_ids = [pid for pid in emp.project_ids if pid != id]
            emp.project_ids = new_ids
    
    db.delete(db_proj)
    db.commit()
    return {"status": "success", "message": f"Project {id} deleted successfully"}

# Employees
@app.get("/api/employees", response_model=List[schemas.Employee])
def get_employees(db: Session = Depends(get_db)):
    employees = db.query(models.Employee).all()
    # Add compatibility fields dynamically
    for emp in employees:
        emp.projectIds = emp.project_ids
        emp.projectId = emp.project_ids[0] if emp.project_ids else ""
    return employees

@app.post("/api/employees", response_model=schemas.Employee)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    # Check if update or create
    db_emp = db.query(models.Employee).filter(models.Employee.id == employee.id).first()
    
    pids = employee.project_ids or employee.projectIds or []
    
    if db_emp:
        db_emp.name = employee.name
        db_emp.email = employee.email
        db_emp.role = employee.role
        db_emp.designation = employee.designation
        db_emp.joining_date = employee.joining_date
        db_emp.expertise = employee.expertise
        db_emp.status = employee.status
        db_emp.project_ids = pids
        db.commit()
        db.refresh(db_emp)
        db_emp.projectIds = db_emp.project_ids
        db_emp.projectId = db_emp.project_ids[0] if db_emp.project_ids else ""
        return db_emp

    new_emp = models.Employee(
        id=employee.id,
        name=employee.name,
        email=employee.email,
        role=employee.role,
        designation=employee.designation,
        joining_date=employee.joining_date,
        expertise=employee.expertise,
        status=employee.status,
        project_ids=pids
    )
    db.add(new_emp)
    db.commit()
    db.refresh(new_emp)
    new_emp.projectIds = new_emp.project_ids
    new_emp.projectId = new_emp.project_ids[0] if new_emp.project_ids else ""
    return new_emp

@app.put("/api/employees/{id}", response_model=schemas.Employee)
def update_employee(id: str, employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    db_emp = db.query(models.Employee).filter(models.Employee.id == id).first()
    if not db_emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    pids = employee.project_ids or employee.projectIds or []
    
    db_emp.name = employee.name
    db_emp.email = employee.email
    db_emp.role = employee.role
    db_emp.designation = employee.designation
    db_emp.joining_date = employee.joining_date
    db_emp.expertise = employee.expertise
    db_emp.status = employee.status
    db_emp.project_ids = pids
    
    db.commit()
    db.refresh(db_emp)
    db_emp.projectIds = db_emp.project_ids
    db_emp.projectId = db_emp.project_ids[0] if db_emp.project_ids else ""
    return db_emp

@app.delete("/api/employees/{id}")
def delete_employee(id: str, db: Session = Depends(get_db)):
    db_emp = db.query(models.Employee).filter(models.Employee.id == id).first()
    if not db_emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Delete evaluations associated with employee
    db.query(models.Evaluation).filter(models.Evaluation.employee_id == id).delete()
    
    db.delete(db_emp)
    db.commit()
    return {"status": "success", "message": f"Employee {id} deleted successfully"}

# Evaluations
@app.get("/api/evaluations", response_model=List[schemas.Evaluation])
def get_evaluations(db: Session = Depends(get_db)):
    evals = db.query(models.Evaluation).all()
    return evals

@app.post("/api/evaluations", response_model=schemas.Evaluation)
def create_evaluation(evaluation: schemas.EvaluationCreate, db: Session = Depends(get_db)):
    import datetime
    
    # Check if evaluation already exists for this employee and period
    db_eval = db.query(models.Evaluation).filter(
        models.Evaluation.employee_id == evaluation.employee_id,
        models.Evaluation.period == evaluation.period
    ).first()
    
    now_str = datetime.datetime.now().isoformat() + "Z"
    
    if db_eval:
        db_eval.project_id = evaluation.project_id
        db_eval.scores = evaluation.scores
        db_eval.weighted_score = evaluation.weighted_score
        db_eval.ai_comments = evaluation.ai_comments
        db_eval.improvement_areas = evaluation.improvement_areas
        db_eval.status = evaluation.status or "Approved"
        db_eval.evaluated_by = evaluation.evaluated_by
        db_eval.updated_at = now_str
        db.commit()
        db.refresh(db_eval)
        return db_eval
        
    eval_id = evaluation.id or f"ev_{int(datetime.datetime.now().timestamp() * 1000)}"
    new_eval = models.Evaluation(
        id=eval_id,
        employee_id=evaluation.employee_id,
        project_id=evaluation.project_id,
        period=evaluation.period,
        scores=evaluation.scores,
        weighted_score=evaluation.weighted_score,
        ai_comments=evaluation.ai_comments,
        improvement_areas=evaluation.improvement_areas,
        status=evaluation.status or "Approved",
        evaluated_by=evaluation.evaluated_by,
        updated_at=now_str
    )
    db.add(new_eval)
    db.commit()
    db.refresh(new_eval)
    return new_eval

@app.delete("/api/evaluations/{id}")
def delete_evaluation(id: str, db: Session = Depends(get_db)):
    db_eval = db.query(models.Evaluation).filter(models.Evaluation.id == id).first()
    if not db_eval:
        raise HTTPException(status_code=404, detail="Evaluation record not found")
    db.delete(db_eval)
    db.commit()
    return {"status": "success", "message": f"Evaluation {id} deleted successfully"}

# Settings
@app.get("/api/settings", response_model=schemas.Settings)
def get_settings(db: Session = Depends(get_db)):
    sett = db.query(models.Settings).filter(models.Settings.id == 1).first()
    if not sett:
        sett = models.Settings(id=1)
        db.add(sett)
        db.commit()
        db.refresh(sett)
    return sett

@app.post("/api/settings", response_model=schemas.Settings)
def save_settings(settings: schemas.SettingsCreate, db: Session = Depends(get_db)):
    sett = db.query(models.Settings).filter(models.Settings.id == 1).first()
    if not sett:
        sett = models.Settings(id=1)
        db.add(sett)
    
    sett.manager_name = settings.manager_name
    sett.manager_role = settings.manager_role
    sett.openai_api_key = settings.openai_api_key
    sett.openai_endpoint = settings.openai_endpoint
    sett.openai_model = settings.openai_model
    sett.azure_enabled = settings.azure_enabled
    sett.azure_deployment_name = settings.azure_deployment_name
    
    db.commit()
    db.refresh(sett)
    return sett

# KPIs settings
@app.get("/api/kpis")
def get_kpis(db: Session = Depends(get_db)):
    # Return structure matching DEFAULT_KPIS
    # Query targets from DB
    db_targets = db.query(models.KPITarget).all()
    targets_map = {}
    for t in db_targets:
        if t.role not in targets_map:
            targets_map[t.role] = {}
        targets_map[t.role][t.kpi_id] = {
            "target": t.target,
            "weight": t.weight
        }
        
    # Merge BA if missing
    for r in DEFAULT_KPIS_TARGETS.keys():
        if r not in targets_map:
            targets_map[r] = DEFAULT_KPIS_TARGETS[r]
            
    return {
        "common": DEFAULT_KPIS_COMMON,
        "targets": targets_map
    }

@app.get("/api/kpis/{role}")
def get_kpis_by_role(role: str, db: Session = Depends(get_db)):
    db_targets = db.query(models.KPITarget).filter(models.KPITarget.role == role).all()
    role_targets = {t.kpi_id: {"target": t.target, "weight": t.weight} for t in db_targets}
    
    # Fallback to standard seeds if none in DB
    if not role_targets and role in DEFAULT_KPIS_TARGETS:
        role_targets = DEFAULT_KPIS_TARGETS[role]
        
    merged = []
    for kpi in DEFAULT_KPIS_COMMON:
        weight = kpi["weight"]
        target = kpi["kpi"]
        
        config = role_targets.get(kpi["id"])
        if config:
            if config.get("weight") is not None:
                weight = config["weight"]
            if config.get("target") is not None:
                target = config["target"]
                
        merged.append({
            "id": kpi["id"],
            "category": kpi["category"],
            "kra": kpi["kra"],
            "name": kpi["kra"],
            "desc": kpi["desc"],
            "kpi": kpi["kpi"],
            "weight": weight,
            "target": target
        })
    return merged

@app.post("/api/kpis/{role}")
def update_kpis_for_role(role: str, kpis: List[Dict], db: Session = Depends(get_db)):
    # Delete current targets for role
    db.query(models.KPITarget).filter(models.KPITarget.role == role).delete()
    
    for k in kpis:
        target = models.KPITarget(
            role=role,
            kpi_id=k["id"],
            target=k["target"],
            weight=int(k["weight"])
        )
        db.add(target)
    db.commit()
    return {"status": "success", "message": f"KPI targets updated for role {role}"}

# Authentication and Mentor Management
@app.post("/api/auth/login", response_model=schemas.UserResponse)
def login_user(login_data: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == login_data.email).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not auth.verify_password(login_data.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    return db_user

@app.get("/api/users", response_model=List[schemas.UserResponse])
def get_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return users

@app.post("/api/users", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists")
        
    import time
    user_id = user.id or f"u_{int(time.time() * 1000)}"
    
    new_user = models.User(
        id=user_id,
        name=user.name,
        email=user.email,
        password_hash=auth.hash_password(user.password),
        role=user.role or "Mentor"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.delete("/api/users/{id}")
def delete_user(id: str, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if db_user.email == "jayasree.kuniyil@delivery.com":
        raise HTTPException(status_code=400, detail="Cannot delete the primary administrator")
        
    db.delete(db_user)
    db.commit()
    return {"status": "success", "message": f"User {id} deleted successfully"}

# Serving static assets for deployment
@app.get("/")
def serve_index():
    return FileResponse("index.html")

@app.get("/styles.css")
def serve_styles():
    return FileResponse("styles.css")

@app.get("/db.js")
def serve_db_js():
    return FileResponse("db.js")

@app.get("/app.js")
def serve_app_js():
    return FileResponse("app.js")

