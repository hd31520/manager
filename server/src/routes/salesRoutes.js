const express = require('express')
const router = express.Router()
const {
  createOrder,
  createMemo,
  getOrders,
  getMemos,
  updateOrderStatus
} = require('../controllers/salesController')
const { protect } = require('../middleware/authMiddleware')

router.use(protect)

router.post('/orders', createOrder)
router.post('/memos', createMemo)
router.get('/orders', getOrders)
router.get('/memos', getMemos)
router.put('/orders/:id/status', updateOrderStatus)

module.exports = router

