const Attendance = require('../models/Attendance')
const Worker = require('../models/Worker')

const calculateSalary = async (workerId, month, year, companyId) => {
  try {
    const worker = await Worker.findById(workerId)
    if (!worker) {
      throw new Error('Worker not found')
    }

    // Get attendance for the month
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    const attendanceRecords = await Attendance.find({
      company: companyId,
      worker: workerId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    })

    // Calculate attendance stats
    let presentDays = 0
    let absentDays = 0
    let lateDays = 0
    let totalWorkingHours = 0
    let totalOvertimeHours = 0

    attendanceRecords.forEach(record => {
      if (record.status === 'present') {
        presentDays++
        totalWorkingHours += record.workingHours || 8
        totalOvertimeHours += record.overtimeHours || 0
      } else if (record.status === 'absent') {
        absentDays++
      } else if (record.status === 'late') {
        lateDays++
        totalWorkingHours += record.workingHours || 8
      }
    })

    const baseSalary = worker.salary.baseSalary
    const overtimeRate = worker.salary.overtimeRate || (baseSalary / 30 / 8) * 1.5
    const bonus = worker.salary.bonus || 0

    // Calculate earnings
    const dailySalary = baseSalary / 30
    const presentSalary = dailySalary * presentDays
    const overtimeAmount = totalOvertimeHours * overtimeRate
    const totalEarnings = presentSalary + overtimeAmount + bonus

    // Calculate deductions (assuming no deductions for now, can be added)
    const deductions = {
      advance: 0,
      penalty: 0,
      tax: 0,
      other: 0,
      total: 0
    }

    const netSalary = totalEarnings - deductions.total

    return {
      baseSalary,
      attendance: {
        presentDays,
        absentDays,
        lateDays,
        workingHours: totalWorkingHours
      },
      earnings: {
        overtime: {
          hours: totalOvertimeHours,
          rate: overtimeRate,
          amount: overtimeAmount
        },
        bonus,
        allowance: 0,
        total: totalEarnings
      },
      deductions,
      netSalary: Math.max(0, netSalary)
    }
  } catch (error) {
    throw new Error(`Salary calculation error: ${error.message}`)
  }
}

module.exports = {
  calculateSalary
}

