const mongoose = require('mongoose')

const salarySchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  baseSalary: {
    type: Number,
    required: true,
    default: 0
  },
  attendance: {
    presentDays: {
      type: Number,
      default: 0
    },
    absentDays: {
      type: Number,
      default: 0
    },
    lateDays: {
      type: Number,
      default: 0
    },
    workingHours: {
      type: Number,
      default: 0
    }
  },
  earnings: {
    overtime: {
      hours: { type: Number, default: 0 },
      rate: { type: Number, default: 0 },
      amount: { type: Number, default: 0 }
    },
    bonus: {
      type: Number,
      default: 0
    },
    allowance: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  },
  deductions: {
    advance: {
      type: Number,
      default: 0
    },
    penalty: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    other: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  },
  netSalary: {
    type: Number,
    required: true,
    default: 0
  },
  payment: {
    status: {
      type: String,
      enum: ['pending', 'paid', 'partial', 'cancelled'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['cash', 'bank', 'mobile_banking']
    },
    paidAmount: {
      type: Number,
      default: 0
    },
    paidDate: Date,
    transactionId: String,
    notes: String
  },
  calculatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

// Indexes
salarySchema.index({ company: 1, worker: 1, month: 1, year: 1 }, { unique: true })
salarySchema.index({ company: 1, month: 1, year: 1 })
salarySchema.index({ worker: 1, year: -1, month: -1 })

module.exports = mongoose.model('Salary', salarySchema)

