const Report = require('../models/Report')
const {
  generateDailySalesReport,
  generateMonthlySalesReport,
  generateSalaryReport,
  generateProfitLossReport,
  generateInventoryReport
} = require('../services/reportService')
const { generateReportPDF } = require('../utils/pdfGenerator')

// @desc    Generate report
// @route   POST /api/reports/generate
// @access  Private
exports.generateReport = async (req, res, next) => {
  try {
    const { companyId, type, period, format = 'pdf' } = req.body

    let reportData = {}
    let title = ''

    switch (type) {
      case 'daily_sales':
        reportData = await generateDailySalesReport(companyId, period.date)
        title = `Daily Sales Report - ${period.date}`
        break
      case 'monthly_sales':
        reportData = await generateMonthlySalesReport(companyId, period.month, period.year)
        title = `Monthly Sales Report - ${period.month}/${period.year}`
        break
      case 'salary':
        reportData = await generateSalaryReport(companyId, period.month, period.year)
        title = `Salary Report - ${period.month}/${period.year}`
        break
      case 'profit_loss':
        reportData = await generateProfitLossReport(companyId, period.startDate, period.endDate)
        title = `Profit & Loss Report`
        break
      case 'inventory':
        reportData = await generateInventoryReport(companyId)
        title = 'Inventory Report'
        break
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid report type'
        })
    }

    // Generate PDF if requested
    let fileUrl = null
    if (format === 'pdf') {
      const filepath = await generateReportPDF(reportData, title)
      fileUrl = filepath
    }

    // Save report
    const report = await Report.create({
      company: companyId,
      type,
      title,
      period: period.startDate ? { startDate: period.startDate, endDate: period.endDate } : period,
      data: reportData,
      generatedBy: req.user._id,
      fileUrl,
      format
    })

    res.json({
      success: true,
      report,
      data: reportData
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get reports
// @route   GET /api/reports
// @access  Private
exports.getReports = async (req, res, next) => {
  try {
    const { companyId, type, page = 1, limit = 10 } = req.query
    const { skip, limit: limitNum } = paginate(page, limit)

    let query = {}
    if (companyId) query.company = companyId
    if (type) query.type = type

    const reports = await Report.find(query)
      .populate('generatedBy', 'name')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 })

    const total = await Report.countDocuments(query)

    res.json({
      success: true,
      count: reports.length,
      total,
      reports
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Private
exports.getReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('generatedBy', 'name')

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      })
    }

    res.json({
      success: true,
      report
    })
  } catch (error) {
    next(error)
  }
}

