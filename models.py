import json
from sqlalchemy import Column, String, Float, Integer, Boolean, ForeignKey, Text, TypeDecorator
from sqlalchemy.orm import relationship
from database import Base

class JSONText(TypeDecorator):
    impl = Text
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is not None:
            return json.dumps(value)
        return None

    def process_result_value(self, value, dialect):
        if value is not None:
            try:
                return json.loads(value)
            except:
                return {}
        return None

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)

    evaluations = relationship("Evaluation", back_populates="project", cascade="all, delete-orphan")

class Employee(Base):
    __tablename__ = "employees"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    role = Column(String, nullable=True)
    designation = Column(String, nullable=True)
    joining_date = Column(String, nullable=True)
    expertise = Column(String, nullable=True)
    status = Column(String, default="Active")
    project_ids = Column(JSONText, default=list)

    evaluations = relationship("Evaluation", back_populates="employee", cascade="all, delete-orphan")

class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(String, primary_key=True, index=True)
    employee_id = Column(String, ForeignKey("employees.id", ondelete="CASCADE"), nullable=False)
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    period = Column(String, nullable=False) # e.g. "2026-03"
    scores = Column(JSONText, default=dict) # e.g. {"kpi-quality": 4.5, ...}
    weighted_score = Column(Float, default=0.0)
    ai_comments = Column(Text, nullable=True)
    improvement_areas = Column(Text, nullable=True)
    status = Column(String, default="Approved")
    evaluated_by = Column(String, nullable=True)
    updated_at = Column(String, nullable=True)

    employee = relationship("Employee", back_populates="evaluations")
    project = relationship("Project", back_populates="evaluations")

class KPITarget(Base):
    __tablename__ = "kpi_targets"

    role = Column(String, primary_key=True, index=True)
    kpi_id = Column(String, primary_key=True, index=True)
    target = Column(String, nullable=True)
    weight = Column(Integer, nullable=True)

class Settings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, default=1)
    manager_name = Column(String, default="Jayasree Kuniyil")
    manager_role = Column(String, default="Senior Delivery Manager")
    openai_api_key = Column(String, default="")
    openai_endpoint = Column(String, default="https://api.openai.com/v1")
    openai_model = Column(String, default="gpt-4o")
    azure_enabled = Column(Boolean, default=False)
    azure_deployment_name = Column(String, default="")
