const express = require('express')
const router = express.Router()
const {
  createWorker,
  getWorkers,
  getWorker,
  updateWorker,
  deleteWorker
} = require('../controllers/workerController')
const { getTodayAttendance, getMonthlyAttendance } = require('../controllers/attendanceController')
const { protect } = require('../middleware/authMiddleware')

router.use(protect)

router.post('/', createWorker)
router.get('/attendance/today', getTodayAttendance)
router.get('/attendance/monthly', getMonthlyAttendance)
router.get('/', getWorkers)
router.get('/:id', getWorker)
router.put('/:id', updateWorker)
router.delete('/:id', deleteWorker)

module.exports = router

