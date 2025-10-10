-- PeerHive SQL schema (PostgreSQL style)
tema TEXT,
plazo VARCHAR(16), -- e.g. 'hoy','3d','1w'
status VARCHAR(24) DEFAULT 'open',
assigned_advisor_id UUID REFERENCES users(id),
created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);


CREATE TABLE sessions (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
request_id UUID REFERENCES requests(id) ON DELETE SET NULL,
requester_id UUID REFERENCES users(id),
advisor_id UUID REFERENCES users(id),
scheduled_start TIMESTAMP WITH TIME ZONE,
scheduled_duration_minutes INT,
start_time TIMESTAMP WITH TIME ZONE,
end_time TIMESTAMP WITH TIME ZONE,
duration_minutes INT,
status VARCHAR(24) DEFAULT 'scheduled', -- scheduled|in_progress|completed|cancelled
confirmed_by_requester BOOLEAN DEFAULT FALSE,
confirmed_by_advisor BOOLEAN DEFAULT FALSE,
counted_for_credits BOOLEAN DEFAULT FALSE,
created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);


-- Audit/log entries (immutable append-only)
CREATE TABLE audit_logs (
id BIGSERIAL PRIMARY KEY,
event_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
actor_id UUID,
event_type TEXT NOT NULL,
details JSONB
);


-- Files table for attachments (store reference to object storage)
CREATE TABLE files (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
uploader_id UUID REFERENCES users(id),
session_id UUID REFERENCES sessions(id),
filename TEXT,
size_bytes BIGINT,
storage_key TEXT,
created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);


-- Notifications (in-platform)
CREATE TABLE notifications (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID REFERENCES users(id) ON DELETE CASCADE,
payload JSONB,
read BOOLEAN DEFAULT FALSE,
created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);


-- Indexes and constraints
CREATE INDEX idx_sessions_advisor ON sessions(advisor_id);
CREATE INDEX idx_sessions_requester ON sessions(requester_id);
CREATE INDEX idx_requests_materia ON requests(materia);


-- Example stored procedure to finalize session and create audit log (simplified)


-- This pseudocode should be implemented as a transaction in your backend language or as a DB function
-- 1) set end_time and duration
-- 2) set status = 'completed'
-- 3) insert into audit_logs both check-in and check-out records
-- 4) only set counted_for_credits = true when both confirmations exist


-- Additional notes:
-- - Use row-level security (RLS) for protecting sensitive columns like matricula if DB supports it.
-- - Store password_hash using a text field but generated from Argon2/bcrypt in the app layer.
-- - Ensure backups and WAL archiving to meet the 24h RTO requirement.