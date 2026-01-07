const Stripe = require('stripe')
const Razorpay = require('razorpay')

// Stripe configuration
let stripe = null
const stripeConfig = {
  secretKey: process.env.STRIPE_SECRET_KEY,
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
}

// Initialize Stripe only if API key is provided
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
}

// Razorpay configuration
let razorpayInstance = null
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  })
}

// Subscription plans
const SUBSCRIPTION_PLANS = {
  basic: {
    name: 'Basic Plan',
    workerLimit: 10,
    monthlyFee: 200,
    features: ['Basic management', 'Inventory', 'Sales']
  },
  standard: {
    name: 'Standard Plan',
    workerLimit: 20,
    monthlyFee: 300,
    features: ['Basic features', 'Groups', 'Advanced reporting']
  },
  premium: {
    name: 'Premium Plan',
    workerLimit: 50,
    monthlyFee: 500,
    features: ['Standard features', 'Analytics', 'Presentation system']
  },
  enterprise: {
    name: 'Enterprise Plan',
    workerLimit: Infinity,
    monthlyFee: 0, // Custom pricing
    features: ['All features', 'API access', 'Priority support']
  }
}

module.exports = {
  stripe,
  stripeConfig,
  razorpayInstance,
  SUBSCRIPTION_PLANS
}

