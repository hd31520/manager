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
// Configure CORS. In development reflect the request origin so the
// Access-Control-Allow-Origin header matches the requesting frontend.
// Keep credentials enabled so cookies/auth headers work when needed.
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like server-to-server or curl)
    if (!origin) return callback(null, true)

    // Allow the explicitly configured frontend URL or any localhost origin
    const configured = process.env.FRONTEND_URL || 'http://localhost:5173'
    const isLocalhost = /localhost|127\.0\.0\.1/.test(origin)

    if (origin === configured || isLocalhost) {
      return callback(null, true)
    }

    // Reject other origins
    return callback(new Error('Not allowed by CORS'))
  },
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
// navigation route removed (was added during UI experiment)

// In production serve the client app and provide an SPA fallback for non-API routes
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../../client/dist')

  // Serve static assets
  app.use(express.static(clientBuildPath))

  // Serve index.html for all non-API GET requests so client-side routing works
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next()
    res.sendFile(path.join(clientBuildPath, 'index.html'))
  })
}

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