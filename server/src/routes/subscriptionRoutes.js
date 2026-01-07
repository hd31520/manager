// routes/subscriptionRoutes.js
const express = require('express')
const router = express.Router()
const {
  getCompanySubscription,
  getPlans,
  updateSubscription
} = require('../controllers/subscriptionController')
const { protect } = require('../middleware/authMiddleware')

router.use(protect)

router.get('/company/:companyId', getCompanySubscription)
router.get('/plans', getPlans)
router.put('/company/:companyId', updateSubscription)

module.exports = router