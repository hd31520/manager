const Worker = require('../models/Worker')
const User = require('../models/User')
const Company = require('../models/Company')
const CompanyUser = require('../models/CompanyUser')
const Subscription = require('../models/Subscription')
const { paginate } = require('../utils/helpers')

// @desc    Create worker
// @route   POST /api/workers
// @access  Private
exports.createWorker = async (req, res, next) => {
  try {
    const { companyId, userId, employeeId, designation, department, baseSalary, joiningDate } = req.body

    // Check worker limit
    const company = await Company.findById(companyId)
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      })
    }

    const subscription = await Subscription.findOne({ company: companyId })
    const currentWorkerCount = await Worker.countDocuments({ company: companyId, status: 'active' })

    if (subscription && currentWorkerCount >= subscription.workerLimit) {
      return res.status(400).json({
        success: false,
        message: `Worker limit reached. Current plan allows ${subscription.workerLimit} workers. Please upgrade your plan.`
      })
    }

    // Check if employee ID already exists
    const existingWorker = await Worker.findOne({ company: companyId, employeeId })
    if (existingWorker) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID already exists'
      })
    }

    // Create worker
    const worker = await Worker.create({
      company: companyId,
      user: userId,
      employeeId,
      designation,
      department,
      salary: {
        baseSalary: baseSalary || 0,
        overtimeRate: 0,
        bonus: 0
      },
      joiningDate: joiningDate || new Date()
    })

    // Add user to company if not already added
    const companyUser = await CompanyUser.findOne({ company: companyId, user: userId })
    if (!companyUser) {
      await CompanyUser.create({
        company: companyId,
        user: userId,
        isActive: true
      })
    }

    res.status(201).json({
      success: true,
      worker: await Worker.findById(worker._id).populate('user', 'name email phone')
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all workers
// @route   GET /api/workers
// @access  Private
exports.getWorkers = async (req, res, next) => {
  try {
    const { companyId, page = 1, limit = 10, status, group } = req.query
    const { skip, limit: limitNum } = paginate(page, limit)

    let query = {}
    if (companyId) query.company = companyId
    if (status) query.status = status
    if (group) query.group = group

    const workers = await Worker.find(query)
      .populate('user', 'name email phone')
      .populate('group', 'name')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 })

    const total = await Worker.countDocuments(query)

    res.json({
      success: true,
      count: workers.length,
      total,
      workers
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single worker
// @route   GET /api/workers/:id
// @access  Private
exports.getWorker = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('company', 'name')
      .populate('group', 'name')

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      })
    }

    res.json({
      success: true,
      worker
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update worker
// @route   PUT /api/workers/:id
// @access  Private
exports.updateWorker = async (req, res, next) => {
  try {
    let worker = await Worker.findById(req.params.id)

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      })
    }

    worker = await Worker.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('user', 'name email phone')

    res.json({
      success: true,
      worker
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete worker
// @route   DELETE /api/workers/:id
// @access  Private
exports.deleteWorker = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.params.id)

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      })
    }

    // Soft delete - set status to terminated
    worker.status = 'terminated'
    await worker.save()

    res.json({
      success: true,
      message: 'Worker deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

