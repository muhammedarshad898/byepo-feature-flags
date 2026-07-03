const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Org Admin signup
const signup = async (req, res) => {
  try {
    const { name, email, password, orgId } = req.body

    if (!orgId) {
      return res.status(400).json({ error: 'Organization is required' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'org_admin',   
      orgId
    })

    await newUser.save()

    res.status(201).json({ message: 'Signup successful' })
  } catch (err) {
    res.status(500).json({ error: 'Server error during signup' })
  }
}


const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' })
    }

    const token = jwt.sign(
      { userId: user._id, orgId: user.orgId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.json({ token })
  } catch (err) {
    res.status(500).json({ error: 'Server error during login' })
  }
}

module.exports = { signup, login }