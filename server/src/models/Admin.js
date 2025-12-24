const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  permissions: {
    users: {
      view: { type: Boolean, default: true },
      create: { type: Boolean, default: true },
      update: { type: Boolean, default: true },
      delete: { type: Boolean, default: true }
    },
    companies: {
      view: { type: Boolean, default: true },
      create: { type: Boolean, default: true },
      update: { type: Boolean, default: true },
      delete: { type: Boolean, default: true },
      suspend: { type: Boolean, default: true }
    },
    subscriptions: {
      view: { type: Boolean, default: true },
      manage: { type: Boolean, default: true }
    },
    settings: {
      view: { type: Boolean, default: true },
      update: { type: Boolean, default: true }
    },
    reports: {
      view: { type: Boolean, default: true },
      generate: { type: Boolean, default: true }
    }
  },
  isSuperAdmin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Admin', adminSchema)

