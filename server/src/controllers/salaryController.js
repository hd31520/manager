const Salary = require('../models/Salary')
const Worker = require('../models/Worker')
const Attendance = require('../models/Attendance')
const { calculateSalary } = require('../utils/salaryCalculator')
const { paginate, getMonthRange } = require('../utils/helpers')

// @desc    Calculate salary
// @route   POST /api/salary/calculate
// @access  Private
exports.calculateSalary = async (req, res, next) => {
  try {
    const { companyId, workerId, month, year } = req.body

    const salaryData = await calculateSalary(workerId, month, year, companyId)

    // Check if salary already exists
    let salary = await Salary.findOne({
      company: companyId,
      worker: workerId,
      month,
      year
    })

    if (salary) {
      // Update existing salary
      salary = await Salary.findByIdAndUpdate(
        salary._id,
        {
          ...salaryData,
          calculatedBy: req.user._id
        },
        { new: true }
      )
    } else {
      // Create new salary
      salary = await Salary.create({
        company: companyId,
        worker: workerId,
        month,
        year,
        ...salaryData,
        calculatedBy: req.user._id
      })
    }

    res.json({
      success: true,
      salary: await Salary.findById(salary._id)
        .populate('worker', 'employeeId')
        .populate('worker.user', 'name')
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Calculate all salaries for month
// @route   POST /api/salary/calculate-all
// @access  Private
exports.calculateAllSalaries = async (req, res, next) => {
  try {
    const { companyId, month, year } = req.body

    const workers = await Worker.find({ company: companyId, status: 'active' })
    const salaries = []

    for (const worker of workers) {
      try {
        const salaryData = await calculateSalary(worker._id, month, year, companyId)

        let salary = await Salary.findOne({
          company: companyId,
          worker: worker._id,
          month,
          year
        })

        if (salary) {
          salary = await Salary.findByIdAndUpdate(
            salary._id,
            {
              ...salaryData,
              calculatedBy: req.user._id
            },
            { new: true }
          )
        } else {
          salary = await Salary.create({
            company: companyId,
            worker: worker._id,
            month,
            year,
            ...salaryData,
            calculatedBy: req.user._id
          })
        }

        salaries.push(salary)
      } catch (error) {
        console.error(`Error calculating salary for worker ${worker._id}:`, error)
      }
    }

    res.json({
      success: true,
      count: salaries.length,
      salaries
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get salaries
// @route   GET /api/salary
// @access  Private
exports.getSalaries = async (req, res, next) => {
  try {
    const { companyId, workerId, month, year, page = 1, limit = 10 } = req.query
    const { skip, limit: limitNum } = paginate(page, limit)

    let query = {}
    if (companyId) query.company = companyId
    if (workerId) query.worker = workerId
    if (month) query.month = month
    if (year) query.year = year

    const salaries = await Salary.find(query)
      .populate('worker', 'employeeId')
      .populate('worker.user', 'name email')
      .populate('calculatedBy', 'name')
      .populate('paidBy', 'name')
      .skip(skip)
      .limit(limitNum)
      .sort({ year: -1, month: -1 })

    const total = await Salary.countDocuments(query)

    res.json({
      success: true,
      count: salaries.length,
      total,
      salaries
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Pay salary
// @route   PUT /api/salary/:id/pay
// @access  Private
exports.paySalary = async (req, res, next) => {
  try {
    const { paymentMethod, paidAmount, transactionId, notes } = req.body

    const salary = await Salary.findById(req.params.id)
    if (!salary) {
      return res.status(404).json({
        success: false,
        message: 'Salary record not found'
      })
    }

    const paid = paidAmount || salary.netSalary
    const status = paid >= salary.netSalary ? 'paid' : paid > 0 ? 'partial' : 'pending'

    salary.payment = {
      status,
      method: paymentMethod,
      paidAmount: paid,
      paidDate: new Date(),
      transactionId,
      notes
    }
    salary.paidBy = req.user._id
    await salary.save()

    // Create transaction
    const Transaction = require('../models/Transaction')
    await Transaction.create({
      company: salary.company,
      type: 'salary',
      amount: paid,
      description: `Salary payment for ${salary.month}/${salary.year}`,
      reference: 'salary',
      referenceId: salary._id,
      paymentMethod,
      transactionId,
      performedBy: req.user._id
    })

    res.json({
      success: true,
      salary
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get salary slip
// @route   GET /api/salary/:id/slip
// @access  Private
exports.getSalarySlip = async (req, res, next) => {
  try {
    const salary = await Salary.findById(req.params.id)
      .populate('worker', 'employeeId designation')
      .populate('worker.user', 'name')
      .populate('company', 'name address')

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: 'Salary record not found'
      })
    }

    res.json({
      success: true,
      salary
    })
  } catch (error) {
    next(error)
  }
}

