const nodemailer = require('nodemailer')

let transporter = null

console.log('=== EMAIL CONFIGURATION CHECK ===')
console.log('SMTP_USER:', process.env.SMTP_USER ? '✓ Set' : '✗ Not set')
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '✓ Set' : '✗ Not set')
console.log('SMTP_HOST:', process.env.SMTP_HOST || '✗ Not set')
console.log('SMTP_PORT:', process.env.SMTP_PORT || '✗ Not set')
console.log('FRONTEND_URL:', process.env.FRONTEND_URL || '✗ Not set')
console.log('APP_NAME:', process.env.APP_NAME || '✗ Not set')

// Create transporter if credentials are available
const mailUser = process.env.SMTP_USER
const mailPass = process.env.SMTP_PASS
const mailHost = process.env.SMTP_HOST
const mailPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : null

if (mailUser && mailPass && mailHost && mailPort) {
  console.log('Creating email transporter...')
  console.log(`Host: ${mailHost}:${mailPort}`)
  
  try {
    transporter = nodemailer.createTransport({
      host: mailHost,
      port: mailPort,
      secure: mailPort === 465, // true for port 465, false for others
      auth: {
        user: mailUser,
        pass: mailPass
      },
      tls: {
        rejectUnauthorized: false
      }
    })
    
    // Verify connection
    transporter.verify(function(error, success) {
      if (error) {
        console.error('✗ SMTP Connection Error:', error.message)
      } else {
        console.log('✓ SMTP Server is ready to take messages')
      }
    })
    
  } catch (error) {
    console.error('✗ Failed to create email transporter:', error.message)
  }
} else {
  console.warn('⚠️ SMTP not configured. Required: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS')
  console.warn('Emails will be logged to console instead of sent.')
}

const sendEmail = async (options) => {
  try {
    // Use environment variables or sensible defaults
    const fromEmail = mailUser || 'no-reply@karkhana.shop'
    const fromName = process.env.APP_NAME || 'Karkhana.shop'
    
    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html
    }

    console.log('\n=== SENDING EMAIL ===')
    console.log('From:', mailOptions.from)
    console.log('To:', mailOptions.to)
    console.log('Subject:', mailOptions.subject)
    
    if (!transporter) {
      console.log('⚠️ SMTP not configured — logging email instead of sending')
      console.log('HTML Preview:', options.html?.substring(0, 200) + '...')
      return { 
        success: true,
        logged: true, 
        message: 'Email logged (SMTP not configured)'
      }
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('✓ Email sent successfully! Message ID:', info.messageId)
    return {
      success: true,
      info
    }
  } catch (error) {
    console.error('✗ Email sending error:', error.message)
    return { 
      success: false,
      error: error.message
    }
  }
}

// Email template functions - these MUST use environment variables
const sendWelcomeEmail = async (user, verificationToken = null) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
  const appName = process.env.APP_NAME || 'Karkhana.shop'
  
  let html = `
    <h2>Welcome to ${appName}!</h2>
    <p>Your account has been created successfully.</p>
    <p><strong>Email:</strong> ${user.email}</p>
  `

  if (verificationToken) {
    const verificationLink = `${frontendUrl}/verify-email/${verificationToken}`
    html += `
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationLink}" style="background: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email Address</a>
      <p>This link will expire in 24 hours.</p>
    `
  }

  return sendEmail({
    email: user.email,
    subject: `Welcome to ${appName}`,
    message: `Welcome to ${appName}! Your account has been created. ${verificationToken ? 'Please verify your email.' : ''}`,
    html
  })
}

const sendPasswordResetEmail = async (user, resetToken) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
  const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`
  
  const html = `
    <h2>Password Reset Request</h2>
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href="${resetUrl}" style="background: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
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
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 0; }
        .header { background: #4F46E5; color: white; padding: 30px 20px; text-align: center; }
        .content { padding: 30px; background: #ffffff; }
        .button { display: inline-block; padding: 12px 30px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
        .footer { margin-top: 30px; padding: 20px; background: #f5f5f5; color: #666; font-size: 12px; text-align: center; }
        .link-box { background: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #4F46E5; margin: 20px 0; word-break: break-all; font-family: monospace; }
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
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteLink}" class="button">
              ${isNewUser ? 'Complete Registration' : 'Accept Invitation'}
            </a>
          </div>
          
          <p>This link will expire in 7 days.</p>
          
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <div class="link-box">${inviteLink}</div>
          
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
    message: `You have been invited to join ${companyName} as ${role}. Please visit: ${inviteLink}`,
    html
  })
}

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
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 0; }
        .header { background: #4F46E5; color: white; padding: 30px 20px; text-align: center; }
        .content { padding: 30px; background: #ffffff; }
        .button { display: inline-block; padding: 12px 30px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
        .footer { margin-top: 30px; padding: 20px; background: #f5f5f5; color: #666; font-size: 12px; text-align: center; }
        .link-box { background: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #4F46E5; margin: 20px 0; word-break: break-all; font-family: monospace; }
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
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${passwordSetupLink}" class="button">Set Your Password</a>
          </div>
          
          <p>This link will expire in 24 hours.</p>
          
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <div class="link-box">${passwordSetupLink}</div>
          
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

// ========== EXPORT ALL FUNCTIONS ==========

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendWorkerInvitationEmail,
  sendWorkerPasswordSetupEmail
}