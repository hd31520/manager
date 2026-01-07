const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Group name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Indexes
groupSchema.index({ company: 1, name: 1 }, { unique: true })
groupSchema.index({ company: 1 })

module.exports = mongoose.model('Group', groupSchema)

