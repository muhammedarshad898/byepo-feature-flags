const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
require('dotenv').config()
const User = require('./models/User')

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDB connected')

    const existing = await User.findOne({ role: 'super_admin' })
    if (existing) {
      console.log('Super Admin already exists:', existing.email)
      process.exit(0)
    }

    const hashedPassword = await bcrypt.hash('admin123', 10)

    const superAdmin = new User({
      name: 'Byepo Admin',
      email: 'admin@byepo.com',
      password: hashedPassword,
      role: 'super_admin'
      // no orgId — allowed, since your schema only requires it for org_admin
    })

    await superAdmin.save()
    console.log('Super Admin created:', superAdmin.email)
    process.exit(0)

  } catch (err) {
    console.error('Error creating Super Admin:', err)
    process.exit(1)
  }
}

createSuperAdmin()