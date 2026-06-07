import os

os.environ.setdefault("DATABASE_URL", "sqlite:///./test_smart_interview.db")
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key")

import pytest

from app.db.session import Base, engine
from app.models import *  # noqa: F403


@pytest.fixture(autouse=True)
def reset_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
