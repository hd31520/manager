const mongoose = require('mongoose')

const workerSchema = new mongoose.Schema({
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
  employeeId: {
    type: String,
    required: true,
    trim: true
  },
  designation: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  salary: {
    baseSalary: {
      type: Number,
      required: true,
      default: 0
    },
    overtimeRate: {
      type: Number,
      default: 0
    },
    bonus: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'BDT'
    }
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'terminated', 'on_leave'],
    default: 'active'
  },
  personalInfo: {
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    nid: String,
    emergencyContact: {
      name: String,
      phone: String,
      relation: String
    }
  },
  address: {
    street: String,
    city: String,
    district: String,
    postalCode: String
  }
}, {
  timestamps: true
})

// Indexes
workerSchema.index({ company: 1, employeeId: 1 }, { unique: true })
workerSchema.index({ company: 1 })
workerSchema.index({ user: 1 })

module.exports = mongoose.model('Worker', workerSchema)

