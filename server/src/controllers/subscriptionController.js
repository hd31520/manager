// controllers/subscriptionController.js
const Subscription = require('../models/Subscription')
const Company = require('../models/Company')

// @desc    Get subscription for company
// @route   GET /api/subscriptions/company/:companyId
// @access  Private
exports.getCompanySubscription = async (req, res, next) => {
  try {
    const { companyId } = req.params
    
    // Check if user has access to this company
    const company = await Company.findOne({
      _id: companyId,
      $or: [
        { owner: req.user._id },
        { managers: req.user._id }
      ]
    })

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found or access denied'
      })
    }

    let subscription = await Subscription.findOne({ company: companyId })
    
    // If no subscription exists, create a free plan
    if (!subscription) {
      subscription = await Subscription.create({
        company: companyId,
        plan: 'free',
        status: 'active',
        workerLimit: 5,
        price: 0,
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        features: [
          'Up to 5 workers',
          'Basic analytics',
          'Email support',
          '1 company'
        ]
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

// @desc    Get available plans
// @route   GET /api/subscriptions/plans
// @access  Private
exports.getPlans = async (req, res, next) => {
  try {
    const plans = {
      free: {
        name: 'Free',
        monthlyFee: 0,
        workerLimit: 5,
        features: [
          'Up to 5 workers',
          'Basic analytics',
          'Email support',
          '1 company'
        ]
      },
      pro: {
        name: 'Pro',
        monthlyFee: 299,
        workerLimit: 50,
        features: [
          'Up to 50 workers',
          'Advanced analytics',
          'Priority support',
          'Multiple companies',
          'Custom reports'
        ]
      },
      enterprise: {
        name: 'Enterprise',
        monthlyFee: 999,
        workerLimit: Infinity,
        features: [
          'Unlimited workers',
          'All Pro features',
          '24/7 phone support',
          'Custom integrations',
          'Dedicated account manager'
        ]
      }
    }

    res.json({
      success: true,
      plans
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update subscription plan
// @route   PUT /api/subscriptions/company/:companyId
// @access  Private
exports.updateSubscription = async (req, res, next) => {
  try {
    const { companyId } = req.params
    const { plan } = req.body

    const plans = {
      free: {
        name: 'Free',
        monthlyFee: 0,
        workerLimit: 5,
        features: [
          'Up to 5 workers',
          'Basic analytics',
          'Email support',
          '1 company'
        ]
      },
      pro: {
        name: 'Pro',
        monthlyFee: 299,
        workerLimit: 50,
        features: [
          'Up to 50 workers',
          'Advanced analytics',
          'Priority support',
          'Multiple companies',
          'Custom reports'
        ]
      },
      enterprise: {
        name: 'Enterprise',
        monthlyFee: 999,
        workerLimit: Infinity,
        features: [
          'Unlimited workers',
          'All Pro features',
          '24/7 phone support',
          'Custom integrations',
          'Dedicated account manager'
        ]
      }
    }

    const selectedPlan = plans[plan]
    if (!selectedPlan) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan selected'
      })
    }

    // Check if user has access to this company
    const company = await Company.findOne({
      _id: companyId,
      $or: [
        { owner: req.user._id },
        { managers: req.user._id }
      ]
    })

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found or access denied'
      })
    }

    // Update or create subscription
    const subscription = await Subscription.findOneAndUpdate(
      { company: companyId },
      {
        plan,
        price: selectedPlan.monthlyFee,
        workerLimit: selectedPlan.workerLimit,
        features: selectedPlan.features,
        status: 'active',
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        updatedAt: new Date()
      },
      { new: true, upsert: true }
    )

    res.json({
      success: true,
      message: `Subscription updated to ${selectedPlan.name} plan`,
      subscription
    })
  } catch (error) {
    next(error)
  }
}