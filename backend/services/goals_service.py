import uuid
from typing import List, Optional
from backend.database import get_connection
from backend.models import GoalModel, GoalCreate, GoalUpdate

def get_user_goals(user_id: str = "demo-user-001") -> List[GoalModel]:
    conn = get_connection()
    cursor = conn.cursor()
    rows = cursor.execute("""
    SELECT id, user_id, title, category, target_amount, current_amount, time_period, icon, created_at
    FROM goals
    WHERE user_id = ?
    ORDER BY created_at ASC
    """, (user_id,)).fetchall()
    conn.close()

    goals = []
    for r in rows:
        target = float(r["target_amount"])
        current = float(r["current_amount"])
        progress = round((current / target * 100) if target > 0 else 0.0, 1)
        goals.append(GoalModel(
            id=r["id"],
            user_id=r["user_id"],
            title=r["title"],
            category=r["category"],
            target_amount=target,
            current_amount=current,
            progress_percent=min(progress, 100.0),
            time_period=r["time_period"],
            icon=r["icon"] or "target",
            created_at=r["created_at"]
        ))
    return goals

def create_goal(goal: GoalCreate, user_id: str = "demo-user-001") -> GoalModel:
    conn = get_connection()
    cursor = conn.cursor()
    goal_id = f"G_{uuid.uuid4().hex[:6].upper()}"
    cursor.execute("""
    INSERT INTO goals (id, user_id, title, category, target_amount, current_amount, time_period, icon)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (goal_id, user_id, goal.title, goal.category, goal.target_amount, goal.current_amount, goal.time_period, goal.icon or "target"))
    conn.commit()
    conn.close()

    progress = round((goal.current_amount / goal.target_amount * 100) if goal.target_amount > 0 else 0.0, 1)
    return GoalModel(
        id=goal_id,
        user_id=user_id,
        title=goal.title,
        category=goal.category,
        target_amount=goal.target_amount,
        current_amount=goal.current_amount,
        progress_percent=min(progress, 100.0),
        time_period=goal.time_period,
        icon=goal.icon or "target"
    )

def update_goal(goal_id: str, updates: GoalUpdate, user_id: str = "demo-user-001") -> Optional[GoalModel]:
    conn = get_connection()
    cursor = conn.cursor()

    row = cursor.execute("SELECT * FROM goals WHERE id = ? AND user_id = ?", (goal_id, user_id)).fetchone()
    if not row:
        conn.close()
        return None

    title = updates.title if updates.title is not None else row["title"]
    target = updates.target_amount if updates.target_amount is not None else float(row["target_amount"])
    current = updates.current_amount if updates.current_amount is not None else float(row["current_amount"])
    time_period = updates.time_period if updates.time_period is not None else row["time_period"]

    cursor.execute("""
    UPDATE goals 
    SET title = ?, target_amount = ?, current_amount = ?, time_period = ?
    WHERE id = ? AND user_id = ?
    """, (title, target, current, time_period, goal_id, user_id))
    conn.commit()
    conn.close()

    progress = round((current / target * 100) if target > 0 else 0.0, 1)
    return GoalModel(
        id=goal_id,
        user_id=user_id,
        title=title,
        category=row["category"],
        target_amount=target,
        current_amount=current,
        progress_percent=min(progress, 100.0),
        time_period=time_period,
        icon=row["icon"]
    )

def delete_goal(goal_id: str, user_id: str = "demo-user-001") -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM goals WHERE id = ? AND user_id = ?", (goal_id, user_id))
    affected = cursor.rowcount
    conn.commit()
    conn.close()
    return affected > 0
