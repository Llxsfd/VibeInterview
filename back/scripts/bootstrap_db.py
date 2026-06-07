from __future__ import annotations

import argparse
import sys
from pathlib import Path
from urllib.parse import urlparse

sys.path.append(str(Path(__file__).resolve().parents[1]))

from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError, ProgrammingError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import hash_password
from app.db.session import Base, engine
from app.models import User, UserProfile


def database_name(database_url: str) -> str:
    parsed = urlparse(database_url)
    return parsed.path.lstrip("/")


def create_database_if_missing() -> None:
    target_db = database_name(settings.DATABASE_URL)
    admin_engine = create_engine(settings.POSTGRES_ADMIN_URL, isolation_level="AUTOCOMMIT")
    with admin_engine.connect() as connection:
        exists = connection.execute(
            text("SELECT 1 FROM pg_database WHERE datname = :name"),
            {"name": target_db},
        ).scalar()
        if not exists:
            connection.execute(text(f'CREATE DATABASE "{target_db}"'))


def enable_pgvector_if_available() -> bool:
    try:
        with engine.begin() as connection:
            connection.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        return True
    except (OperationalError, ProgrammingError):
        return False


def seed_mock_user() -> None:
    with Session(engine) as session:
        existing = session.query(User).filter(User.email == "demo@example.com").first()
        if existing:
            return
        user = User(
            username="demo",
            email="demo@example.com",
            password_hash=hash_password("DemoPass123"),
        )
        user.profile = UserProfile(
            target_role="Java 后端",
            target_level="中等",
            preparation_days=14,
            current_level="复习",
            progress={"documents": 1, "questions": 6, "interviews": 1},
            mastery_summary={"操作系统": 0.72, "计算机网络": 0.64, "数据库": 0.58},
        )
        session.add(user)
        session.commit()


def bootstrap(skip_create_database: bool = False) -> dict:
    if not settings.DATABASE_URL.startswith("postgresql"):
        Base.metadata.create_all(bind=engine)
        seed_mock_user()
        return {"database": "sqlite", "created": True, "pgvector": False, "seeded": True}

    if not skip_create_database:
        create_database_if_missing()

    pgvector_enabled = enable_pgvector_if_available()
    Base.metadata.create_all(bind=engine)
    seed_mock_user()
    return {
        "database": database_name(settings.DATABASE_URL),
        "created": True,
        "pgvector": pgvector_enabled,
        "seeded": True,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Bootstrap Smart Interview Platform database")
    parser.add_argument("--skip-create-database", action="store_true")
    args = parser.parse_args()
    result = bootstrap(skip_create_database=args.skip_create_database)
    print(result)


if __name__ == "__main__":
    main()
