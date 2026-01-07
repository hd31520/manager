const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { getNavigation } = require('../controllers/navigationController')

// Get navigation items based on user role and permissions
router.get('/', protect, getNavigation)

module.exports = router
