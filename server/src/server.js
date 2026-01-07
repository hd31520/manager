// server.js - UPDATED VERSION
const path = require('path')

// ========== LOAD ENVIRONMENT VARIABLES FIRST ==========
// This MUST be at the VERY TOP, before any other imports

console.log('=== LOADING ENVIRONMENT ===')
console.log('Current directory:', process.cwd())

// Try to load .env file
require('dotenv').config({ 
  path: path.join(process.cwd(), '.env'),
  debug: true // This will show what's being loaded
})

// Check if environment variables are loaded
console.log('\n=== ENVIRONMENT CHECK ===')
console.log('SMTP_HOST:', process.env.SMTP_HOST || '❌ NOT SET')
console.log('SMTP_PORT:', process.env.SMTP_PORT || '❌ NOT SET')
console.log('SMTP_USER:', process.env.SMTP_USER || '❌ NOT SET')
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '✓ Set' : '❌ NOT SET')
console.log('FRONTEND_URL:', process.env.FRONTEND_URL || '❌ NOT SET')
console.log('APP_NAME:', process.env.APP_NAME || '❌ NOT SET')
console.log('PORT:', process.env.PORT || '5000 (default)')
console.log('NODE_ENV:', process.env.NODE_ENV || 'development (default)')

// If critical variables are missing, log warning but don't exit
if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.warn('\n⚠️  WARNING: Email configuration is incomplete!')
  console.warn('   Emails will be logged to console instead of sent.')
  console.warn('   Please check your .env file has:')
  console.warn('   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS')
}
// ========== END ENVIRONMENT LOADING ==========

// NOW load the rest of your app
const app = require('./app')
const connectDB = require('./config/database')

const PORT = process.env.PORT || 5000

// Connect to MongoDB
connectDB()

// Start server
app.listen(PORT, () => {
  console.log(`\n=== SERVER STARTED ===`)
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`Email configured: ${process.env.SMTP_HOST ? '✓ Yes' : '✗ No'}`)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err)
  process.exit(1)
})