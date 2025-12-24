const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitPrice: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
      default: 0
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
    type: {
      type: String,
      enum: ['percentage', 'fixed']
    },
    value: {
      type: Number,
      default: 0
    },
    amount: {
      type: Number,
      default: 0
    }
  },
  tax: {
    rate: {
      type: Number,
      default: 0
    },
    amount: {
      type: Number,
      default: 0
    }
  },
  shipping: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true,
    default: 0
  },
  payment: {
    method: {
      type: String,
      enum: ['cash', 'card', 'mobile_banking', 'bank_transfer', 'due'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'partial', 'refunded'],
      default: 'pending'
    },
    paidAmount: {
      type: Number,
      default: 0
    },
    dueAmount: {
      type: Number,
      default: 0
    },
    transactionId: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  orderType: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline'
  },
  delivery: {
    address: {
      street: String,
      city: String,
      district: String,
      postalCode: String
    },
    date: Date,
    notes: String
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
orderSchema.index({ company: 1, orderNumber: 1 }, { unique: true })
orderSchema.index({ company: 1, createdAt: -1 })
orderSchema.index({ customer: 1 })
orderSchema.index({ status: 1 })

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments({ company: this.company })
    this.orderNumber = `ORD-${this.company.toString().slice(-6)}-${Date.now().toString().slice(-6)}-${String(count + 1).padStart(4, '0')}`
  }
  next()
})

module.exports = mongoose.model('Order', orderSchema)

