const nodemailer = require('nodemailer')

let transporter = null
// Support both generic SMTP env vars and explicit Gmail env vars
const mailUser = process.env.SMTP_USER || process.env.GMAIL_USER
const mailPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD
if (mailUser && mailPass) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true' || false,
    auth: {
      user: mailUser,
      pass: mailPass
    }
  })
} else {
  console.warn('SMTP not configured (SMTP_USER/SMTP_PASS or GMAIL_USER/GMAIL_APP_PASSWORD). Emails will be logged to console.')
}

const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `${process.env.APP_NAME || 'Karkhana.shop'} <${mailUser || 'no-reply@example.com'}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html
    }

    if (!transporter) {
      console.info('SMTP not configured — logging email instead of sending:', mailOptions)
      return { logged: true, mailOptions }
    }

    const info = await transporter.sendMail(mailOptions)
    return info
  } catch (error) {
    console.error('Email sending error:', error)
    throw new Error(`Email sending error: ${error.message}`)
  }
}

const sendWelcomeEmail = async (user, verificationToken = null) => {
  let html = `
    <h2>Welcome to ${process.env.APP_NAME || 'Karkhana.shop'}!</h2>
    <p>Your account has been created successfully.</p>
    <p><strong>Email:</strong> ${user.email}</p>
  `

  if (verificationToken) {
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`
    html += `
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationLink}">Verify Email Address</a>
      <p>This link will expire in 24 hours.</p>
    `
  }

  return sendEmail({
    email: user.email,
    subject: 'Welcome to Karkhana.shop',
    message: `Welcome to Karkhana.shop! Your account has been created. ${verificationToken ? 'Please verify your email.' : ''}`,
    html
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

// New function for worker invitation
const sendWorkerInvitationEmail = async ({ 
  to, 
  name, 
  companyName, 
  invitedBy, 
  role, 
  inviteLink, 
  isNewUser 
}) => {
  const subject = isNewUser 
    ? `Welcome to ${companyName}! Complete Your Registration`
    : `You've been invited to join ${companyName}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 30px; background: #f9f9f9; }
        .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${companyName}</h1>
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          
          ${isNewUser 
            ? `<p>You have been invited by <strong>${invitedBy}</strong> to join <strong>${companyName}</strong> as a <strong>${role}</strong>.</p>
               <p>To get started, please complete your registration by setting up your password:</p>`
            : `<p><strong>${invitedBy}</strong> has invited you to join <strong>${companyName}</strong> as a <strong>${role}</strong>.</p>
               <p>Please click the button below to accept the invitation and set your password:</p>`
          }
          
          <div style="text-align: center;">
            <a href="${inviteLink}" class="button">
              ${isNewUser ? 'Complete Registration' : 'Accept Invitation'}
            </a>
          </div>
          
          <p>This link will expire in 7 days.</p>
          
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="background: #eee; padding: 10px; border-radius: 4px; word-break: break-all;">
            ${inviteLink}
          </p>
          
          <p>Best regards,<br>The ${companyName} Team</p>
        </div>
        <div class="footer">
          <p>This email was sent by ${companyName}. If you received this email by mistake, please ignore it.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    email: to,
    subject,
    message: `You have been invited to join ${companyName}. Please visit: ${inviteLink}`,
    html
  })
}

// Send password setup email for new worker
const sendWorkerPasswordSetupEmail = async ({ 
  to, 
  name, 
  companyName, 
  invitedBy, 
  role, 
  passwordSetupLink
}) => {
  const subject = `Welcome to ${companyName}! Set Your Password`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 30px; background: #f9f9f9; }
        .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${companyName}</h1>
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          
          <p>You have been added to <strong>${companyName}</strong> by <strong>${invitedBy}</strong> as a <strong>${role}</strong>.</p>
          
          <p>To get started, please set up your password by clicking the button below:</p>
          
          <div style="text-align: center;">
            <a href="${passwordSetupLink}" class="button">Set Your Password</a>
          </div>
          
          <p>This link will expire in 24 hours.</p>
          
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="background: #eee; padding: 10px; border-radius: 4px; word-break: break-all;">
            ${passwordSetupLink}
          </p>
          
          <p>Once you've set your password, you can log in to the system using your email: <strong>${to}</strong></p>
          
          <p>Best regards,<br>The ${companyName} Team</p>
        </div>
        <div class="footer">
          <p>This email was sent by ${companyName}. If you received this email by mistake, please ignore it.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    email: to,
    subject,
    message: `Welcome to ${companyName}! Please set your password by visiting: ${passwordSetupLink}`,
    html
  })
}

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendWorkerInvitationEmail,
  sendWorkerPasswordSetupEmail
}