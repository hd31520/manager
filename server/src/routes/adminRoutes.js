const express = require('express')
const router = express.Router()
const {
  getStats,
  getUsers,
  updateUserStatus,
  getCompanies,
  suspendCompany
} = require('../controllers/adminController')
const { protect, authorize } = require('../middleware/authMiddleware')

router.use(protect)
router.use(authorize('admin'))

router.get('/stats', getStats)
router.get('/users', getUsers)
router.put('/users/:id/status', updateUserStatus)
router.get('/companies', getCompanies)
router.put('/companies/:id/suspend', suspendCompany)

module.exports = router

