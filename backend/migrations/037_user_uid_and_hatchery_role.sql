-- ============================================================================
-- Migration 037: User UID and Hatchery Role
--
-- Alters role constraints to accept 'HATCHERY' as a user role, adds unique 
-- alphanumeric UIDs for all users (Farmers, Doctors, Hatcheries), and 
-- configures automatic UID generation on inserts.
-- ============================================================================

-- 1. Helper function for unique user ID generation
CREATE OR REPLACE FUNCTION generate_user_uid(user_role TEXT, dist_code TEXT)
RETURNS VARCHAR AS $$
DECLARE
    prefix VARCHAR(2);
    clean_dist VARCHAR; -- Changed from VARCHAR(3) to avoid assignment length checks
    random_num VARCHAR(4);
    final_uid VARCHAR(32);
    is_unique BOOLEAN := FALSE;
BEGIN
    -- Determine role prefix
    IF user_role = 'FARMER' THEN
        prefix := 'FM';
    ELSIF user_role = 'HATCHERY' THEN
        prefix := 'HC';
    ELSIF user_role = 'DOCTOR' THEN
        prefix := 'DR';
    ELSE
        prefix := 'AD';
    END IF;

    -- Extract district code segment (e.g. BR-PATNA -> PAT)
    IF dist_code IS NULL OR length(dist_code) < 3 THEN
        clean_dist := 'GEN';
    ELSE
        -- Remove state prefix (e.g. BR-)
        clean_dist := regexp_replace(UPPER(dist_code), '^BR-', '');
        clean_dist := SUBSTRING(clean_dist FROM 1 FOR 3);
        IF length(clean_dist) < 3 THEN
            clean_dist := 'GEN';
        END IF;
    END IF;

    -- Loop to ensure uniqueness
    WHILE NOT is_unique LOOP
        random_num := LPAD(floor(random() * 9000 + 1000)::TEXT, 4, '0');
        final_uid := prefix || '-' || clean_dist || '-' || random_num;
        
        -- Check if it already exists
        PERFORM 1 FROM users WHERE uid = final_uid;
        IF NOT FOUND THEN
            is_unique := TRUE;
        END IF;
    END LOOP;

    RETURN final_uid;
END;
$$ LANGUAGE plpgsql;

-- 2. Update role constraint to include 'HATCHERY'
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('FARMER', 'DOCTOR', 'ADMIN', 'HATCHERY'));

-- 3. Add uid columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS uid VARCHAR(32) UNIQUE;
ALTER TABLE fingerling_sales ADD COLUMN IF NOT EXISTS buyer_uid VARCHAR(32);

-- 4. Generate UIDs for existing users
UPDATE users SET uid = generate_user_uid(role, district_code) WHERE uid IS NULL;

-- 5. Create BEFORE INSERT trigger to auto-assign UID for new users
CREATE OR REPLACE FUNCTION trg_assign_user_uid()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.uid IS NOT NULL THEN
        RETURN NEW;
    END IF;
    NEW.uid := generate_user_uid(NEW.role, NEW.district_code);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_before_insert ON users;

CREATE TRIGGER trg_users_before_insert
    BEFORE INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION trg_assign_user_uid();
