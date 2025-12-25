const Attendance = require('../models/Attendance')
const Worker = require('../models/Worker')

// @desc    Get today's attendance summary for a company
// @route   GET /api/workers/attendance/today
// @access  Private
exports.getTodayAttendance = async (req, res, next) => {
  try {
    const { companyId } = req.query
    if (!companyId) {
      return res.status(400).json({ success: false, message: 'companyId is required' })
    }

    const start = new Date()
    start.setHours(0,0,0,0)
    const end = new Date()
    end.setHours(23,59,59,999)

    const records = await Attendance.find({ company: companyId, date: { $gte: start, $lte: end } })

    const totalWorkers = await Worker.countDocuments({ company: companyId, status: 'active' })

    const present = records.filter(r => r.status === 'present').length
    const absent = records.filter(r => r.status === 'absent').length
    const late = records.filter(r => r.status === 'late').length

    const percentage = totalWorkers ? Math.round((present / totalWorkers) * 100) : 0

    res.json({
      success: true,
      totalWorkers,
      present,
      absent,
      late,
      percentage
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get monthly attendance summary (counts and overtime hours)
// @route   GET /api/workers/attendance/monthly
// @access  Private
exports.getMonthlyAttendance = async (req, res, next) => {
  try {
    const { companyId, month, year } = req.query
    if (!companyId) {
      return res.status(400).json({ success: false, message: 'companyId is required' })
    }

    const m = parseInt(month, 10) || (new Date().getMonth() + 1)
    const y = parseInt(year, 10) || new Date().getFullYear()

    const start = new Date(y, m - 1, 1)
    const end = new Date(y, m, 0, 23, 59, 59, 999)

    const records = await Attendance.find({ company: companyId, date: { $gte: start, $lte: end } })

    const totalPresentDays = records.filter(r => r.status === 'present').length
    const totalOvertime = records.reduce((s, r) => s + (r.overtimeHours || 0), 0)

    res.json({
      success: true,
      totalPresentDays,
      totalOvertime
    })
  } catch (error) {
    next(error)
  }
}

module.exports = exports
