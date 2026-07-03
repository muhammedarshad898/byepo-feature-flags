const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['super_admin', 'org_admin'],
    required: true
  },
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: function () {
      return this.role === 'org_admin'
    }
  }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)