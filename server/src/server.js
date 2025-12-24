const app = require('./app')
const connectDB = require('./config/database')
require('dotenv').config()

const PORT = process.env.PORT || 5000

// Connect to MongoDB
connectDB()

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err)
  process.exit(1)
})