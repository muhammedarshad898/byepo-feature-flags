const mongoose = require('mongoose')

const featureFlagSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true
  },
  enabled: {
    type: Boolean,
    default: false
  },
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  }
}, { timestamps: true })

// prevents the same flag key from being created twice within the same org
featureFlagSchema.index({ key: 1, orgId: 1 }, { unique: true })

module.exports = mongoose.model('FeatureFlag', featureFlagSchema)