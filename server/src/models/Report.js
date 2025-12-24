const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  type: {
    type: String,
    enum: ['daily_sales', 'monthly_sales', 'salary', 'inventory', 'profit_loss', 'attendance', 'custom'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  period: {
    startDate: Date,
    endDate: Date
  },
  data: {
    type: mongoose.Schema.Types.Mixed
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileUrl: {
    type: String
  },
  format: {
    type: String,
    enum: ['pdf', 'excel', 'csv'],
    default: 'pdf'
  }
}, {
  timestamps: true
})

// Indexes
reportSchema.index({ company: 1, createdAt: -1 })
reportSchema.index({ type: 1 })

module.exports = mongoose.model('Report', reportSchema)

