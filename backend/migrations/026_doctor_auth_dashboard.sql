-- Real multi-role auth + doctor dashboard support

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255),
    ADD COLUMN IF NOT EXISTS role VARCHAR(20),
    ADD COLUMN IF NOT EXISTS block_code VARCHAR(160),
    ADD COLUMN IF NOT EXISTS panchayat_code VARCHAR(200);

ALTER TABLE users
    ALTER COLUMN phone_number TYPE VARCHAR(32);

ALTER TABLE users
    ALTER COLUMN state_code TYPE VARCHAR(100);

ALTER TABLE users
    ALTER COLUMN district_code TYPE VARCHAR(120);

ALTER TABLE users
    ALTER COLUMN district_code DROP NOT NULL;

UPDATE users
SET role = COALESCE(role, 'FARMER');

ALTER TABLE users
    ALTER COLUMN role SET DEFAULT 'FARMER';

ALTER TABLE users
    ALTER COLUMN role SET NOT NULL;

ALTER TABLE users
    DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE users
    ADD CONSTRAINT users_role_check
    CHECK (role IN ('FARMER', 'DOCTOR', 'ADMIN'));

ALTER TABLE doctors
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ADD COLUMN IF NOT EXISTS district_code VARCHAR(120),
    ADD COLUMN IF NOT EXISTS district_name VARCHAR(120),
    ADD COLUMN IF NOT EXISTS block_code VARCHAR(160),
    ADD COLUMN IF NOT EXISTS block_name VARCHAR(120),
    ADD COLUMN IF NOT EXISTS panchayat_code VARCHAR(200),
    ADD COLUMN IF NOT EXISTS panchayat_name VARCHAR(120);

CREATE UNIQUE INDEX IF NOT EXISTS idx_doctors_user_id_unique
ON doctors(user_id)
WHERE user_id IS NOT NULL;

ALTER TABLE appointments
    ADD COLUMN IF NOT EXISTS farmer_images TEXT[] NOT NULL DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS visit_diagnosis TEXT,
    ADD COLUMN IF NOT EXISTS visit_treatment_plan TEXT,
    ADD COLUMN IF NOT EXISTS visit_notes TEXT,
    ADD COLUMN IF NOT EXISTS follow_up_required BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS follow_up_date TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS completion_checklist JSONB NOT NULL DEFAULT '{"pondInspected":false,"fishObserved":false,"farmerCounseled":false}'::jsonb;

ALTER TABLE appointments
    DROP CONSTRAINT IF EXISTS appointments_status_check;

ALTER TABLE appointments
    ADD CONSTRAINT appointments_status_check
    CHECK (status IN ('REQUESTED', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'));

CREATE TABLE IF NOT EXISTS appointment_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    author_name VARCHAR(120) NOT NULL,
    note_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointment_notes_appointment
ON appointment_notes(appointment_id, created_at DESC);

INSERT INTO users (
    id,
    phone_number,
    name,
    preferred_language,
    farmer_category,
    state_code,
    district_code,
    block_code,
    panchayat_code,
    password_hash,
    role
) VALUES
    ('36f0d001-94d7-44ee-9db6-100000000001', '+919431022411', 'Dr. Ananya Verma', 'en', 'GENERAL', 'BR', 'BR-PATNA', 'BR-PATNA-SADAR', 'BR-PATNA-SADAR-NAUBATPUR', '$2b$10$IHuMOtmLd.xfHd8V84ViruTL0mIOoYVDZ.5kYzYm02/2N.9Cq2EC.', 'DOCTOR'),
    ('36f0d001-94d7-44ee-9db6-100000000002', '+919431022412', 'Dr. Rakesh Kumar', 'en', 'GENERAL', 'BR', 'BR-PATNA', 'BR-PATNA-SADAR', 'BR-PATNA-SADAR-PHULWARI', '$2b$10$IHuMOtmLd.xfHd8V84ViruTL0mIOoYVDZ.5kYzYm02/2N.9Cq2EC.', 'DOCTOR'),
    ('36f0d001-94d7-44ee-9db6-100000000003', '+919431022413', 'Dr. Neha Singh', 'en', 'GENERAL', 'BR', 'BR-PATNA', 'BR-PATNA-SADAR', 'BR-PATNA-SADAR-SAMPATCHAK', '$2b$10$IHuMOtmLd.xfHd8V84ViruTL0mIOoYVDZ.5kYzYm02/2N.9Cq2EC.', 'DOCTOR'),
    ('36f0d001-94d7-44ee-9db6-100000000004', '+919431022414', 'Dr. Abhishek Sinha', 'en', 'GENERAL', 'BR', 'BR-PATNA', 'BR-PATNA-DANAPUR', 'BR-PATNA-DANAPUR-DANAPUR', '$2b$10$IHuMOtmLd.xfHd8V84ViruTL0mIOoYVDZ.5kYzYm02/2N.9Cq2EC.', 'DOCTOR'),
    ('36f0d001-94d7-44ee-9db6-100000000005', '+919431022415', 'Dr. Priyanka Jha', 'en', 'GENERAL', 'BR', 'BR-PATNA', 'BR-PATNA-PHULWARI', 'BR-PATNA-PHULWARI-PHULWARI-SHARIF', '$2b$10$IHuMOtmLd.xfHd8V84ViruTL0mIOoYVDZ.5kYzYm02/2N.9Cq2EC.', 'DOCTOR'),
    ('36f0d001-94d7-44ee-9db6-100000000006', '+919431022416', 'Dr. Manoj Tiwari', 'en', 'GENERAL', 'BR', 'BR-PATNA', 'BR-PATNA-FATUHA', 'BR-PATNA-FATUHA-FATUHA', '$2b$10$IHuMOtmLd.xfHd8V84ViruTL0mIOoYVDZ.5kYzYm02/2N.9Cq2EC.', 'DOCTOR'),
    ('36f0d001-94d7-44ee-9db6-100000000007', '+919431022417', 'Dr. Saurabh Mishra', 'en', 'GENERAL', 'BR', 'BR-PATNA', 'BR-PATNA-BARH', 'BR-PATNA-BARH-MOKAMA', '$2b$10$IHuMOtmLd.xfHd8V84ViruTL0mIOoYVDZ.5kYzYm02/2N.9Cq2EC.', 'DOCTOR'),
    ('36f0d001-94d7-44ee-9db6-100000000008', '+919431022418', 'Dr. Kavita Kumari', 'en', 'GENERAL', 'BR', 'BR-PATNA', 'BR-PATNA-BIHTA', 'BR-PATNA-BIHTA-BIHTA', '$2b$10$IHuMOtmLd.xfHd8V84ViruTL0mIOoYVDZ.5kYzYm02/2N.9Cq2EC.', 'DOCTOR'),
    ('36f0d001-94d7-44ee-9db6-100000000009', '+919431022419', 'Dr. Deepak Raj', 'en', 'GENERAL', 'BR', 'BR-PATNA', 'BR-PATNA-MOKAMA', 'BR-PATNA-MOKAMA-MOKAMA', '$2b$10$IHuMOtmLd.xfHd8V84ViruTL0mIOoYVDZ.5kYzYm02/2N.9Cq2EC.', 'DOCTOR'),
    ('36f0d001-94d7-44ee-9db6-100000000010', '+919431022420', 'Dr. Shalini Srivastava', 'en', 'GENERAL', 'BR', 'BR-PATNA', 'BR-PATNA-DANAPUR', 'BR-PATNA-DANAPUR-KHAGAUL', '$2b$10$IHuMOtmLd.xfHd8V84ViruTL0mIOoYVDZ.5kYzYm02/2N.9Cq2EC.', 'DOCTOR')
ON CONFLICT (phone_number) DO NOTHING;

INSERT INTO doctors (
    id,
    user_id,
    name,
    phone,
    district_code,
    district_name,
    block_code,
    block_name,
    panchayat_code,
    panchayat_name,
    assigned_panchayats,
    specialization,
    availability_schedule,
    is_active
) VALUES
    ('a4a6d001-94d7-44ee-9db6-200000000001', '36f0d001-94d7-44ee-9db6-100000000001', 'Dr. Ananya Verma', '+919431022411', 'BR-PATNA', 'Patna', 'BR-PATNA-SADAR', 'Patna Sadar', 'BR-PATNA-SADAR-NAUBATPUR', 'Naubatpur', ARRAY['BR-PATNA-SADAR-NAUBATPUR']::text[], ARRAY['Aquaculture Disease & Pond Health', 'Emergency Visit']::text[], '{"reminderWindowHours":[12,24,36,48]}'::jsonb, true),
    ('a4a6d001-94d7-44ee-9db6-200000000002', '36f0d001-94d7-44ee-9db6-100000000002', 'Dr. Rakesh Kumar', '+919431022412', 'BR-PATNA', 'Patna', 'BR-PATNA-SADAR', 'Patna Sadar', 'BR-PATNA-SADAR-PHULWARI', 'Phulwari', ARRAY['BR-PATNA-SADAR-PHULWARI']::text[], ARRAY['Field Diagnostics', 'Water Quality Review']::text[], '{"reminderWindowHours":[12,24,36,48]}'::jsonb, true),
    ('a4a6d001-94d7-44ee-9db6-200000000003', '36f0d001-94d7-44ee-9db6-100000000003', 'Dr. Neha Singh', '+919431022413', 'BR-PATNA', 'Patna', 'BR-PATNA-SADAR', 'Patna Sadar', 'BR-PATNA-SADAR-SAMPATCHAK', 'Sampatchak', ARRAY['BR-PATNA-SADAR-SAMPATCHAK']::text[], ARRAY['Pond Health Inspection', 'Follow-up Visits']::text[], '{"reminderWindowHours":[12,24,36,48]}'::jsonb, true),
    ('a4a6d001-94d7-44ee-9db6-200000000004', '36f0d001-94d7-44ee-9db6-100000000004', 'Dr. Abhishek Sinha', '+919431022414', 'BR-PATNA', 'Patna', 'BR-PATNA-DANAPUR', 'Danapur', 'BR-PATNA-DANAPUR-DANAPUR', 'Danapur', ARRAY['BR-PATNA-DANAPUR-DANAPUR']::text[], ARRAY['General Aquaculture Support', 'Doctor on Visit']::text[], '{"reminderWindowHours":[12,24,36,48]}'::jsonb, true),
    ('a4a6d001-94d7-44ee-9db6-200000000005', '36f0d001-94d7-44ee-9db6-100000000005', 'Dr. Priyanka Jha', '+919431022415', 'BR-PATNA', 'Patna', 'BR-PATNA-PHULWARI', 'Phulwari Sharif', 'BR-PATNA-PHULWARI-PHULWARI-SHARIF', 'Phulwari Sharif', ARRAY['BR-PATNA-PHULWARI-PHULWARI-SHARIF']::text[], ARRAY['Disease Triage', 'Farmer Counseling']::text[], '{"reminderWindowHours":[12,24,36,48]}'::jsonb, true),
    ('a4a6d001-94d7-44ee-9db6-200000000006', '36f0d001-94d7-44ee-9db6-100000000006', 'Dr. Manoj Tiwari', '+919431022416', 'BR-PATNA', 'Patna', 'BR-PATNA-FATUHA', 'Fatuha', 'BR-PATNA-FATUHA-FATUHA', 'Fatuha', ARRAY['BR-PATNA-FATUHA-FATUHA']::text[], ARRAY['Field Visit', 'Water Quality Review']::text[], '{"reminderWindowHours":[12,24,36,48]}'::jsonb, true),
    ('a4a6d001-94d7-44ee-9db6-200000000007', '36f0d001-94d7-44ee-9db6-100000000007', 'Dr. Saurabh Mishra', '+919431022417', 'BR-PATNA', 'Patna', 'BR-PATNA-BARH', 'Barh', 'BR-PATNA-BARH-MOKAMA', 'Mokama', ARRAY['BR-PATNA-BARH-MOKAMA']::text[], ARRAY['48h Response Visits', 'Repeat Case Follow-up']::text[], '{"reminderWindowHours":[12,24,36,48]}'::jsonb, true),
    ('a4a6d001-94d7-44ee-9db6-200000000008', '36f0d001-94d7-44ee-9db6-100000000008', 'Dr. Kavita Kumari', '+919431022418', 'BR-PATNA', 'Patna', 'BR-PATNA-BIHTA', 'Bihta', 'BR-PATNA-BIHTA-BIHTA', 'Bihta', ARRAY['BR-PATNA-BIHTA-BIHTA']::text[], ARRAY['Fish Health Visit', 'Pond Condition Audit']::text[], '{"reminderWindowHours":[12,24,36,48]}'::jsonb, true),
    ('a4a6d001-94d7-44ee-9db6-200000000009', '36f0d001-94d7-44ee-9db6-100000000009', 'Dr. Deepak Raj', '+919431022419', 'BR-PATNA', 'Patna', 'BR-PATNA-MOKAMA', 'Mokama', 'BR-PATNA-MOKAMA-MOKAMA', 'Mokama', ARRAY['BR-PATNA-MOKAMA-MOKAMA']::text[], ARRAY['Aqua Farm Rounds', 'Doctor Booking Coverage']::text[], '{"reminderWindowHours":[12,24,36,48]}'::jsonb, true),
    ('a4a6d001-94d7-44ee-9db6-200000000010', '36f0d001-94d7-44ee-9db6-100000000010', 'Dr. Shalini Srivastava', '+919431022420', 'BR-PATNA', 'Patna', 'BR-PATNA-DANAPUR', 'Danapur', 'BR-PATNA-DANAPUR-KHAGAUL', 'Khagaul', ARRAY['BR-PATNA-DANAPUR-KHAGAUL']::text[], ARRAY['Travel Visit Queue', 'Booking Completion']::text[], '{"reminderWindowHours":[12,24,36,48]}'::jsonb, true);
