const CompanyUser = require('../models/CompanyUser')
const Role = require('../models/Role')

// Check if user has access to company
const checkCompanyAccess = async (req, res, next) => {
  try {
    const companyId = req.params.companyId || req.body.company || req.query.company
    
    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: 'Company ID is required'
      })
    }

    const companyUser = await CompanyUser.findOne({
      company: companyId,
      user: req.user._id,
      isActive: true
    }).populate('role')

    if (!companyUser) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this company'
      })
    }

    req.companyUser = companyUser
    req.companyId = companyId
    next()
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking company access'
    })
  }
}

// Check if user has specific permission
const checkPermission = (permission) => {
  return async (req, res, next) => {
    try {
      // Admin has all permissions
      if (req.user.role === 'admin') {
        return next()
      }

      // Company owner has all permissions
      if (req.user.role === 'owner') {
        return next()
      }

      // Check role permissions
      if (req.companyUser && req.companyUser.role) {
        const role = await Role.findById(req.companyUser.role)
        
        if (role && role.permissions) {
          const [module, action] = permission.split('.')
          
          if (role.permissions[module] && role.permissions[module][action]) {
            return next()
          }
        }
      }

      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action'
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error checking permissions'
      })
    }
  }
}

module.exports = {
  checkCompanyAccess,
  checkPermission
}

