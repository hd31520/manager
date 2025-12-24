const { stripe, razorpayInstance, SUBSCRIPTION_PLANS } = require('../config/payments')
const Subscription = require('../models/Subscription')
const Company = require('../models/Company')

const createPaymentIntent = async (amount, currency = 'bdt', metadata = {}) => {
  try {
    if (!stripe) {
      throw new Error('Stripe not configured. Please set STRIPE_SECRET_KEY in environment variables.')
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents/paisa
      currency: currency,
      metadata: metadata
    })

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    }
  } catch (error) {
    throw new Error(`Payment intent creation failed: ${error.message}`)
  }
}

const createRazorpayOrder = async (amount, currency = 'INR', receipt) => {
  try {
    if (!razorpayInstance) {
      throw new Error('Razorpay not configured')
    }

    const order = await razorpayInstance.orders.create({
      amount: amount * 100, // Convert to paisa
      currency: currency,
      receipt: receipt
    })

    return order
  } catch (error) {
    throw new Error(`Razorpay order creation failed: ${error.message}`)
  }
}

const processSubscriptionPayment = async (companyId, plan, paymentMethod = 'stripe') => {
  try {
    const planDetails = SUBSCRIPTION_PLANS[plan]
    if (!planDetails) {
      throw new Error('Invalid subscription plan')
    }

    const company = await Company.findById(companyId)
    if (!company) {
      throw new Error('Company not found')
    }

    let paymentResult

    if (paymentMethod === 'stripe') {
      paymentResult = await createPaymentIntent(
        planDetails.monthlyFee,
        'bdt',
        {
          companyId: companyId.toString(),
          plan: plan,
          type: 'subscription'
        }
      )
    } else if (paymentMethod === 'razorpay') {
      paymentResult = await createRazorpayOrder(
        planDetails.monthlyFee,
        'INR',
        `sub-${companyId}-${Date.now()}`
      )
    }

    // Update subscription
    const subscription = await Subscription.findOneAndUpdate(
      { company: companyId },
      {
        plan,
        workerLimit: planDetails.workerLimit,
        monthlyFee: planDetails.monthlyFee,
        status: 'active',
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      },
      { upsert: true, new: true }
    )

    // Update company subscription
    company.subscription.plan = plan
    company.subscription.workerLimit = planDetails.workerLimit
    company.subscription.monthlyFee = planDetails.monthlyFee
    company.subscription.status = 'active'
    company.subscription.nextBillingDate = subscription.nextBillingDate
    await company.save()

    return {
      subscription,
      payment: paymentResult
    }
  } catch (error) {
    throw new Error(`Subscription payment processing failed: ${error.message}`)
  }
}

const verifyPayment = async (paymentIntentId, paymentMethod = 'stripe') => {
  try {
    if (paymentMethod === 'stripe') {
      if (!stripe) {
        throw new Error('Stripe not configured')
      }
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
      return paymentIntent.status === 'succeeded'
    } else if (paymentMethod === 'razorpay') {
      if (!razorpayInstance) {
        throw new Error('Razorpay not configured')
      }
      // Razorpay verification logic
      return true
    }
    return false
  } catch (error) {
    throw new Error(`Payment verification failed: ${error.message}`)
  }
}

module.exports = {
  createPaymentIntent,
  createRazorpayOrder,
  processSubscriptionPayment,
  verifyPayment
}

