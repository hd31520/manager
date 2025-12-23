const app = require('./app')
const mongoose = require('mongoose')
require('dotenv').config()

const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB')
  
  // Start server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
})
.catch((error) => {
  console.error('MongoDB connection error:', error)
  process.exit(1)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err)
  process.exit(1)
})