const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Activity = sequelize.define('Activity', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      index: true,
    },
    deviceId: {
      type: DataTypes.UUID,
      references: {
        model: 'Devices',
        key: 'id',
      },
      index: true,
    },
    activityType: {
      type: DataTypes.ENUM(
        'LOCATION_UPDATE',
        'LOCATION_SHARED',
        'GEOFENCE_ENTRY',
        'GEOFENCE_EXIT',
        'APP_LAUNCH',
        'APP_CLOSE',
        'BATTERY_CHANGE',
        'CONNECTIVITY_CHANGE',
        'APP_UPDATE',
        'PERMISSION_CHANGE',
        'LOGIN',
        'LOGOUT',
        'SCREEN_VIEW',
        'SETTING_CHANGE',
        'REPORT_GENERATED',
        'DATA_EXPORTED',
        'CONSENT_CHANGE',
        'PAYMENT_INITIATED',
        'PAYMENT_COMPLETED',
        'PAYMENT_FAILED',
        'REFUND_PROCESSED',
        'SUBSCRIPTION_CHANGED',
        'ACCOUNT_CREATED',
        'PROFILE_UPDATED',
        'PASSWORD_CHANGED',
        'MFA_ENABLED',
        'MFA_DISABLED',
        'ACCOUNT_DELETED',
        'ACCOUNT_SUSPENDED',
        'ADMIN_ACTION',
        'SYSTEM_EVENT',
        'ERROR_OCCURRED'
      ),
      allowNull: false,
      index: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Additional data related to the activity',
    },
    location: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Location data if applicable',
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('SUCCESS', 'FAILED', 'PENDING'),
      defaultValue: 'SUCCESS',
    },
    severity: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
      defaultValue: 'LOW',
    },
    isEncrypted: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    encryptionKey: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      index: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      index: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'activities',
    indexes: [
      {
        fields: ['userId', 'timestamp'],
        name: 'idx_user_timestamp',
      },
      {
        fields: ['deviceId', 'timestamp'],
        name: 'idx_device_timestamp',
      },
      {
        fields: ['activityType', 'timestamp'],
        name: 'idx_activity_type_timestamp',
      },
      {
        fields: ['status'],
        name: 'idx_status',
      },
      {
        fields: ['severity'],
        name: 'idx_severity',
      },
    ],
  });

  Activity.associate = (models) => {
    Activity.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Activity.belongsTo(models.Device, {
      foreignKey: 'deviceId',
      as: 'device',
    });
  };

  return Activity;
};