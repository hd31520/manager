const express = require('express')
const router = express.Router()
const {
  getProfile,
  updateProfile,
  getUserCompanies
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

router.use(protect)

router.get('/me', getProfile)
router.put('/me', updateProfile)
router.get('/companies', getUserCompanies)

module.exports = router

