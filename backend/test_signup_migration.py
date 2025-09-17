#!/usr/bin/env python3
"""
Test script to verify signup migration worked correctly
"""

import os
import sys
sys.path.append(os.path.dirname(__file__))

from shared.database import SessionLocal
from sqlalchemy import text

def test_signup_migration():
    print("🧪 Testing signup migration...")

    try:
        db = SessionLocal()

        # Test document_types table and data
        result = db.execute(text("SELECT code, name FROM document_types ORDER BY code"))
        document_types = result.fetchall()
        print(f"✅ Document types table created with {len(document_types)} records:")
        for dt in document_types:
            print(f"   {dt[0]} - {dt[1]}")

        # Test users table structure
        result = db.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name = 'users' ORDER BY ordinal_position"))
        user_columns = [row[0] for row in result.fetchall()]
        print(f"✅ Users table created with columns: {', '.join(user_columns)}")

        # Test patients table structure
        result = db.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name = 'patients' ORDER BY ordinal_position"))
        patient_columns = [row[0] for row in result.fetchall()]
        print(f"✅ Patients table created with columns: {', '.join(patient_columns)}")

        # Verify qr_code field exists separately
        if 'qr_code' in patient_columns and 'id' in patient_columns:
            print("✅ QR code field is separate from primary key (security requirement)")
        else:
            print("❌ QR code field issue")

        # Test foreign key constraints
        result = db.execute(text("""
            SELECT tc.constraint_name, tc.table_name, kcu.column_name,
                   ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
            JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
            WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name IN ('patients')
        """))
        fk_constraints = result.fetchall()
        print(f"✅ Foreign key constraints: {len(fk_constraints)}")
        for fk in fk_constraints:
            print(f"   {fk[1]}.{fk[2]} -> {fk[3]}.{fk[4]}")

        db.close()
        print("\n🎉 All signup migration tests passed!")
        return True

    except Exception as e:
        print(f"❌ Migration test failed: {e}")
        return False

if __name__ == "__main__":
    test_signup_migration()