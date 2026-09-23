import importlib.util
from pathlib import Path

from sqlalchemy import create_engine, inspect

from app.config import DATABASE_URL


def _load_migration_module():
    migration_path = (
        Path(__file__).resolve().parents[1]
        / "app"
        / "db"
        / "migrations"
        / "001_init.py"
    )
    spec = importlib.util.spec_from_file_location("booking_migration", migration_path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


def test_database_schema_and_postgres_configuration_are_ready():
    assert DATABASE_URL.startswith("postgresql")

    engine = create_engine("sqlite:///:memory:")
    migration_module = _load_migration_module()
    migration_module.upgrade(engine)

    inspector = inspect(engine)
    tables = set(inspector.get_table_names())

    assert {"slots", "bookings", "audit_logs"}.issubset(tables)
