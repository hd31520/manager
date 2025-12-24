const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  address: {
    street: String,
    city: String,
    district: String,
    postalCode: String
  },
  customerType: {
    type: String,
    enum: ['retail', 'wholesale', 'corporate', 'walk_in'],
    default: 'retail'
  },
  creditLimit: {
    type: Number,
    default: 0
  },
  dueAmount: {
    type: Number,
    default: 0
  },
  totalPurchases: {
    type: Number,
    default: 0
  },
  lastPurchaseDate: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Indexes
customerSchema.index({ company: 1, phone: 1 })
customerSchema.index({ company: 1 })
customerSchema.index({ phone: 1 })

module.exports = mongoose.model('Customer', customerSchema)

