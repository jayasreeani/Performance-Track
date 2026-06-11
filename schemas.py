from pydantic import BaseModel
from typing import List, Dict, Optional

class ProjectBase(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    desc: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    class Config:
        orm_mode = True
        from_attributes = True

class EmployeeBase(BaseModel):
    id: Optional[str] = None
    name: str
    email: str
    role: Optional[str] = None
    designation: Optional[str] = None
    joining_date: Optional[str] = None
    expertise: Optional[str] = None
    status: Optional[str] = "Active"
    project_ids: Optional[List[str]] = []
    projectIds: Optional[List[str]] = []
    projectId: Optional[str] = ""

class EmployeeCreate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    class Config:
        orm_mode = True
        from_attributes = True

class EvaluationBase(BaseModel):
    id: Optional[str] = None
    employee_id: str
    project_id: str
    period: str
    scores: Dict[str, float]
    weighted_score: float
    ai_comments: Optional[str] = None
    improvement_areas: Optional[str] = None
    status: Optional[str] = "Approved"
    evaluated_by: Optional[str] = None
    updated_at: Optional[str] = None

class EvaluationCreate(EvaluationBase):
    pass

class Evaluation(EvaluationBase):
    class Config:
        orm_mode = True
        from_attributes = True

class KPITargetBase(BaseModel):
    role: str
    kpi_id: str
    target: Optional[str] = None
    weight: Optional[int] = None

class KPITargetCreate(KPITargetBase):
    pass

class KPITarget(KPITargetBase):
    class Config:
        orm_mode = True
        from_attributes = True

class SettingsBase(BaseModel):
    manager_name: Optional[str] = "Jayasree Kuniyil"
    manager_role: Optional[str] = "Senior Delivery Manager"
    openai_api_key: Optional[str] = ""
    openai_endpoint: Optional[str] = "https://api.openai.com/v1"
    openai_model: Optional[str] = "gpt-4o"
    azure_enabled: Optional[bool] = False
    azure_deployment_name: Optional[str] = ""

class SettingsCreate(SettingsBase):
    pass

class Settings(SettingsBase):
    id: int

    class Config:
        orm_mode = True
        from_attributes = True
