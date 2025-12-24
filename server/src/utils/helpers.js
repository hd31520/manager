const crypto = require('crypto')

// Generate random token
const generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex')
}

// Format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Format currency
const formatCurrency = (amount, currency = 'BDT') => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

// Calculate pagination
const paginate = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit
  return { skip, limit }
}

// Get date range for month
const getMonthRange = (month, year) => {
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0)
  return { startDate, endDate }
}

// Generate unique ID
const generateUniqueId = (prefix = '') => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 9)
  return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`
}

// Validate email
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Validate phone (Bangladesh)
const isValidPhone = (phone) => {
  const re = /^(\+88|88)?01[3-9]\d{8}$/
  return re.test(phone.replace(/\s/g, ''))
}

module.exports = {
  generateToken,
  formatDate,
  formatCurrency,
  paginate,
  getMonthRange,
  generateUniqueId,
  isValidEmail,
  isValidPhone
}

