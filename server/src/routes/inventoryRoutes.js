const express = require('express')
const router = express.Router()
const {
  getInventoryHistory,
  getStockAlerts,
  transferStock
} = require('../controllers/inventoryController')
const { protect } = require('../middleware/authMiddleware')

router.use(protect)

router.get('/', getInventoryHistory)
router.get('/alerts', getStockAlerts)
router.post('/transfer', transferStock)

module.exports = router

