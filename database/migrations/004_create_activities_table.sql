CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id UUID REFERENCES devices(id) ON DELETE SET NULL,
    activity_type VARCHAR(50) NOT NULL,
    description TEXT,
    metadata JSONB,
    location JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    status VARCHAR(20) DEFAULT 'SUCCESS',
    severity VARCHAR(20) DEFAULT 'LOW',
    is_encrypted BOOLEAN DEFAULT TRUE,
    encryption_key VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_activity_type CHECK (activity_type IN (
        'LOCATION_UPDATE', 'LOCATION_SHARED', 'GEOFENCE_ENTRY', 'GEOFENCE_EXIT',
        'APP_LAUNCH', 'APP_CLOSE', 'BATTERY_CHANGE', 'CONNECTIVITY_CHANGE',
        'APP_UPDATE', 'PERMISSION_CHANGE',
        'LOGIN', 'LOGOUT', 'SCREEN_VIEW', 'SETTING_CHANGE',
        'REPORT_GENERATED', 'DATA_EXPORTED', 'CONSENT_CHANGE',
        'PAYMENT_INITIATED', 'PAYMENT_COMPLETED', 'PAYMENT_FAILED',
        'REFUND_PROCESSED', 'SUBSCRIPTION_CHANGED',
        'ACCOUNT_CREATED', 'PROFILE_UPDATED', 'PASSWORD_CHANGED',
        'MFA_ENABLED', 'MFA_DISABLED', 'ACCOUNT_DELETED', 'ACCOUNT_SUSPENDED',
        'ADMIN_ACTION', 'SYSTEM_EVENT', 'ERROR_OCCURRED'
    )),
    CONSTRAINT check_status CHECK (status IN ('SUCCESS', 'FAILED', 'PENDING')),
    CONSTRAINT check_severity CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'))
);

CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_device_id ON activities(device_id);
CREATE INDEX idx_activities_activity_type ON activities(activity_type);
CREATE INDEX idx_activities_timestamp ON activities(timestamp DESC);
CREATE INDEX idx_activities_status ON activities(status);
CREATE INDEX idx_activities_severity ON activities(severity);
CREATE INDEX idx_activities_created_at ON activities(created_at DESC);
CREATE INDEX idx_activities_user_timestamp ON activities(user_id, timestamp DESC);
CREATE INDEX idx_activities_device_timestamp ON activities(device_id, timestamp DESC);
CREATE INDEX idx_activities_type_timestamp ON activities(activity_type, timestamp DESC);
CREATE INDEX idx_activities_metadata_gin ON activities USING gin(metadata);
CREATE INDEX idx_activities_location_gin ON activities USING gin(location);