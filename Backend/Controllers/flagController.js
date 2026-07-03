const FeatureFlag = require('../models/FeatureFlag')

//create flag orgadmin only
const createFlag = async (req, res) => {
  try {
    const { key } = req.body
    const orgId = req.user.orgId   

    if (!key) {
      return res.status(400).json({ error: 'Feature key is required' })
    }

    const newFlag = new FeatureFlag({
      key,
      orgId,
      enabled: false   
    })

    await newFlag.save()
    res.status(201).json(newFlag)

  } catch (err) {
    if (err.code === 11000) {
      // duplicate key error from your unique index (key + orgId)
      return res.status(400).json({ error: 'This feature key already exists for your organization' })
    }
    res.status(500).json({ error: 'Server error while creating flag' })
  }
}

// Get all flags belonging to the logged-in admin's org
const getFlags = async (req, res) => {
  try {
    const orgId = req.user.orgId
    const flags = await FeatureFlag.find({ orgId })
    res.json(flags)
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching flags' })
  }
}

// Update (enable/disable) a specific flag — Org Admin only
const updateFlag = async (req, res) => {
  try {
    const { id } = req.params
    const { enabled } = req.body
    const orgId = req.user.orgId

    const flag = await FeatureFlag.findOne({ _id: id, orgId })
    if (!flag) {
      return res.status(404).json({ error: 'Flag not found' })
    }

    flag.enabled = enabled
    await flag.save()

    res.json(flag)
  } catch (err) {
    res.status(500).json({ error: 'Server error while updating flag' })
  }
}

// Delete a flag — Org Admin only
const deleteFlag = async (req, res) => {
  try {
    const { id } = req.params
    const orgId = req.user.orgId

    const flag = await FeatureFlag.findOneAndDelete({ _id: id, orgId })
    if (!flag) {
      return res.status(404).json({ error: 'Flag not found' })
    }

    res.json({ message: 'Flag deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Server error while deleting flag' })
  }
}

module.exports = { createFlag, getFlags, updateFlag, deleteFlag }