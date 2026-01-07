const mongoose = require('mongoose')

const attendanceSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: true
  },
  checkIn: {
    time: Date,
    location: String,
    method: {
      type: String,
      enum: ['manual', 'biometric', 'qr', 'mobile'],
      default: 'manual'
    }
  },
  checkOut: {
    time: Date,
    location: String,
    method: {
      type: String,
      enum: ['manual', 'biometric', 'qr', 'mobile'],
      default: 'manual'
    }
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'half_day', 'holiday', 'leave'],
    default: 'absent'
  },
  workingHours: {
    type: Number,
    default: 0
  },
  overtimeHours: {
    type: Number,
    default: 0
  },
  leaveType: {
    type: String,
    enum: ['sick', 'casual', 'annual', 'unpaid', 'other']
  },
  notes: {
    type: String,
    trim: true
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

// Indexes
attendanceSchema.index({ company: 1, worker: 1, date: 1 }, { unique: true })
attendanceSchema.index({ company: 1, date: 1 })
attendanceSchema.index({ worker: 1, date: -1 })

module.exports = mongoose.model('Attendance', attendanceSchema)

