const { Op } = require('sequelize');
const db = require('../config/database');
const encryption = require('../utils/encryption');
const logger = require('../utils/logger');

class ActivityService {
  /**
   * Log a new activity
   */
  static async logActivity({
    userId,
    deviceId,
    activityType,
    description,
    metadata = {},
    location = null,
    ipAddress = null,
    userAgent = null,
    status = 'SUCCESS',
    severity = 'LOW',
  }) {
    try {
      // Encrypt sensitive metadata
      const encryptedMetadata = encryption.encrypt(JSON.stringify(metadata));
      const encryptedLocation = location ? encryption.encrypt(JSON.stringify(location)) : null;

      const activity = await db.Activity.create({
        userId,
        deviceId,
        activityType,
        description,
        metadata: encryptedMetadata,
        location: encryptedLocation,
        ipAddress,
        userAgent,
        status,
        severity,
        isEncrypted: true,
        timestamp: new Date(),
      });

      logger.info(`Activity logged: ${activityType} for user ${userId}`);
      return activity;
    } catch (error) {
      logger.error(`Error logging activity: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get activities for a user with filtering and pagination
   */
  static async getUserActivities(userId, {
    activityType = null,
    startDate = null,
    endDate = null,
    limit = 50,
    offset = 0,
    sortBy = 'timestamp',
    sortOrder = 'DESC',
  } = {}) {
    try {
      const where = { userId };

      if (activityType) {
        where.activityType = activityType;
      }

      if (startDate || endDate) {
        where.timestamp = {};
        if (startDate) where.timestamp[Op.gte] = new Date(startDate);
        if (endDate) where.timestamp[Op.lte] = new Date(endDate);
      }

      const { count, rows } = await db.Activity.findAndCountAll({
        where,
        limit,
        offset,
        order: [[sortBy, sortOrder]],
        include: [
          {
            model: db.Device,
            as: 'device',
            attributes: ['id', 'deviceName', 'deviceType', 'osType'],
          },
        ],
      });

      // Decrypt sensitive data
      const decryptedActivities = rows.map(activity => {
        const decrypted = activity.toJSON();
        if (decrypted.metadata) {
          try {
            decrypted.metadata = JSON.parse(encryption.decrypt(decrypted.metadata));
          } catch (e) {
            decrypted.metadata = {};
          }
        }
        if (decrypted.location) {
          try {
            decrypted.location = JSON.parse(encryption.decrypt(decrypted.location));
          } catch (e) {
            decrypted.location = null;
          }
        }
        return decrypted;
      });

      return {
        total: count,
        data: decryptedActivities,
        pagination: {
          limit,
          offset,
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      logger.error(`Error fetching user activities: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get activities for a device
   */
  static async getDeviceActivities(deviceId, options = {}) {
    try {
      const where = { deviceId };

      if (options.activityType) {
        where.activityType = options.activityType;
      }

      if (options.startDate || options.endDate) {
        where.timestamp = {};
        if (options.startDate) where.timestamp[Op.gte] = new Date(options.startDate);
        if (options.endDate) where.timestamp[Op.lte] = new Date(options.endDate);
      }

      const { count, rows } = await db.Activity.findAndCountAll({
        where,
        limit: options.limit || 50,
        offset: options.offset || 0,
        order: [['timestamp', 'DESC']],
      });

      return {
        total: count,
        data: rows,
        pagination: {
          limit: options.limit || 50,
          offset: options.offset || 0,
          totalPages: Math.ceil(count / (options.limit || 50)),
        },
      };
    } catch (error) {
      logger.error(`Error fetching device activities: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all activities (admin only)
   */
  static async getAllActivities({
    userId = null,
    activityType = null,
    startDate = null,
    endDate = null,
    limit = 100,
    offset = 0,
    sortBy = 'timestamp',
    sortOrder = 'DESC',
  } = {}) {
    try {
      const where = {};

      if (userId) where.userId = userId;
      if (activityType) where.activityType = activityType;

      if (startDate || endDate) {
        where.timestamp = {};
        if (startDate) where.timestamp[Op.gte] = new Date(startDate);
        if (endDate) where.timestamp[Op.lte] = new Date(endDate);
      }

      const { count, rows } = await db.Activity.findAndCountAll({
        where,
        limit,
        offset,
        order: [[sortBy, sortOrder]],
        include: [
          {
            model: db.User,
            as: 'user',
            attributes: ['id', 'email', 'firstName', 'lastName'],
          },
          {
            model: db.Device,
            as: 'device',
            attributes: ['id', 'deviceName', 'osType'],
          },
        ],
      });

      return {
        total: count,
        data: rows,
        pagination: {
          limit,
          offset,
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      logger.error(`Error fetching all activities: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get activity statistics
   */
  static async getActivityStats(userId = null, days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const where = { timestamp: { [Op.gte]: startDate } };
      if (userId) where.userId = userId;

      const activities = await db.Activity.findAll({
        where,
        attributes: ['activityType', 'status', 'severity'],
        raw: true,
      });

      const stats = {
        totalActivities: activities.length,
        byType: {},
        byStatus: {},
        bySeverity: {},
        timeline: [],
      };

      // Aggregate by type
      activities.forEach(activity => {
        stats.byType[activity.activityType] = (stats.byType[activity.activityType] || 0) + 1;
        stats.byStatus[activity.status] = (stats.byStatus[activity.status] || 0) + 1;
        stats.bySeverity[activity.severity] = (stats.bySeverity[activity.severity] || 0) + 1;
      });

      return stats;
    } catch (error) {
      logger.error(`Error fetching activity stats: ${error.message}`);
      throw error;
    }
  }

  /**
   * Export activities to CSV
   */
  static async exportActivities(userId = null, format = 'csv') {
    try {
      const where = {};
      if (userId) where.userId = userId;

      const activities = await db.Activity.findAll({
        where,
        order: [['timestamp', 'DESC']],
        include: [
          {
            model: db.User,
            as: 'user',
            attributes: ['email'],
          },
          {
            model: db.Device,
            as: 'device',
            attributes: ['deviceName'],
          },
        ],
      });

      if (format === 'csv') {
        return this.convertToCSV(activities);
      }
      return activities;
    } catch (error) {
      logger.error(`Error exporting activities: ${error.message}`);
      throw error;
    }
  }

  /**
   * Convert activities to CSV format
   */
  static convertToCSV(activities) {
    const headers = [
      'Activity ID',
      'User Email',
      'Device Name',
      'Activity Type',
      'Description',
      'Status',
      'Severity',
      'Timestamp',
      'IP Address',
    ];

    const rows = activities.map(activity => [
      activity.id,
      activity.user?.email || 'N/A',
      activity.device?.deviceName || 'N/A',
      activity.activityType,
      activity.description || '',
      activity.status,
      activity.severity,
      activity.timestamp,
      activity.ipAddress || '',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    return csv;
  }

  /**
   * Delete old activities (retention policy)
   */
  static async deleteOldActivities(retentionDays = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      const result = await db.Activity.destroy({
        where: {
          createdAt: { [Op.lt]: cutoffDate },
        },
      });

      logger.info(`Deleted ${result} old activities`);
      return result;
    } catch (error) {
      logger.error(`Error deleting old activities: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get recent activities for real-time feed
   */
  static async getRecentActivities(userId, limit = 20) {
    try {
      const activities = await db.Activity.findAll({
        where: { userId },
        limit,
        order: [['timestamp', 'DESC']],
        include: [
          {
            model: db.Device,
            as: 'device',
            attributes: ['id', 'deviceName'],
          },
        ],
      });

      return activities;
    } catch (error) {
      logger.error(`Error fetching recent activities: ${error.message}`);
      throw error;
    }
  }
}

module.exports = ActivityService;