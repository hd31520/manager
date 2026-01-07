const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Role name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  permissions: {
    // Worker Management
    workers: {
      view: { type: Boolean, default: false },
      create: { type: Boolean, default: false },
      update: { type: Boolean, default: false },
      delete: { type: Boolean, default: false }
    },
    // Product Management
    products: {
      view: { type: Boolean, default: false },
      create: { type: Boolean, default: false },
      update: { type: Boolean, default: false },
      delete: { type: Boolean, default: false }
    },
    // Inventory Management
    inventory: {
      view: { type: Boolean, default: false },
      update: { type: Boolean, default: false },
      transfer: { type: Boolean, default: false }
    },
    // Sales Management
    sales: {
      view: { type: Boolean, default: false },
      create: { type: Boolean, default: false },
      update: { type: Boolean, default: false },
      delete: { type: Boolean, default: false }
    },
    // Customer Management
    customers: {
      view: { type: Boolean, default: false },
      create: { type: Boolean, default: false },
      update: { type: Boolean, default: false },
      delete: { type: Boolean, default: false }
    },
    // Salary Management
    salary: {
      view: { type: Boolean, default: false },
      calculate: { type: Boolean, default: false },
      pay: { type: Boolean, default: false }
    },
    // Reports
    reports: {
      view: { type: Boolean, default: false },
      generate: { type: Boolean, default: false },
      export: { type: Boolean, default: false }
    },
    // Company Settings
    settings: {
      view: { type: Boolean, default: false },
      update: { type: Boolean, default: false }
    }
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Indexes
roleSchema.index({ company: 1, name: 1 }, { unique: true })

module.exports = mongoose.model('Role', roleSchema)

