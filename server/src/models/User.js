const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  nid: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'owner', 'manager', 'group_leader', 'worker', 'sales_executive'],
    default: 'worker'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  requiresPasswordSetup: {
    type: Boolean,
    default: false
  },
  profileImage: {
    type: String,
    default: ''
  },
  emailVerificationToken: {
    type: String,
    select: false
  },
  resetPasswordToken: {
    type: String,
    select: false
  },
  resetPasswordExpires: {
    type: Date,
    select: false
  },
  lastLogin: {
    type: Date
  },
  notificationSettings: {
    email: {
      newOrders: {
        type: Boolean,
        default: true
      },
      promotions: {
        type: Boolean,
        default: true
      },
      security: {
        type: Boolean,
        default: true
      }
    },
    push: {
      newOrders: {
        type: Boolean,
        default: true
      },
      promotions: {
        type: Boolean,
        default: false
      },
      security: {
        type: Boolean,
        default: true
      }
    }
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  }
}, {
  timestamps: true
})

// FIXED: Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    // If next is provided, call it, otherwise return
    if (typeof next === 'function') {
      return next()
    }
    return
  }

  try {
    // Only hash if password exists and is not empty
    if (this.password && this.password.trim()) {
      const salt = await bcrypt.genSalt(10)
      this.password = await bcrypt.hash(this.password, salt)
    }
    
    if (typeof next === 'function') {
      next()
    }
  } catch (error) {
    if (typeof next === 'function') {
      next(error)
    } else {
      throw error
    }
  }
})

// SIMPLER VERSION - Use this if above doesn't work:
// userSchema.pre('save', async function() {
//   if (!this.isModified('password')) return
//   
//   if (this.password && this.password.trim()) {
//     const salt = await bcrypt.genSalt(10)
//     this.password = await bcrypt.hash(this.password, salt)
//   }
// })

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  // If user doesn't have password yet (worker needs to set it)
  if (!this.password) {
    return false
  }
  return await bcrypt.compare(candidatePassword, this.password)
}

// Remove sensitive fields from JSON output
userSchema.methods.toJSON = function() {
  const obj = this.toObject()
  delete obj.password
  delete obj.emailVerificationToken
  delete obj.resetPasswordToken
  delete obj.resetPasswordExpires
  return obj
}

// Virtual for formatted join date
userSchema.virtual('joinDateFormatted').get(function() {
  return this.createdAt ? new Date(this.createdAt).toLocaleDateString() : 'Unknown'
})

// Virtual for last login formatted
userSchema.virtual('lastLoginFormatted').get(function() {
  return this.lastLogin ? new Date(this.lastLogin).toLocaleDateString() : 'Never'
})

module.exports = mongoose.model('User', userSchema)