// workerRoutes.js - Temporary fix
const express = require('express')
const router = express.Router()
const workerController = require('../controllers/workerController')
const attendanceController = require('../controllers/attendanceController')
const { protect, authorize } = require('../middleware/authMiddleware')
const { checkCompanyAccess, checkPermission } = require('../middleware/roleMiddleware')

// Public route for completing registration
router.post('/complete-registration/:token', workerController.completeWorkerRegistration)

// Protected routes
router.use(protect)

// Attendance routes
router.get('/attendance/today', attendanceController.getTodayAttendance)
router.get('/attendance/monthly', attendanceController.getMonthlyAttendance)

// Availability check
router.get('/check', checkCompanyAccess, workerController.checkWorkerAvailability)

// Worker management routes
router.post('/', checkCompanyAccess, checkPermission('workers.create'), workerController.createWorker)

// COMMENT THIS LINE TEMPORARILY
// router.post('/create-with-password-setup', checkCompanyAccess, checkPermission('workers.create'), workerController.createWorkerWithPasswordSetup)

router.post('/invite', checkCompanyAccess, checkPermission('workers.create'), workerController.inviteWorker)
router.get('/', workerController.getWorkers)
router.get('/:id', workerController.getWorker)
router.put('/:id', checkCompanyAccess, checkPermission('workers.update'), workerController.updateWorker)
router.delete('/:id', checkCompanyAccess, checkPermission('workers.delete'), workerController.deleteWorker)

module.exports = router