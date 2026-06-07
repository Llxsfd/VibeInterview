from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm.attributes import flag_modified
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db import get_db
from app.models import KnowledgePoint, StudyPlan, User
from app.schemas import StudyPlanGenerateRequest

router = APIRouter(prefix="/study-plans", tags=["study-plans"])


def plan_dict(plan: StudyPlan) -> dict:
    return {
        "id": plan.id,
        "title": plan.title,
        "plan_days": plan.plan_days,
        "plan_content": plan.plan_content,
        "status": plan.status,
    }


@router.post("/generate", status_code=201)
def generate_plan(payload: StudyPlanGenerateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    points = list(db.scalars(select(KnowledgePoint).where(KnowledgePoint.user_id == current_user.id).limit(5)))
    names = [point.name for point in points] or ["资料复盘", "错题回顾", "模拟面试"]
    days = []
    for day in range(1, payload.plan_days + 1):
        topic = names[(day - 1) % len(names)]
        days.append(
            {
                "day": day,
                "tasks": [
                    {"id": f"d{day}-review", "type": "review", "title": f"复习 {topic}", "done": False},
                    {"id": f"d{day}-practice", "type": "practice", "title": "完成 3 道练习题", "done": False},
                    {"id": f"d{day}-interview", "type": "interview", "title": "进行 1 轮模拟面试", "done": False},
                ],
            }
        )
    plan = StudyPlan(
        user_id=current_user.id,
        title=f"{payload.plan_days} 天智能复习计划",
        plan_days=payload.plan_days,
        plan_content={"days": days},
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan_dict(plan)


@router.get("")
def list_plans(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    plans = db.scalars(select(StudyPlan).where(StudyPlan.user_id == current_user.id))
    return [plan_dict(plan) for plan in plans]


@router.get("/{plan_id}")
def read_plan(plan_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    plan = db.scalar(select(StudyPlan).where(StudyPlan.id == plan_id, StudyPlan.user_id == current_user.id))
    if not plan:
        raise HTTPException(status_code=404, detail="Study plan not found")
    return plan_dict(plan)


@router.put("/{plan_id}/tasks/{task_id}")
def complete_task(plan_id: str, task_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    plan = db.scalar(select(StudyPlan).where(StudyPlan.id == plan_id, StudyPlan.user_id == current_user.id))
    if not plan:
        raise HTTPException(status_code=404, detail="Study plan not found")
    content = dict(plan.plan_content)
    found = False
    for day in content.get("days", []):
        for task in day.get("tasks", []):
            if task.get("id") == task_id:
                task["done"] = True
                found = True
    if not found:
        raise HTTPException(status_code=404, detail="Task not found")
    plan.plan_content = content
    flag_modified(plan, "plan_content")
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan_dict(plan)
