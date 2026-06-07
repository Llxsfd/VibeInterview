from sqlalchemy.exc import NotSupportedError

from scripts import bootstrap_db


class _UnavailableVectorConnection:
    def execute(self, statement):
        raise NotSupportedError(str(statement), None, RuntimeError("vector is not installed"))


class _UnavailableVectorBegin:
    def __enter__(self):
        return _UnavailableVectorConnection()

    def __exit__(self, exc_type, exc, traceback):
        return False


class _UnavailableVectorEngine:
    def begin(self):
        return _UnavailableVectorBegin()


def test_enable_pgvector_returns_false_when_extension_is_not_installed(monkeypatch):
    monkeypatch.setattr(bootstrap_db, "engine", _UnavailableVectorEngine())

    assert bootstrap_db.enable_pgvector_if_available() is False
