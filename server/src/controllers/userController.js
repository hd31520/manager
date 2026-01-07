const User = require('../models/User')
const CompanyUser = require('../models/CompanyUser')
const bcrypt = require('bcryptjs')

// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -emailVerificationToken -resetPasswordToken -resetPasswordExpires')
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Format user data for frontend
    const formattedUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      bio: user.bio,
      nid: user.nid,
      role: user.role,
      profileImage: user.profileImage,
      avatar: user.profileImage, // For backward compatibility
      company: user.company,
      emailVerified: user.isEmailVerified,
      phoneVerified: user.isPhoneVerified,
      lastLogin: user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never',
      joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown',
      isActive: user.isActive,
      notificationSettings: user.notificationSettings || {
        email: {
          newOrders: true,
          promotions: true,
          security: true
        },
        push: {
          newOrders: true,
          promotions: false,
          security: true
        }
      }
    }

    res.json({
      success: true,
      user: formattedUser
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address, bio, nid, profileImage } = req.body

    // Build update object
    const updateData = {}
    if (name !== undefined) updateData.name = name.trim()
    if (phone !== undefined) updateData.phone = phone ? phone.trim() : ''
    if (address !== undefined) updateData.address = address ? address.trim() : ''
    if (bio !== undefined) updateData.bio = bio ? bio.trim() : ''
    if (nid !== undefined) updateData.nid = nid ? nid.trim() : ''
    if (profileImage !== undefined) updateData.profileImage = profileImage

    // Validate required fields
    if (updateData.name !== undefined && updateData.name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      })
    }

    // Validate NID format if provided
    if (updateData.nid && !/^\d{10,17}$/.test(updateData.nid)) {
      return res.status(400).json({
        success: false,
        message: 'NID must be 10-17 digits'
      })
    }

    // Validate phone format if provided
    if (updateData.phone && !/^\+?[\d\s-]{10,}$/.test(updateData.phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid phone number'
      })
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -emailVerificationToken -resetPasswordToken -resetPasswordExpires')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update user password
// @route   PUT /api/users/me/password
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      })
    }

    // Get user with password
    const user = await User.findById(req.user._id).select('+password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.json({
      success: true,
      message: 'Password updated successfully'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get notification settings
// @route   GET /api/users/me/notifications
// @access  Private
exports.getNotificationSettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('notificationSettings')
    
    // Default notification settings
    const defaultSettings = {
      email: {
        newOrders: true,
        promotions: true,
        security: true
      },
      push: {
        newOrders: true,
        promotions: false,
        security: true
      }
    }

    const settings = user.notificationSettings || defaultSettings

    res.json({
      success: true,
      settings
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update notification settings
// @route   PUT /api/users/me/notifications
// @access  Private
exports.updateNotificationSettings = async (req, res, next) => {
  try {
    const { settings } = req.body

    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid notification settings'
      })
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { notificationSettings: settings },
      { new: true }
    ).select('notificationSettings')

    res.json({
      success: true,
      message: 'Notification settings updated',
      settings: user.notificationSettings
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get user companies
// @route   GET /api/users/companies
// @access  Private
exports.getUserCompanies = async (req, res, next) => {
  try {
    const companyUsers = await CompanyUser.find({
      user: req.user._id,
      isActive: true
    }).populate('company', 'name businessType logo')

    const companies = companyUsers.map(cu => ({
      id: cu.company._id,
      name: cu.company.name,
      businessType: cu.company.businessType,
      logo: cu.company.logo,
      userRole: cu.role
    }))

    res.json({
      success: true,
      companies
    })
  } catch (error) {
    next(error)
  }
}