const mongoose = require('mongoose')

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  businessType: {
    type: String,
    enum: ['factory', 'shop', 'showroom'],
    required: [true, 'Business type is required']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    district: String,
    postalCode: String,
    country: {
      type: String,
      default: 'Bangladesh'
    }
  },
  logo: {
    type: String
  },
  subscription: {
    plan: {
      type: String,
      enum: ['basic', 'standard', 'premium', 'enterprise'],
      default: 'basic'
    },
    workerLimit: {
      type: Number,
      default: 10
    },
    monthlyFee: {
      type: Number,
      default: 200
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'cancelled', 'expired'],
      default: 'active'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    },
    nextBillingDate: {
      type: Date
    }
  },
  settings: {
    currency: {
      type: String,
      default: 'BDT'
    },
    language: {
      type: String,
      enum: ['en', 'bn'],
      default: 'en'
    },
    timezone: {
      type: String,
      default: 'Asia/Dhaka'
    },
    allowGroups: {
      type: Boolean,
      default: false
    },
    requireManager: {
      type: Boolean,
      default: false
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Indexes
companySchema.index({ owner: 1 })
companySchema.index({ 'subscription.status': 1 })

module.exports = mongoose.model('Company', companySchema)

