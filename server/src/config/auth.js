const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRE = process.env.JWT_EXPIRE || '24h'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key'
const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || '7d'

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE
  })
}

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRE
  })
}

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET)
}

const verifyRefreshToken = (token) => {
  return jwt.verify(token, JWT_REFRESH_SECRET)
}

module.exports = {
  JWT_SECRET,
  JWT_EXPIRE,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRE,
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken
}

