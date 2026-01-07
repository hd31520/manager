const mongoose = require('mongoose')

const inventorySchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  type: {
    type: String,
    enum: ['in', 'out', 'transfer', 'adjustment', 'return'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  previousQuantity: {
    type: Number,
    default: 0
  },
  newQuantity: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    trim: true
  },
  reference: {
    type: String,
    trim: true
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId
  },
  location: {
    from: String,
    to: String
  },
  performedBy: {
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
inventorySchema.index({ company: 1, product: 1 })
inventorySchema.index({ company: 1, createdAt: -1 })
inventorySchema.index({ type: 1 })

module.exports = mongoose.model('Inventory', inventorySchema)

