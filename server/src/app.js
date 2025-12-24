const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
const path = require('path')
const errorHandler = require('./middleware/errorMiddleware')

// Import routes
const authRoutes = require('./routes/authRoutes')
const companyRoutes = require('./routes/companyRoutes')
const userRoutes = require('./routes/userRoutes')
const workerRoutes = require('./routes/workerRoutes')
const productRoutes = require('./routes/productRoutes')
const salesRoutes = require('./routes/salesRoutes')
const customerRoutes = require('./routes/customerRoutes')
const inventoryRoutes = require('./routes/inventoryRoutes')
const roleRoutes = require('./routes/roleRoutes')
const salaryRoutes = require('./routes/salaryRoutes')
const subscriptionRoutes = require('./routes/subscriptionRoutes')
const reportRoutes = require('./routes/reportRoutes')
const adminRoutes = require('./routes/adminRoutes')
const paymentRoutes = require('./routes/paymentRoutes')

const app = express()

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(compression())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/companies', companyRoutes)
app.use('/api/users', userRoutes)
app.use('/api/workers', workerRoutes)
app.use('/api/products', productRoutes)
app.use('/api/sales', salesRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/inventory', inventoryRoutes)
app.use('/api/roles', roleRoutes)
app.use('/api/salary', salaryRoutes)
app.use('/api/subscriptions', subscriptionRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/payments', paymentRoutes)

// 404 handler (must be before error handler)
app.use((req, res, next) => {
  res.status(404).json({ 
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}` 
  })
})

// Error handling middleware (must be after all routes and 404 handler)
app.use(errorHandler)

module.exports = app