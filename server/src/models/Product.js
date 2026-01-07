const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  sku: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  barcode: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  images: [{
    type: String
  }],
  price: {
    selling: {
      type: Number,
      required: true,
      default: 0
    },
    cost: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'BDT'
    }
  },
  inventory: {
    quantity: {
      type: Number,
      default: 0
    },
    minStock: {
      type: Number,
      default: 0
    },
    maxStock: {
      type: Number
    },
    unit: {
      type: String,
      default: 'pcs'
    },
    location: {
      type: String,
      trim: true
    }
  },
  supplier: {
    name: String,
    contact: String
  },
  batch: {
    number: String,
    manufacturingDate: Date,
    expiryDate: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
})

// Indexes
productSchema.index({ company: 1, sku: 1 }, { unique: true })
productSchema.index({ company: 1 })
productSchema.index({ barcode: 1 })
productSchema.index({ 'inventory.quantity': 1 })

module.exports = mongoose.model('Product', productSchema)

