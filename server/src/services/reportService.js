const Order = require('../models/Order')
const Memo = require('../models/Memo')
const Salary = require('../models/Salary')
const Product = require('../models/Product')
const Inventory = require('../models/Inventory')
const Attendance = require('../models/Attendance')
const Transaction = require('../models/Transaction')
const { getMonthRange } = require('../utils/helpers')

const generateDailySalesReport = async (companyId, date) => {
  try {
    const startDate = new Date(date)
    startDate.setHours(0, 0, 0, 0)
    const endDate = new Date(date)
    endDate.setHours(23, 59, 59, 999)

    // Get orders
    const orders = await Order.find({
      company: companyId,
      createdAt: { $gte: startDate, $lte: endDate },
      status: { $ne: 'cancelled' }
    }).populate('customer', 'name phone')

    // Get memos
    const memos = await Memo.find({
      company: companyId,
      createdAt: { $gte: startDate, $lte: endDate },
      status: { $ne: 'cancelled' }
    })

    const totalSales = orders.reduce((sum, order) => sum + order.total, 0) +
                      memos.reduce((sum, memo) => sum + memo.total, 0)
    
    const totalOrders = orders.length + memos.length
    const totalPaid = orders.reduce((sum, order) => sum + order.payment.paidAmount, 0) +
                     memos.reduce((sum, memo) => sum + memo.paidAmount, 0)

    return {
      date,
      totalSales,
      totalOrders,
      totalPaid,
      totalDue: totalSales - totalPaid,
      orders: orders.length,
      memos: memos.length,
      details: {
        orders,
        memos
      }
    }
  } catch (error) {
    throw new Error(`Daily sales report generation failed: ${error.message}`)
  }
}

const generateMonthlySalesReport = async (companyId, month, year) => {
  try {
    const { startDate, endDate } = getMonthRange(month, year)

    const orders = await Order.find({
      company: companyId,
      createdAt: { $gte: startDate, $lte: endDate },
      status: { $ne: 'cancelled' }
    })

    const memos = await Memo.find({
      company: companyId,
      createdAt: { $gte: startDate, $lte: endDate },
      status: { $ne: 'cancelled' }
    })

    const totalSales = orders.reduce((sum, order) => sum + order.total, 0) +
                      memos.reduce((sum, memo) => sum + memo.total, 0)

    return {
      month,
      year,
      totalSales,
      totalOrders: orders.length + memos.length,
      orders: orders.length,
      memos: memos.length,
      averageOrderValue: (orders.length + memos.length) > 0 ? totalSales / (orders.length + memos.length) : 0
    }
  } catch (error) {
    throw new Error(`Monthly sales report generation failed: ${error.message}`)
  }
}

const generateSalaryReport = async (companyId, month, year) => {
  try {
    const salaries = await Salary.find({
      company: companyId,
      month,
      year
    }).populate('worker', 'employeeId').populate('worker.user', 'name')

    const totalSalary = salaries.reduce((sum, salary) => sum + salary.netSalary, 0)
    const paidSalaries = salaries.filter(s => s.payment.status === 'paid').length
    const pendingSalaries = salaries.filter(s => s.payment.status === 'pending').length

    return {
      month,
      year,
      totalSalary,
      totalWorkers: salaries.length,
      paidSalaries,
      pendingSalaries,
      salaries
    }
  } catch (error) {
    throw new Error(`Salary report generation failed: ${error.message}`)
  }
}

const generateProfitLossReport = async (companyId, startDate, endDate) => {
  try {
    // Income
    const orders = await Order.find({
      company: companyId,
      createdAt: { $gte: startDate, $lte: endDate },
      status: { $ne: 'cancelled' }
    })

    const memos = await Memo.find({
      company: companyId,
      createdAt: { $gte: startDate, $lte: endDate },
      status: { $ne: 'cancelled' }
    })

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0) +
                        memos.reduce((sum, memo) => sum + memo.total, 0)

    // Expenses
    const salaries = await Salary.find({
      company: companyId,
      year: new Date(startDate).getFullYear(),
      month: { $gte: new Date(startDate).getMonth() + 1, $lte: new Date(endDate).getMonth() + 1 }
    })

    const totalSalaryExpense = salaries.reduce((sum, salary) => sum + salary.netSalary, 0)

    const expenses = await Transaction.find({
      company: companyId,
      type: 'expense',
      date: { $gte: startDate, $lte: endDate }
    })

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0) + totalSalaryExpense

    const profit = totalRevenue - totalExpenses

    return {
      period: { startDate, endDate },
      revenue: totalRevenue,
      expenses: totalExpenses,
      salaryExpense: totalSalaryExpense,
      otherExpenses: totalExpenses - totalSalaryExpense,
      profit,
      profitMargin: totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0
    }
  } catch (error) {
    throw new Error(`Profit & Loss report generation failed: ${error.message}`)
  }
}

const generateInventoryReport = async (companyId) => {
  try {
    const products = await Product.find({ company: companyId })
    
    const lowStock = products.filter(p => 
      p.inventory.quantity <= p.inventory.minStock
    )

    const outOfStock = products.filter(p => 
      p.inventory.quantity === 0
    )

    const totalValue = products.reduce((sum, product) => 
      sum + (product.inventory.quantity * product.price.cost), 0
    )

    return {
      totalProducts: products.length,
      lowStock: lowStock.length,
      outOfStock: outOfStock.length,
      totalValue,
      products: {
        all: products,
        lowStock,
        outOfStock
      }
    }
  } catch (error) {
    throw new Error(`Inventory report generation failed: ${error.message}`)
  }
}

module.exports = {
  generateDailySalesReport,
  generateMonthlySalesReport,
  generateSalaryReport,
  generateProfitLossReport,
  generateInventoryReport
}

