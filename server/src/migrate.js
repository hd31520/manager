// migrate.js - Add requiresPasswordSetup field to all users
const mongoose = require('mongoose')
require('dotenv').config()

async function migrate() {
  console.log('Starting database migration...')
  
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/karkhana'
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    
    console.log('✅ Connected to MongoDB:', mongoUri)
    
    // Get the raw MongoDB driver
    const db = mongoose.connection.db
    
    // Check if users collection exists
    const collections = await db.listCollections().toArray()
    const usersCollection = collections.find(col => col.name === 'users')
    
    if (!usersCollection) {
      console.log('❌ Users collection not found in database')
      await mongoose.disconnect()
      process.exit(1)
    }
    
    console.log('📦 Found users collection')
    
    // Add requiresPasswordSetup field to all users
    const result = await db.collection('users').updateMany(
      { requiresPasswordSetup: { $exists: false } },
      { $set: { requiresPasswordSetup: false } },
      { upsert: false }
    )
    
    console.log(`✅ Updated ${result.modifiedCount} users with requiresPasswordSetup: false`)
    
    // Display current status
    const totalUsers = await db.collection('users').countDocuments()
    const usersWithField = await db.collection('users').countDocuments({ 
      requiresPasswordSetup: { $exists: true } 
    })
    
    console.log('\n📊 Migration Summary:')
    console.log(`   Total Users: ${totalUsers}`)
    console.log(`   Users with requiresPasswordSetup field: ${usersWithField}`)
    
    // Check if any users need manual attention
    const usersWithoutPassword = await db.collection('users').find({
      $or: [
        { password: { $exists: false } },
        { password: null },
        { password: '' }
      ]
    }).toArray()
    
    if (usersWithoutPassword.length > 0) {
      console.log('\n⚠️  Found users without password (may need requiresPasswordSetup: true):')
      usersWithoutPassword.forEach(user => {
        console.log(`   - ${user.email} (${user.role || 'no role'})`)
      })
      
      console.log('\n💡 If these are workers added by admin, you may want to update them:')
      console.log('   Run this in MongoDB shell:')
      console.log('   db.users.updateMany({password: {$exists: false}}, {$set: {requiresPasswordSetup: true}})')
    }
    
    await mongoose.disconnect()
    console.log('\n✅ Migration completed successfully!')
    console.log('🔄 Restart your server for changes to take effect.')
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    console.error('Error details:', error)
    process.exit(1)
  }
}

// Run migration
migrate()