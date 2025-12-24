const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')

const generateSalarySlip = async (salaryData, workerData, companyData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 })
      const filename = `salary-slip-${salaryData.worker}-${salaryData.month}-${salaryData.year}.pdf`
      const filepath = path.join(__dirname, '../../uploads', filename)

      // Ensure uploads directory exists
      const uploadsDir = path.dirname(filepath)
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
      }

      const stream = fs.createWriteStream(filepath)
      doc.pipe(stream)

      // Header
      doc.fontSize(20).text(companyData.name || 'Company Name', { align: 'center' })
      doc.fontSize(16).text('Salary Slip', { align: 'center' })
      doc.moveDown()

      // Employee Information
      doc.fontSize(14).text('Employee Information', { underline: true })
      doc.fontSize(12)
      doc.text(`Name: ${workerData.user?.name || 'N/A'}`)
      doc.text(`Employee ID: ${workerData.employeeId || 'N/A'}`)
      doc.text(`Designation: ${workerData.designation || 'N/A'}`)
      doc.text(`Month: ${salaryData.month}/${salaryData.year}`)
      doc.moveDown()

      // Salary Details
      doc.fontSize(14).text('Salary Details', { underline: true })
      doc.fontSize(12)
      doc.text(`Base Salary: ${salaryData.baseSalary} BDT`)
      doc.text(`Present Days: ${salaryData.attendance?.presentDays || 0}`)
      doc.text(`Absent Days: ${salaryData.attendance?.absentDays || 0}`)
      doc.moveDown()

      // Earnings
      doc.fontSize(14).text('Earnings', { underline: true })
      doc.fontSize(12)
      doc.text(`Overtime: ${salaryData.earnings?.overtime?.amount || 0} BDT`)
      doc.text(`Bonus: ${salaryData.earnings?.bonus || 0} BDT`)
      doc.text(`Total Earnings: ${salaryData.earnings?.total || 0} BDT`)
      doc.moveDown()

      // Deductions
      doc.fontSize(14).text('Deductions', { underline: true })
      doc.fontSize(12)
      doc.text(`Total Deductions: ${salaryData.deductions?.total || 0} BDT`)
      doc.moveDown()

      // Net Salary
      doc.fontSize(16).text(`Net Salary: ${salaryData.netSalary} BDT`, { align: 'right', bold: true })

      doc.end()

      stream.on('finish', () => {
        resolve(filepath)
      })

      stream.on('error', (error) => {
        reject(error)
      })
    } catch (error) {
      reject(error)
    }
  })
}

const generateReportPDF = async (reportData, title) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 })
      const filename = `report-${Date.now()}.pdf`
      const filepath = path.join(__dirname, '../../uploads', filename)

      const uploadsDir = path.dirname(filepath)
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
      }

      const stream = fs.createWriteStream(filepath)
      doc.pipe(stream)

      // Header
      doc.fontSize(20).text(title, { align: 'center' })
      doc.moveDown()

      // Report content
      doc.fontSize(12)
      doc.text(JSON.stringify(reportData, null, 2))

      doc.end()

      stream.on('finish', () => {
        resolve(filepath)
      })

      stream.on('error', (error) => {
        reject(error)
      })
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = {
  generateSalarySlip,
  generateReportPDF
}

