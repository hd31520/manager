const User = require('../models/User')
const { generateToken } = require('../config/auth')
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../services/emailService')
const { generateToken: generateRandomToken } = require('../utils/helpers')
const crypto = require('crypto')

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body

    // Validation
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
        message: 'User already exists with this email'
      })
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: role || 'owner'
    })

    // Generate email verification token
    const verificationToken = generateRandomToken()
    user.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex')
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    await user.save()

    // Send welcome email WITH verification token
    try {
      await sendWelcomeEmail(user, verificationToken)
    } catch (error) {
      console.error('Email sending failed:', error)
      // Don't fail registration if email fails
    }

    // Generate authentication token
    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      token,
      message: 'Registration successful! Please check your email to verify your account.',
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

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      })
    }

    // Check user
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Check if email is verified. Make this optional via env var
    // Set REQUIRE_EMAIL_VERIFICATION=true to enforce email verification before login
    const requireEmailVerification = process.env.REQUIRE_EMAIL_VERIFICATION === 'true'
    if (requireEmailVerification && !user.isEmailVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email address before logging in',
        requiresVerification: true
      })
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive. Please contact administrator'
      })
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate token
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

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)

    res.json({
      success: true,
      user
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      // Don't reveal that user doesn't exist for security
      return res.json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link'
      })
    }

    // Generate reset token
    const resetToken = generateRandomToken()
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000 // 1 hour
    await user.save()

    // Send email
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

    res.json({
      success: true,
      message: 'Password reset email sent'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res, next) => {
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

    // Find user
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

    // Set new password
    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    res.json({
      success: true,
      message: 'Password has been reset successfully'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    // Validation
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

    // Check current password
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      })
    }

    // Check if new password is different
    const isSamePassword = await user.comparePassword(newPassword)
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password'
      })
    }

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

// @desc    Verify email address
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params

    // Hash token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    // Find user
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

    // Mark email as verified
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

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
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

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      })
    }

    // Generate new verification token
    const verificationToken = generateRandomToken()
    user.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex')
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    await user.save()

    // Send verification email
    try {
      await sendWelcomeEmail(user, verificationToken)
      res.json({
        success: true,
        message: 'Verification email sent successfully'
      })
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

// @desc    Logout user (client-side should remove token)
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    // Note: Since JWT is stateless, we don't need to do anything server-side
    // Client should remove the token from storage
    res.json({
      success: true,
      message: 'Logged out successfully'
    })
  } catch (error) {
    next(error)
  }
}