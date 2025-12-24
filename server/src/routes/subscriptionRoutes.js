const express = require('express')
const router = express.Router()
const {
  getPlans,
  getSubscription,
  updateSubscription,
  cancelSubscription
} = require('../controllers/subscriptionController')
const { protect } = require('../middleware/authMiddleware')

router.get('/plans', getPlans)
router.use(protect)
router.get('/:companyId', getSubscription)
router.put('/:companyId', updateSubscription)
router.put('/:companyId/cancel', cancelSubscription)

module.exports = router

