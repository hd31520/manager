const express = require('express')
const router = express.Router()
const {
  generateReport,
  getReports,
  getReport
} = require('../controllers/reportController')
const { protect } = require('../middleware/authMiddleware')

router.use(protect)

router.post('/generate', generateReport)
router.get('/', getReports)
router.get('/:id', getReport)

module.exports = router

