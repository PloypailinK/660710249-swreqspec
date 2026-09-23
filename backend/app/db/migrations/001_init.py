# รองรับ: CON-TECH-01, DOM-PDPA-01, IF-HIS-01
from sqlalchemy.engine import Engine

from app.db.models import Base


def upgrade(engine: Engine):
    Base.metadata.create_all(bind=engine)


def downgrade(engine: Engine):
    Base.metadata.drop_all(bind=engine)
