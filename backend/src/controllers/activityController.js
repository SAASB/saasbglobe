const ActivityService = require('../services/activityService');
const logger = require('../utils/logger');

class ActivityController {
  /**
   * Get all activities for a user
   * GET /api/activities
   */
  static async getUserActivities(req, res) {
    try {
      const { userId } = req.params || req.user;
      const {
        activityType,
        startDate,
        endDate,
        limit = 50,
        offset = 0,
        sortBy = 'timestamp',
        sortOrder = 'DESC',
      } = req.query;

      // Check authorization - users can only see their own activities
      if (req.user.id !== userId && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const result = await ActivityService.getUserActivities(userId, {
        activityType,
        startDate,
        endDate,
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
        sortBy,
        sortOrder,
      });

      res.json(result);
    } catch (error) {
      logger.error(`Error in getUserActivities: ${error.message}`);
      res.status(500).json({ error: 'Failed to fetch activities' });
    }
  }

  /**
   * Get all activities for a device
   * GET /api/devices/:deviceId/activities
   */
  static async getDeviceActivities(req, res) {
    try {
      const { deviceId } = req.params;
      const {
        activityType,
        startDate,
        endDate,
        limit = 50,
        offset = 0,
      } = req.query;

      const result = await ActivityService.getDeviceActivities(deviceId, {
        activityType,
        startDate,
        endDate,
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
      });

      res.json(result);
    } catch (error) {
      logger.error(`Error in getDeviceActivities: ${error.message}`);
      res.status(500).json({ error: 'Failed to fetch device activities' });
    }
  }

  /**
   * Get all activities (admin only)
   * GET /api/admin/activities
   */
  static async getAllActivities(req, res) {
    try {
      if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const {
        userId,
        activityType,
        startDate,
        endDate,
        limit = 100,
        offset = 0,
        sortBy = 'timestamp',
        sortOrder = 'DESC',
      } = req.query;

      const result = await ActivityService.getAllActivities({
        userId,
        activityType,
        startDate,
        endDate,
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
        sortBy,
        sortOrder,
      });

      res.json(result);
    } catch (error) {
      logger.error(`Error in getAllActivities: ${error.message}`);
      res.status(500).json({ error: 'Failed to fetch activities' });
    }
  }

  /**
   * Get activity statistics
   * GET /api/activities/stats
   */
  static async getActivityStats(req, res) {
    try {
      const { userId } = req.user;
      const { days = 30 } = req.query;

      const stats = await ActivityService.getActivityStats(userId, parseInt(days, 10));

      res.json(stats);
    } catch (error) {
      logger.error(`Error in getActivityStats: ${error.message}`);
      res.status(500).json({ error: 'Failed to fetch activity statistics' });
    }
  }

  /**
   * Export activities
   * GET /api/activities/export?format=csv
   */
  static async exportActivities(req, res) {
    try {
      const { userId } = req.user;
      const { format = 'csv' } = req.query;

      const csv = await ActivityService.exportActivities(userId, format);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=activities.csv');
      res.send(csv);
    } catch (error) {
      logger.error(`Error in exportActivities: ${error.message}`);
      res.status(500).json({ error: 'Failed to export activities' });
    }
  }

  /**
   * Get recent activities for real-time feed
   * GET /api/activities/recent
   */
  static async getRecentActivities(req, res) {
    try {
      const { userId } = req.user;
      const { limit = 20 } = req.query;

      const activities = await ActivityService.getRecentActivities(userId, parseInt(limit, 10));

      res.json(activities);
    } catch (error) {
      logger.error(`Error in getRecentActivities: ${error.message}`);
      res.status(500).json({ error: 'Failed to fetch recent activities' });
    }
  }

  /**
   * Log a new activity (internal use)
   * POST /api/activities
   */
  static async logActivity(req, res) {
    try {
      const {
        activityType,
        description,
        metadata,
        location,
        severity = 'LOW',
      } = req.body;

      const activity = await ActivityService.logActivity({
        userId: req.user.id,
        deviceId: req.body.deviceId || null,
        activityType,
        description,
        metadata,
        location,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        severity,
      });

      res.status(201).json(activity);
    } catch (error) {
      logger.error(`Error in logActivity: ${error.message}`);
      res.status(500).json({ error: 'Failed to log activity' });
    }
  }
}

module.exports = ActivityController;