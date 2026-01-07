const mongoose = require('mongoose')

const subscriptionSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    unique: true
  },
  plan: {
    type: String,
    enum: ['basic', 'standard', 'premium', 'enterprise'],
    required: true,
    default: 'basic'
  },
  workerLimit: {
    type: Number,
    required: true,
    default: 10
  },
  monthlyFee: {
    type: Number,
    required: true,
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
  endDate: Date,
  nextBillingDate: {
    type: Date,
    required: true
  },
  paymentHistory: [{
    amount: Number,
    date: Date,
    transactionId: String,
    method: String,
    status: {
      type: String,
      enum: ['pending', 'success', 'failed', 'refunded']
    }
  }],
  autoRenew: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Indexes
subscriptionSchema.index({ company: 1 }, { unique: true })
subscriptionSchema.index({ status: 1 })
subscriptionSchema.index({ nextBillingDate: 1 })

module.exports = mongoose.model('Subscription', subscriptionSchema)

