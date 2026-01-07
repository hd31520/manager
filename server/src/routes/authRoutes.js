const express = require('express')
const router = express.Router()
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword,
  setPassword, // Add this import
  verifyEmail,
  resendVerification,
  logout
} = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')

// Public routes
router.post('/register', register)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.put('/reset-password/:token', resetPassword)
router.put('/set-password/:token', setPassword) // Add this new route
router.get('/verify-email/:token', verifyEmail)
router.post('/resend-verification', resendVerification)

// Protected routes
router.get('/me', protect, getMe)
router.put('/update-password', protect, updatePassword)
router.post('/logout', protect, logout)

module.exports = router