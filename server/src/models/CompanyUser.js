const mongoose = require('mongoose')

const companyUserSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  permissions: [{
    type: String
  }],
  joinedDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  salary: {
    baseSalary: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'BDT'
    }
  }
}, {
  timestamps: true
})

// Indexes
companyUserSchema.index({ company: 1, user: 1 }, { unique: true })
companyUserSchema.index({ company: 1 })
companyUserSchema.index({ user: 1 })

module.exports = mongoose.model('CompanyUser', companyUserSchema)

