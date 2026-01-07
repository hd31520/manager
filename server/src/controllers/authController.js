const User = require('../models/User')
const Company = require('../models/Company')
const CompanyUser = require('../models/CompanyUser')
const Subscription = require('../models/Subscription')
const Role = require('../models/Role')
const { generateToken } = require('../config/auth')
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../services/emailService')
const { generateToken: generateRandomToken } = require('../utils/helpers')
const { SUBSCRIPTION_PLANS } = require('../config/payments')
const crypto = require('crypto')

// @desc    Register user WITHOUT auto-creating company
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body

    console.log('Registration attempt for:', { name, email, phone: phone || 'none', role: role || 'default' })

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      })
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      })
    }

    // Password strength validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      })
    }

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
        field: 'email'
      })
    }

    console.log('Creating user...')

    // Create user WITHOUT auto-creating company
    const userData = {
      name,
      email,
      phone: phone || '',
      password,
      role: role || 'owner'
    }

    console.log('User data:', { ...userData, password: '[HIDDEN]' })

    const user = await User.create(userData)

    console.log('User created successfully:', user._id)

    // Generate email verification token
    const verificationToken = generateRandomToken()
    user.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex')
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    await user.save()

    console.log('Verification token generated')

    // Send welcome email WITH verification token
    try {
      await sendWelcomeEmail(user, verificationToken)
      console.log('Welcome email sent')
    } catch (error) {
      console.error('Email sending failed:', error)
      // Don't fail registration if email fails
    }

    // Generate authentication token
    const token = generateToken(user._id)

    console.log('Registration successful for:', email)

    res.status(201).json({
      success: true,
      token,
      message: 'Registration successful! Please verify your email and then create or join a company.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        requiresCompany: true // Indicate that user needs to create/join company
      }
    })
  } catch (error) {
    console.error('REGISTRATION ERROR DETAILS:')
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error code:', error.code)
    
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', error.errors)
      const messages = Object.values(error.errors).map(val => val.message)
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      })
    }
    
    if (error.code === 11000) {
      console.error('Duplicate key error:', error.keyValue)
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      })
    }
    
    console.error('Full error stack:', error.stack)

    res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again.'
    })
  }
}

// @desc    Set password for worker
exports.setPassword = async (req, res, next) => {
  try {
    const { token } = req.params
    const { password } = req.body

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      })
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    }).select('+resetPasswordToken +resetPasswordExpires')

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password setup token'
      })
    }

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    user.requiresPasswordSetup = false
    user.isActive = true
    user.isEmailVerified = true
    
    await user.save()

    const authToken = generateToken(user._id)

    res.json({
      success: true,
      message: 'Password set successfully! You can now log in.',
      token: authToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Set password error:', error)
    next(error)
  }
}

// @desc    Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      })
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    if (user.requiresPasswordSetup) {
      return res.status(401).json({
        success: false,
        message: 'Please set your password first using the link sent to your email',
        requiresPasswordSetup: true
      })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    const requireEmailVerification = process.env.REQUIRE_EMAIL_VERIFICATION === 'true'
    if (requireEmailVerification && !user.isEmailVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email address before logging in',
        requiresVerification: true
      })
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive. Please contact administrator'
      })
    }

    user.lastLogin = new Date()
    await user.save()

    const token = generateToken(user._id)

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    })
  } catch (error) {
    next(error)
  }
}

// Other functions remain the same...
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    res.json({ success: true, user })
  } catch (error) {
    next(error)
  }
}

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    
    if (!user) {
      return res.json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link'
      })
    }

    const resetToken = generateRandomToken()
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000
    await user.save()

    try {
      await sendPasswordResetEmail(user, resetToken)
    } catch (error) {
      user.resetPasswordToken = undefined
      user.resetPasswordExpires = undefined
      await user.save()
      return res.status(500).json({
        success: false,
        message: 'Email could not be sent. Please try again later.'
      })
    }

    res.json({ success: true, message: 'Password reset email sent' })
  } catch (error) {
    next(error)
  }
}

exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params
    const { password } = req.body

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      })
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      })
    }

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    res.json({ success: true, message: 'Password has been reset successfully' })
  } catch (error) {
    next(error)
  }
}

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
        message: 'New password must be at least 6 characters'
      })
    }

    const user = await User.findById(req.user._id).select('+password')
    const isMatch = await user.comparePassword(currentPassword)
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      })
    }

    const isSamePassword = await user.comparePassword(newPassword)
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password'
      })
    }

    user.password = newPassword
    await user.save()

    res.json({ success: true, message: 'Password updated successfully' })
  } catch (error) {
    next(error)
  }
}

exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      })
    }

    user.isEmailVerified = true
    user.emailVerificationToken = undefined
    user.emailVerificationExpires = undefined
    await user.save()

    res.json({
      success: true,
      message: 'Email verified successfully! You can now log in to your account.'
    })
  } catch (error) {
    next(error)
  }
}

exports.resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      })
    }

    const verificationToken = generateRandomToken()
    user.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex')
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000
    await user.save()

    try {
      await sendWelcomeEmail(user, verificationToken)
      res.json({ success: true, message: 'Verification email sent successfully' })
    } catch (error) {
      console.error('Email sending failed:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again later.'
      })
    }
  } catch (error) {
    next(error)
  }
}

exports.logout = async (req, res, next) => {
  try {
    res.json({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    next(error)
  }
}