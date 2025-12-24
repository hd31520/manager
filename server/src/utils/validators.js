const Joi = require('joi')

// User validation schemas
const registerSchema = Joi.object({
  name: Joi.string().required().min(2).max(50),
  email: Joi.string().email().required(),
  phone: Joi.string().optional(),
  password: Joi.string().required().min(6),
  role: Joi.string().valid('owner', 'manager', 'worker', 'sales_executive').optional()
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

// Company validation schemas
const companySchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  businessType: Joi.string().valid('factory', 'shop', 'showroom').required(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  address: Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().optional(),
    district: Joi.string().optional(),
    postalCode: Joi.string().optional()
  }).optional()
})

// Worker validation schemas
const workerSchema = Joi.object({
  employeeId: Joi.string().required(),
  designation: Joi.string().optional(),
  department: Joi.string().optional(),
  baseSalary: Joi.number().min(0).required(),
  joiningDate: Joi.date().optional()
})

// Product validation schemas
const productSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  sku: Joi.string().required(),
  barcode: Joi.string().optional(),
  description: Joi.string().optional(),
  price: Joi.object({
    selling: Joi.number().min(0).required(),
    cost: Joi.number().min(0).optional()
  }).required(),
  inventory: Joi.object({
    quantity: Joi.number().min(0).default(0),
    minStock: Joi.number().min(0).default(0),
    unit: Joi.string().default('pcs')
  }).optional()
})

// Order validation schemas
const orderSchema = Joi.object({
  customer: Joi.string().optional(),
  items: Joi.array().items(
    Joi.object({
      product: Joi.string().required(),
      quantity: Joi.number().min(1).required(),
      unitPrice: Joi.number().min(0).required()
    })
  ).min(1).required(),
  payment: Joi.object({
    method: Joi.string().valid('cash', 'card', 'mobile_banking', 'bank_transfer', 'due').required()
  }).required()
})

module.exports = {
  registerSchema,
  loginSchema,
  companySchema,
  workerSchema,
  productSchema,
  orderSchema
}

