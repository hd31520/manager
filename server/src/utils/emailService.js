const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `${process.env.APP_NAME || 'Karkhana.shop'} <${process.env.SMTP_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html
    }

    const info = await transporter.sendMail(mailOptions)
    return info
  } catch (error) {
    throw new Error(`Email sending error: ${error.message}`)
  }
}

const sendWelcomeEmail = async (user) => {
  const message = `
    Welcome to Karkhana.shop!
    
    Your account has been created successfully.
    Email: ${user.email}
    
    Please verify your email to activate your account.
  `

  return sendEmail({
    email: user.email,
    subject: 'Welcome to Karkhana.shop',
    message
  })
}

const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
  
  const html = `
    <h2>Password Reset Request</h2>
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `

  return sendEmail({
    email: user.email,
    subject: 'Password Reset Request',
    message: `Password reset link: ${resetUrl}`,
    html
  })
}

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail
}

