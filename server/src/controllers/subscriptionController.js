const Subscription = require('../models/Subscription')
const Company = require('../models/Company')
const { SUBSCRIPTION_PLANS } = require('../config/payments')
const { processSubscriptionPayment } = require('../services/paymentService')

// @desc    Get subscription plans
// @route   GET /api/subscriptions/plans
// @access  Public
exports.getPlans = async (req, res, next) => {
  try {
    res.json({
      success: true,
      plans: SUBSCRIPTION_PLANS
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get company subscription
// @route   GET /api/subscriptions/:companyId
// @access  Private
exports.getSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({ company: req.params.companyId })
      .populate('company', 'name')

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      })
    }

    res.json({
      success: true,
      subscription
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update subscription plan
// @route   PUT /api/subscriptions/:companyId
// @access  Private
exports.updateSubscription = async (req, res, next) => {
  try {
    const { plan, paymentMethod } = req.body

    const planDetails = SUBSCRIPTION_PLANS[plan]
    if (!planDetails) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription plan'
      })
    }

    const result = await processSubscriptionPayment(
      req.params.companyId,
      plan,
      paymentMethod || 'stripe'
    )

    res.json({
      success: true,
      subscription: result.subscription,
      payment: result.payment
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Cancel subscription
// @route   PUT /api/subscriptions/:companyId/cancel
// @access  Private
exports.cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({ company: req.params.companyId })

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      })
    }

    subscription.status = 'cancelled'
    subscription.autoRenew = false
    await subscription.save()

    // Update company
    const company = await Company.findById(req.params.companyId)
    if (company) {
      company.subscription.status = 'cancelled'
      await company.save()
    }

    res.json({
      success: true,
      message: 'Subscription cancelled successfully'
    })
  } catch (error) {
    next(error)
  }
}

