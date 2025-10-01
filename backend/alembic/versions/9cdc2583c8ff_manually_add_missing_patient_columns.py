"""manually_add_missing_patient_columns

Revision ID: 9cdc2583c8ff
Revises: 9c960a4e7493
Create Date: 2025-10-01 01:20:48.759335

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9cdc2583c8ff'
down_revision: Union[str, Sequence[str], None] = '9c960a4e7493'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Use raw SQL to add columns with IF NOT EXISTS to avoid duplicate column errors
    # This migration was created after columns were already added in previous migrations
    conn = op.get_bind()

    # Helper function to add column if it doesn't exist
    def add_column_if_not_exists(table_name, column_name, column_type):
        conn.execute(sa.text(f"""
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name='{table_name}' AND column_name='{column_name}'
                ) THEN
                    ALTER TABLE {table_name} ADD COLUMN {column_name} {column_type};
                END IF;
            END $$;
        """))

    # RF002 Personal Information Fields - profile completion
    add_column_if_not_exists('patients', 'biological_sex', 'VARCHAR(20)')
    add_column_if_not_exists('patients', 'gender', 'VARCHAR(20)')
    add_column_if_not_exists('patients', 'gender_other', 'VARCHAR(100)')
    add_column_if_not_exists('patients', 'birth_country', 'VARCHAR(100)')
    add_column_if_not_exists('patients', 'birth_country_other', 'VARCHAR(100)')
    add_column_if_not_exists('patients', 'birth_department', 'VARCHAR(100)')
    add_column_if_not_exists('patients', 'birth_city', 'VARCHAR(100)')
    add_column_if_not_exists('patients', 'residence_address', 'VARCHAR(500)')
    add_column_if_not_exists('patients', 'residence_country', 'VARCHAR(100)')
    add_column_if_not_exists('patients', 'residence_country_other', 'VARCHAR(100)')
    add_column_if_not_exists('patients', 'residence_department', 'VARCHAR(100)')
    add_column_if_not_exists('patients', 'residence_city', 'VARCHAR(100)')

    # RF002 Medical Information Fields
    add_column_if_not_exists('patients', 'eps', 'VARCHAR(100)')
    add_column_if_not_exists('patients', 'eps_other', 'VARCHAR(100)')
    add_column_if_not_exists('patients', 'occupation', 'VARCHAR(200)')
    add_column_if_not_exists('patients', 'additional_insurance', 'VARCHAR(200)')
    add_column_if_not_exists('patients', 'complementary_plan', 'VARCHAR(100)')
    add_column_if_not_exists('patients', 'complementary_plan_other', 'VARCHAR(100)')
    add_column_if_not_exists('patients', 'blood_type', 'VARCHAR(10)')
    add_column_if_not_exists('patients', 'emergency_contact_name', 'VARCHAR(200)')
    add_column_if_not_exists('patients', 'emergency_contact_relationship', 'VARCHAR(50)')
    add_column_if_not_exists('patients', 'emergency_contact_phone', 'VARCHAR(20)')
    add_column_if_not_exists('patients', 'emergency_contact_phone_alt', 'VARCHAR(20)')

    # RF002 Gynecological Information Fields
    add_column_if_not_exists('patients', 'is_pregnant', 'BOOLEAN')
    add_column_if_not_exists('patients', 'pregnancy_weeks', 'INTEGER')
    add_column_if_not_exists('patients', 'last_menstruation_date', 'DATE')
    add_column_if_not_exists('patients', 'pregnancies_count', 'INTEGER')
    add_column_if_not_exists('patients', 'births_count', 'INTEGER')
    add_column_if_not_exists('patients', 'cesareans_count', 'INTEGER')
    add_column_if_not_exists('patients', 'abortions_count', 'INTEGER')
    add_column_if_not_exists('patients', 'contraceptive_method', 'VARCHAR(100)')


def downgrade() -> None:
    """Downgrade schema."""
    # Remove all the columns we added
    op.drop_column('patients', 'contraceptive_method')
    op.drop_column('patients', 'abortions_count')
    op.drop_column('patients', 'cesareans_count')
    op.drop_column('patients', 'births_count')
    op.drop_column('patients', 'pregnancies_count')
    op.drop_column('patients', 'last_menstruation_date')
    op.drop_column('patients', 'pregnancy_weeks')
    op.drop_column('patients', 'is_pregnant')
    op.drop_column('patients', 'emergency_contact_phone_alt')
    op.drop_column('patients', 'emergency_contact_phone')
    op.drop_column('patients', 'emergency_contact_relationship')
    op.drop_column('patients', 'emergency_contact_name')
    op.drop_column('patients', 'blood_type')
    op.drop_column('patients', 'complementary_plan_other')
    op.drop_column('patients', 'complementary_plan')
    op.drop_column('patients', 'additional_insurance')
    op.drop_column('patients', 'occupation')
    op.drop_column('patients', 'eps_other')
    op.drop_column('patients', 'eps')
    op.drop_column('patients', 'residence_city')
    op.drop_column('patients', 'residence_department')
    op.drop_column('patients', 'residence_country_other')
    op.drop_column('patients', 'residence_country')
    op.drop_column('patients', 'residence_address')
    op.drop_column('patients', 'birth_city')
    op.drop_column('patients', 'birth_department')
    op.drop_column('patients', 'birth_country_other')
    op.drop_column('patients', 'birth_country')
    op.drop_column('patients', 'gender_other')
    op.drop_column('patients', 'gender')
    op.drop_column('patients', 'biological_sex')
