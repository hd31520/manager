const mongoose = require('mongoose')

const memoSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  memoNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  customerName: {
    type: String,
    trim: true
  },
  customerPhone: {
    type: String,
    trim: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    name: String,
    quantity: {
      type: Number,
      required: true
    },
    unitPrice: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  }],
  subtotal: {
    type: Number,
    required: true,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true,
    default: 0
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  dueAmount: {
    type: Number,
    default: 0
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'mobile_banking', 'bank_transfer', 'due'],
    default: 'cash'
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'partial', 'cancelled'],
    default: 'pending'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
})

// Indexes
memoSchema.index({ company: 1, memoNumber: 1 }, { unique: true })
memoSchema.index({ company: 1, createdAt: -1 })
memoSchema.index({ customer: 1 })
memoSchema.index({ status: 1 })

// Generate memo number before saving
memoSchema.pre('save', async function(next) {
  if (!this.memoNumber) {
    const count = await mongoose.model('Memo').countDocuments({ company: this.company })
    this.memoNumber = `MEMO-${this.company.toString().slice(-6)}-${Date.now().toString().slice(-6)}-${String(count + 1).padStart(4, '0')}`
  }
  next()
})

module.exports = mongoose.model('Memo', memoSchema)

