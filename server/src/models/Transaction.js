const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense', 'salary', 'subscription', 'refund'],
    required: true
  },
  category: {
    type: String,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'BDT'
  },
  description: {
    type: String,
    trim: true
  },
  reference: {
    type: String,
    enum: ['order', 'memo', 'salary', 'subscription', 'other'],
    default: 'other'
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'mobile_banking', 'bank_transfer', 'cheque'],
    default: 'cash'
  },
  transactionId: {
    type: String,
    trim: true
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Indexes
transactionSchema.index({ company: 1, date: -1 })
transactionSchema.index({ company: 1, type: 1 })
transactionSchema.index({ referenceId: 1 })

module.exports = mongoose.model('Transaction', transactionSchema)

