const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })

const migrateUsers = async () => {
  try {
    console.log('Starting migration...')
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/karkhana'
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    
    console.log('Connected to MongoDB:', mongoUri)
    
    // Load User model
    const User = require('../models/User')
    
    // 1. Add requiresPasswordSetup field to all users that don't have it
    const addFieldResult = await User.updateMany(
      { requiresPasswordSetup: { $exists: false } },
      { $set: { requiresPasswordSetup: false } }
    )
    
    console.log(`✓ Added requiresPasswordSetup field to ${addFieldResult.modifiedCount} users`)
    
    // 2. Find worker users without password (likely created by admin)
    const workerUsers = await User.find({
      role: { $in: ['worker', 'sales_executive', 'group_leader'] },
      $or: [
        { password: { $exists: false } },
        { password: null },
        { password: '' }
      ]
    }).select('_id email role')
    
    console.log(`Found ${workerUsers.length} worker users without proper password`)
    
    if (workerUsers.length > 0) {
      console.log('Worker users found:')
      workerUsers.forEach(user => {
        console.log(`  - ${user.email} (${user.role})`)
      })
      
      const workerIds = workerUsers.map(user => user._id)
      const workerResult = await User.updateMany(
        { _id: { $in: workerIds } },
        { $set: { requiresPasswordSetup: true } }
      )
      
      console.log(`✓ Set requiresPasswordSetup=true for ${workerResult.modifiedCount} worker users`)
    }
    
    // 3. Also check if any users have resetPasswordToken but no password
    const usersWithResetToken = await User.find({
      resetPasswordToken: { $exists: true, $ne: null },
      $or: [
        { password: { $exists: false } },
        { password: null },
        { password: '' }
      ]
    }).select('_id email resetPasswordToken')
    
    if (usersWithResetToken.length > 0) {
      console.log(`Found ${usersWithResetToken.length} users with reset token but no password`)
      const resetTokenUserIds = usersWithResetToken.map(user => user._id)
      await User.updateMany(
        { _id: { $in: resetTokenUserIds } },
        { $set: { requiresPasswordSetup: true } }
      )
      console.log(`✓ Set requiresPasswordSetup=true for users with reset tokens`)
    }
    
    // 4. Display summary
    const totalUsers = await User.countDocuments({})
    const usersNeedingPasswordSetup = await User.countDocuments({ requiresPasswordSetup: true })
    
    console.log('\n📊 Migration Summary:')
    console.log(`   Total Users: ${totalUsers}`)
    console.log(`   Users needing password setup: ${usersNeedingPasswordSetup}`)
    console.log(`   Migration completed successfully!`)
    
    // Close connection
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    console.error('Stack trace:', error.stack)
    process.exit(1)
  }
}

// Run migration
migrateUsers()