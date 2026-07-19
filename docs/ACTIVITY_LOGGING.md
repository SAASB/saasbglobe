# Activity Logging & Monitoring Guide

## Overview

SAAS-B-Track provides comprehensive activity logging and monitoring capabilities that track all user and system activities. This allows admins and users to view complete activity timelines, audit trails, and generate reports.

## Features

### 1. Activity Types

The system tracks the following activity types:

#### Location Events
- `LOCATION_UPDATE` - User's location has been updated
- `LOCATION_SHARED` - User shared location with others
- `GEOFENCE_ENTRY` - Device entered a geofence zone
- `GEOFENCE_EXIT` - Device exited a geofence zone

#### Device Events
- `APP_LAUNCH` - Mobile app launched
- `APP_CLOSE` - Mobile app closed
- `BATTERY_CHANGE` - Device battery level changed
- `CONNECTIVITY_CHANGE` - Device connectivity status changed
- `APP_UPDATE` - Mobile app updated
- `PERMISSION_CHANGE` - App permissions changed

#### User Actions
- `LOGIN` - User logged in
- `LOGOUT` - User logged out
- `SCREEN_VIEW` - User viewed a screen/page
- `SETTING_CHANGE` - User changed settings
- `REPORT_GENERATED` - Activity report generated
- `DATA_EXPORTED` - User exported data
- `CONSENT_CHANGE` - User changed consent settings

#### Payment Events
- `PAYMENT_INITIATED` - Payment process started
- `PAYMENT_COMPLETED` - Payment successful
- `PAYMENT_FAILED` - Payment failed
- `REFUND_PROCESSED` - Refund completed
- `SUBSCRIPTION_CHANGED` - Subscription tier changed

#### Account Events
- `ACCOUNT_CREATED` - New account created
- `PROFILE_UPDATED` - User profile updated
- `PASSWORD_CHANGED` - Password changed
- `MFA_ENABLED` - Two-factor authentication enabled
- `MFA_DISABLED` - Two-factor authentication disabled
- `ACCOUNT_DELETED` - Account deleted
- `ACCOUNT_SUSPENDED` - Account suspended

#### Admin/System Events
- `ADMIN_ACTION` - Admin performed an action
- `SYSTEM_EVENT` - System event occurred
- `ERROR_OCCURRED` - An error occurred in the system

### 2. Activity Attributes

Each activity record includes:

```json
{
  "id": "uuid",
  "userId": "uuid",
  "deviceId": "uuid",
  "activityType": "LOCATION_UPDATE",
  "description": "Location updated to coordinates",
  "metadata": {
    "key": "value"
  },
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "accuracy": 10,
    "altitude": 0
  },
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "status": "SUCCESS",
  "severity": "LOW",
  "isEncrypted": true,
  "timestamp": "2024-01-15T10:30:00Z",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### 3. Activity Status

- `SUCCESS` - Activity completed successfully
- `FAILED` - Activity failed
- `PENDING` - Activity is pending

### 4. Activity Severity Levels

- `LOW` - Routine activity
- `MEDIUM` - Important activity
- `HIGH` - Critical activity
- `CRITICAL` - Security-sensitive activity

## API Endpoints

### Get User Activities

```bash
GET /api/activities/user/{userId}?limit=50&offset=0&activityType=LOCATION_UPDATE&startDate=2024-01-01&endDate=2024-01-31
```

### Get Device Activities

```bash
GET /api/devices/{deviceId}/activities?limit=50&offset=0
```

### Get All Activities (Admin Only)

```bash
GET /api/admin/activities?userId=xxx&activityType=LOGIN&limit=100&offset=0
```

### Get Activity Statistics

```bash
GET /api/activities/stats?days=30
```

### Export Activities

```bash
GET /api/activities/export?format=csv
```

### Get Recent Activities

```bash
GET /api/activities/recent?limit=20
```

### Log Activity

```bash
POST /api/activities
Content-Type: application/json

{
  "activityType": "LOCATION_UPDATE",
  "description": "Location updated",
  "metadata": {
    "accuracy": 10
  },
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "deviceId": "uuid",
  "severity": "LOW"
}
```

## Security Considerations

### Data Encryption
- Activity metadata is encrypted using AES-256
- Location data is encrypted at rest
- Encryption keys are stored separately

### Access Control
- Users can only view their own activities
- Admins can view all activities
- Activities include IP address and user agent for audit purposes

### Data Retention
- Activities are retained for 90 days by default
- Configurable retention policies
- Manual deletion of old activities available

## Compliance

### GDPR
- Users can export their activity data
- Users can request deletion of activities
- Activity logs support data retention policies

### CCPA
- Complete activity history available
- Transparent data tracking
- User consent audit trail

## Performance Optimization

### Database Indexes
- Composite indexes on `userId + timestamp`
- Composite indexes on `deviceId + timestamp`
- Indexes on `activityType` and `status`
- Indexes on `createdAt` for cleanup queries

### Caching
- Recent activities cached in Redis
- Statistics cached for 1 hour
- Cache invalidation on new activities

### Pagination
- Always use pagination for large result sets
- Batch processing for exports
- Streaming responses for large datasets

## Best Practices

1. **Always include relevant metadata** - Provide context for activities
2. **Set appropriate severity levels** - Helps identify important events
3. **Use consistent descriptions** - Aids in searching and reporting
4. **Clean up old activities** - Maintain performance and storage
5. **Monitor high-severity events** - Set up alerts for critical activities
6. **Regularly audit admin actions** - Maintain security and compliance
7. **Encrypt sensitive metadata** - Protect user privacy
8. **Implement rate limiting** - Prevent activity log flooding