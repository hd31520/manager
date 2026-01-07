const Worker = require('../models/Worker')
const User = require('../models/User')
const Company = require('../models/Company')
const CompanyUser = require('../models/CompanyUser')
const Subscription = require('../models/Subscription')
const Role = require('../models/Role')
const { paginate } = require('../utils/helpers')
const crypto = require('crypto')
const { generateToken: generateRandomToken } = require('../utils/helpers')
const { 
  sendWorkerInvitationEmail,
  sendWorkerPasswordSetupEmail
} = require('../utils/emailService')

// @desc    Create worker with password setup
// @route   POST /api/workers/create-with-password-setup
// @access  Private (owner, manager, group_leader)
const createWorkerWithPasswordSetup = async (req, res, next) => {
  try {
    const { 
      companyId, 
      name, 
      email, 
      phone, 
      employeeId, 
      designation, 
      department, 
      baseSalary, 
      role,
      joiningDate 
    } = req.body

    const currentUser = req.user

    // If companyId is provided, use it; otherwise, get the user's first active company
    let targetCompanyId = companyId
    if (!targetCompanyId) {
      const userCompany = await CompanyUser.findOne({
        user: currentUser._id,
        isActive: true
      })
      if (!userCompany) {
        return res.status(403).json({
          success: false,
          message: 'No company found. Please create or join a company first.'
        })
      }
      targetCompanyId = userCompany.company
    }

    // Check if current user can create worker for this company
    const companyUser = await CompanyUser.findOne({
      company: targetCompanyId,
      user: currentUser._id,
      isActive: true
    }).populate('role')

    if (!companyUser) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add workers to this company'
      })
    }

    // Role-based permission check
    const userRole = companyUser.role?.name || currentUser.role
    
    const roleHierarchy = {
      'owner': ['owner', 'manager', 'group_leader', 'worker', 'sales_executive'],
      'manager': ['manager', 'group_leader', 'worker', 'sales_executive'],
      'group_leader': ['group_leader', 'worker', 'sales_executive'],
      'worker': ['worker']
    }

    const allowedRoles = roleHierarchy[userRole] || []
    
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: `You are not authorized to create a worker with role: ${role}`
      })
    }

    // Check worker limit
    const company = await Company.findById(targetCompanyId)
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      })
    }

    const subscription = await Subscription.findOne({ company: targetCompanyId })
    const currentWorkerCount = await Worker.countDocuments({ 
      company: targetCompanyId, 
      status: 'active' 
    })

    if (subscription && currentWorkerCount >= subscription.workerLimit) {
      return res.status(400).json({
        success: false,
        message: `Worker limit reached. Current plan allows ${subscription.workerLimit} workers. Please upgrade your plan.`
      })
    }

    // Check if employee ID already exists for this company
    const existingEmployeeId = await Worker.findOne({ 
      company: targetCompanyId, 
      employeeId 
    })
    if (existingEmployeeId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID already exists for this company'
      })
    }

    // Check if email already exists in the system
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists'
      })
    }

    // Generate password setup token
    const passwordSetupToken = generateRandomToken()
    const hashedPasswordSetupToken = crypto.createHash('sha256').update(passwordSetupToken).digest('hex')
    
    // Create user with password setup token (no password yet)
    const user = await User.create({
      name,
      email,
      phone: phone || '',
      role: role || 'worker',
      resetPasswordToken: hashedPasswordSetupToken,
      resetPasswordExpires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      isActive: true,
      requiresPasswordSetup: true,
      isEmailVerified: true
    })

    // Get role document for the worker
    const workerRole = await Role.findOne({
      company: targetCompanyId,
      name: role || 'worker'
    })

    // Add user to company with role
    await CompanyUser.create({
      company: targetCompanyId,
      user: user._id,
      role: workerRole?._id || null,
      isActive: true,
      invitedBy: currentUser._id,
      invitationStatus: 'accepted'
    })

    // Create worker
    const worker = await Worker.create({
      company: targetCompanyId,
      user: user._id,
      employeeId,
      designation,
      department,
      role: role || 'worker',
      salary: {
        baseSalary: baseSalary || 0,
        overtimeRate: 0,
        bonus: 0
      },
      joiningDate: joiningDate || new Date(),
      status: 'active'
    })

    // Send password setup email
    try {
      const passwordSetupLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/set-password?token=${passwordSetupToken}`
      await sendWorkerPasswordSetupEmail({
        to: email,
        name,
        companyName: company.name,
        invitedBy: currentUser.name,
        role: role || 'worker',
        passwordSetupLink
      })
    } catch (emailError) {
      console.error('Password setup email failed:', emailError)
    }

    res.status(201).json({
      success: true,
      message: 'Worker created successfully. Password setup email has been sent.',
      worker: await Worker.findById(worker._id)
        .populate('user', 'name email phone')
        .populate('company', 'name')
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create worker (original method)
// @route   POST /api/workers
// @access  Private (owner, manager, group_leader)
const createWorker = async (req, res, next) => {
  try {
    const { 
      companyId, 
      name, 
      email, 
      phone, 
      employeeId, 
      designation, 
      department, 
      baseSalary, 
      role,
      joiningDate 
    } = req.body

    const currentUser = req.user

    // If companyId is provided, use it; otherwise, get the user's first active company
    let targetCompanyId = companyId
    if (!targetCompanyId) {
      const userCompany = await CompanyUser.findOne({
        user: currentUser._id,
        isActive: true
      })
      if (!userCompany) {
        return res.status(403).json({
          success: false,
          message: 'No company found. Please create or join a company first.'
        })
      }
      targetCompanyId = userCompany.company
    }

    // Check if current user can create worker for this company
    const companyUser = await CompanyUser.findOne({
      company: targetCompanyId,
      user: currentUser._id,
      isActive: true
    }).populate('role')

    if (!companyUser) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add workers to this company'
      })
    }

    // Role-based permission check
    const userRole = companyUser.role?.name || currentUser.role
    
    // Define allowed roles for each user role
    const roleHierarchy = {
      'owner': ['owner', 'manager', 'group_leader', 'worker', 'sales_executive'],
      'manager': ['manager', 'group_leader', 'worker', 'sales_executive'],
      'group_leader': ['worker', 'sales_executive'],
      'worker': [] // Workers cannot create other workers
    }

    const allowedRoles = roleHierarchy[userRole] || []
    
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: `You are not authorized to create a worker with role: ${role}`
      })
    }

    // Check worker limit
    const company = await Company.findById(targetCompanyId)
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      })
    }

    const subscription = await Subscription.findOne({ company: targetCompanyId })
    const currentWorkerCount = await Worker.countDocuments({ 
      company: targetCompanyId, 
      status: 'active' 
    })

    if (subscription && currentWorkerCount >= subscription.workerLimit) {
      return res.status(400).json({
        success: false,
        message: `Worker limit reached. Current plan allows ${subscription.workerLimit} workers. Please upgrade your plan.`
      })
    }

    // Check if employee ID already exists for this company
    const existingEmployeeId = await Worker.findOne({ 
      company: targetCompanyId, 
      employeeId 
    })
    if (existingEmployeeId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID already exists for this company'
      })
    }

    // Check if email already exists in the system
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists'
      })
    }

    // Generate random password and password setup token
    const tempPassword = crypto.randomBytes(8).toString('hex') + 'A1!'
    const passwordSetupToken = generateRandomToken()
    const hashedPasswordSetupToken = crypto.createHash('sha256').update(passwordSetupToken).digest('hex')
    
    // Create user if doesn't exist
    let user = existingUser
    if (!user) {
      user = await User.create({
        name,
        email,
        phone,
        password: tempPassword,
        role: role || 'worker',
        resetPasswordToken: hashedPasswordSetupToken,
        resetPasswordExpires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      })

      // Send password setup email
      try {
        const passwordSetupLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${passwordSetupToken}`
        await sendWorkerPasswordSetupEmail({
          to: email,
          name,
          companyName: company.name,
          invitedBy: currentUser.name,
          role: role || 'worker',
          passwordSetupLink
        })
      } catch (emailError) {
        console.error('Password setup email failed:', emailError)
        // Continue even if email fails
      }
    }

    // Get role document for the worker
    const workerRole = await Role.findOne({
      company: targetCompanyId,
      name: role || 'worker'
    })

    // Add user to company with role
    const newCompanyUser = await CompanyUser.create({
      company: targetCompanyId,
      user: user._id,
      role: workerRole?._id || null,
      isActive: true,
      invitedBy: currentUser._id,
      invitationStatus: 'accepted'
    })

    // Create worker
    const worker = await Worker.create({
      company: targetCompanyId,
      user: user._id,
      employeeId,
      designation,
      department,
      role: role || 'worker',
      salary: {
        baseSalary: baseSalary || 0,
        overtimeRate: 0,
        bonus: 0
      },
      joiningDate: joiningDate || new Date()
    })

    res.status(201).json({
      success: true,
      worker: await Worker.findById(worker._id)
        .populate('user', 'name email phone')
        .populate('company', 'name')
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Invite worker via email
// @route   POST /api/workers/invite
// @access  Private (owner, manager, group_leader)
const inviteWorker = async (req, res, next) => {
  try {
    const { 
      companyId, 
      name, 
      email, 
      phone, 
      employeeId, 
      designation, 
      department, 
      baseSalary, 
      role 
    } = req.body

    const currentUser = req.user

    // If companyId not provided, use user's first active company
    let targetCompanyId = companyId
    if (!targetCompanyId) {
      const userCompany = await CompanyUser.findOne({
        user: currentUser._id,
        isActive: true
      })
      if (!userCompany) {
        return res.status(403).json({
          success: false,
          message: 'No company found. Please create or join a company first.'
        })
      }
      targetCompanyId = userCompany.company
    }

    // Check if current user can invite worker for this company
    const companyUser = await CompanyUser.findOne({
      company: targetCompanyId,
      user: currentUser._id,
      isActive: true
    }).populate('role')

    if (!companyUser) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to invite workers to this company'
      })
    }

    // Role-based permission check
    const userRole = companyUser.role?.name || currentUser.role
    
    const roleHierarchy = {
      'owner': ['owner', 'manager', 'group_leader', 'worker', 'sales_executive'],
      'manager': ['manager', 'group_leader', 'worker', 'sales_executive'],
      'group_leader': ['worker', 'sales_executive'],
      'worker': []
    }

    const allowedRoles = roleHierarchy[userRole] || []
    
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: `You are not authorized to invite a worker with role: ${role}`
      })
    }

    // Check worker limit
    const company = await Company.findById(targetCompanyId)
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      })
    }

    const subscription = await Subscription.findOne({ company: targetCompanyId })
    const currentWorkerCount = await Worker.countDocuments({ 
      company: targetCompanyId, 
      status: 'active' 
    })

    if (subscription && currentWorkerCount >= subscription.workerLimit) {
      return res.status(400).json({
        success: false,
        message: `Worker limit reached. Current plan allows ${subscription.workerLimit} workers. Please upgrade your plan.`
      })
    }

    // Check if employee ID already exists for this company
    const existingEmployeeId = await Worker.findOne({ 
      company: targetCompanyId, 
      employeeId 
    })
    if (existingEmployeeId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID already exists for this company'
      })
    }

    // Generate invitation token
    const invitationToken = crypto.randomBytes(32).toString('hex')
    const invitationExpires = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days

    // Check if user already exists
    // If a user with this email already exists anywhere, do not create or invite
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ success: false, message: 'A user with this email already exists' })
    }
    const isNewUser = !user

    if (!user) {
      // Create user with temporary password
      const tempPassword = crypto.randomBytes(8).toString('hex') + 'A1!'
      user = await User.create({
        name,
        email,
        phone,
        password: tempPassword,
        role: role || 'worker',
        isActive: false // User needs to complete registration
      })
    }

    // Get role document
    const workerRole = await Role.findOne({
      company: targetCompanyId,
      name: role || 'worker'
    })

    // Create invitation record
    const companyUserInvite = await CompanyUser.create({
      company: targetCompanyId,
      user: user._id,
      role: workerRole?._id || null,
      isActive: false,
      invitedBy: currentUser._id,
      invitationToken: crypto.createHash('sha256').update(invitationToken).digest('hex'),
      invitationExpires,
      invitationStatus: 'pending'
    })

    // Create worker record (inactive until registration complete)
    const worker = await Worker.create({
      company: targetCompanyId,
      user: user._id,
      employeeId,
      designation,
      department,
      role: role || 'worker',
      salary: {
        baseSalary: baseSalary || 0,
        overtimeRate: 0,
        bonus: 0
      },
      status: 'inactive',
      joiningDate: new Date()
    })

    // Send invitation email
    const inviteLink = `${process.env.FRONTEND_URL}/complete-registration/${invitationToken}`
    
    try {
      await sendWorkerInvitationEmail({
        to: email,
        name,
        companyName: company.name,
        invitedBy: currentUser.name,
        role: role || 'worker',
        inviteLink,
        isNewUser
      })
    } catch (emailError) {
      console.error('Failed to send invitation email:', emailError)
      // Continue anyway, but log the error
    }

    res.status(201).json({
      success: true,
      message: 'Worker invited successfully. An email has been sent with registration instructions.',
      worker: await Worker.findById(worker._id)
        .populate('user', 'name email phone')
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Complete worker registration
// @route   POST /api/workers/complete-registration/:token
// @access  Public
const completeWorkerRegistration = async (req, res, next) => {
  try {
    const { token } = req.params
    const { password } = req.body

    // Validation
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      })
    }

    // Hash token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    // Find invitation
    const companyUser = await CompanyUser.findOne({
      invitationToken: hashedToken,
      invitationExpires: { $gt: Date.now() },
      invitationStatus: 'pending'
    }).populate('user company')

    if (!companyUser) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired invitation token'
      })
    }

    // Update user
    const user = companyUser.user
    user.password = password
    user.isActive = true
    user.isEmailVerified = true
    await user.save()

    // Update company user
    companyUser.isActive = true
    companyUser.invitationStatus = 'accepted'
    companyUser.invitationToken = undefined
    companyUser.invitationExpires = undefined
    await companyUser.save()

    // Update worker status
    await Worker.findOneAndUpdate(
      { user: user._id, company: companyUser.company._id },
      { status: 'active' }
    )

    // Generate auth token
    const { generateToken } = require('../config/auth')
    const authToken = generateToken(user._id)

    res.json({
      success: true,
      message: 'Registration completed successfully!',
      token: authToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all workers
// @route   GET /api/workers
// @access  Private
const getWorkers = async (req, res, next) => {
  try {
    const { companyId, page = 1, limit = 10, status, role, search } = req.query
    const { skip, limit: limitNum } = paginate(page, limit)

    // Get current user's role in the company
    const currentUser = req.user
    
    // If companyId not provided, use user's first active company
    let targetCompanyId = companyId
    if (!targetCompanyId) {
      const userCompany = await CompanyUser.findOne({
        user: currentUser._id,
        isActive: true
      })
      if (userCompany) {
        targetCompanyId = userCompany.company
      }
    }
    
    let query = {}
    if (targetCompanyId) {
      query.company = targetCompanyId
    } else {
      // If no companyId, get user's companies
      const companyUsers = await CompanyUser.find({
        user: currentUser._id,
        isActive: true
      })
      const companyIds = companyUsers.map(cu => cu.company)
      if (companyIds.length > 0) {
        query.company = { $in: companyIds }
      } else {
        // No companies - return empty result
        return res.json({
          success: true,
          count: 0,
          total: 0,
          workers: [],
          page: parseInt(page),
          totalPages: 0
        })
      }
    }

    if (status) query.status = status
    if (role) query.role = role

    // Apply search filter
    if (search) {
      query.$or = [
        { employeeId: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } }
      ]
    }

    const workers = await Worker.find(query)
      .populate({
        path: 'user',
        select: 'name email phone profileImage',
        match: search ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } }
          ]
        } : {}
      })
      .populate('company', 'name')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 })

    // Filter out workers where user is null (due to search)
    const filteredWorkers = workers.filter(worker => worker.user)

    const total = await Worker.countDocuments(query)

    res.json({
      success: true,
      count: filteredWorkers.length,
      total,
      workers: filteredWorkers,
      page: parseInt(page),
      totalPages: Math.ceil(total / limitNum)
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Check worker availability (email or employeeId)
// @route   GET /api/workers/check
// @access  Private
const checkWorkerAvailability = async (req, res, next) => {
  try {
    const { companyId, email, employeeId } = req.query
    const mongoose = require('mongoose')
    const currentUser = req.user

    // If companyId not provided, use current user's company
    let targetCompanyId = companyId
    if (!targetCompanyId) {
      const userCompany = await CompanyUser.findOne({
        user: currentUser._id,
        isActive: true
      })
      if (userCompany) {
        targetCompanyId = userCompany.company
      }
    }

    if (!targetCompanyId || !mongoose.isValidObjectId(targetCompanyId)) {
      return res.status(400).json({ success: false, message: 'Company not found. Please create or join a company first.' })
    }

    const result = {
      existsEmail: false,
      existsEmployeeId: false
    }

    if (email) {
      const user = await User.findOne({ email })
      result.existsEmail = !!user
    }

    if (employeeId) {
      const worker = await Worker.findOne({ company: targetCompanyId, employeeId })
      result.existsEmployeeId = !!worker
    }

    res.json({ success: true, ...result })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single worker
// @route   GET /api/workers/:id
// @access  Private
const getWorker = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.params.id)
      .populate('user', 'name email phone profileImage')
      .populate('company', 'name')
      .populate({
        path: 'company',
        populate: {
          path: 'users',
          select: 'name email role'
        }
      })

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
// @access  Private (owner, manager, group_leader)
const updateWorker = async (req, res, next) => {
  try {
    let worker = await Worker.findById(req.params.id)

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      })
    }

    // Check permission
    const currentUser = req.user
    const companyUser = await CompanyUser.findOne({
      company: worker.company,
      user: currentUser._id,
      isActive: true
    }).populate('role')

    if (!companyUser) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this worker'
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
// @access  Private (owner, manager)
const deleteWorker = async (req, res, next) => {
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

    // Also deactivate company user
    await CompanyUser.findOneAndUpdate(
      { company: worker.company, user: worker.user },
      { isActive: false }
    )

    res.json({
      success: true,
      message: 'Worker deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

// Export all functions
module.exports = {
  createWorker,
  createWorkerWithPasswordSetup,
  inviteWorker,
  completeWorkerRegistration,
  getWorkers,
  checkWorkerAvailability,
  getWorker,
  updateWorker,
  deleteWorker
}