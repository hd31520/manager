const express = require('express')
const router = express.Router()
const {
  getProfile,
  updateProfile,
  updatePassword,
  getNotificationSettings,
  updateNotificationSettings,
  getUserCompanies
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

// All routes require authentication
router.use(protect)

// Profile routes
router.get('/me', getProfile)
router.put('/me', updateProfile)
router.put('/me/password', updatePassword)

// Notification routes
router.get('/me/notifications', getNotificationSettings)
router.put('/me/notifications', updateNotificationSettings)

// Company routes
router.get('/companies', getUserCompanies)

module.exports = router