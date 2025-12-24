const express = require('express')
const router = express.Router()
const {
  calculateSalary,
  calculateAllSalaries,
  getSalaries,
  paySalary,
  getSalarySlip
} = require('../controllers/salaryController')
const { protect } = require('../middleware/authMiddleware')

router.use(protect)

router.post('/calculate', calculateSalary)
router.post('/calculate-all', calculateAllSalaries)
router.get('/', getSalaries)
router.put('/:id/pay', paySalary)
router.get('/:id/slip', getSalarySlip)

module.exports = router

