const express = require('express');
const ActivityController = require('../controllers/activityController');
const { authenticate, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validation');

const router = express.Router();

// Middleware
router.use(authenticate);

// User activities
router.get('/user/:userId', ActivityController.getUserActivities);
router.get('/recent', ActivityController.getRecentActivities);
router.get('/stats', ActivityController.getActivityStats);
router.get('/export', ActivityController.exportActivities);
router.post('/', validateRequest, ActivityController.logActivity);

// Device activities
router.get('/device/:deviceId', ActivityController.getDeviceActivities);

// Admin routes
router.get('/admin/all', authorize('ADMIN'), ActivityController.getAllActivities);

module.exports = router;