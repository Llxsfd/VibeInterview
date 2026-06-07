from celery import Celery

celery_app = Celery("smart_interview_platform", broker="redis://redis:6379/0", backend="redis://redis:6379/1")


@celery_app.task(name="healthcheck")
def healthcheck() -> str:
    return "ok"
