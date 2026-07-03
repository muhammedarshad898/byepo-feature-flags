const FeatureFlag = require('../models/FeatureFlag')
const Organization = require('../models/Organization')


// Public — used by Org Admin signup form to populate the org dropdown
const getPublicOrganizations = async (req, res) => {
  try {
    const orgs = await Organization.find({}, 'name')   // only send _id + name, nothing else
    res.json(orgs)
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching organizations' })
  }
}

// Public — get all flags for a specific organization
const getPublicFlags = async (req, res) => {
  try {
    const { orgId } = req.query

    if (!orgId) {
      return res.status(400).json({ error: 'Organization id is required' })
    }

    const flags = await FeatureFlag.find({ orgId }, 'key enabled')
    res.json(flags)
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching flags' })
  }
}

const checkFlag = async (req, res) => {
  try {
    const { key, orgId } = req.query

    if (!key || !orgId) {
      return res.status(400).json({ error: 'Feature key and organization are required' })
    }

    const flag = await FeatureFlag.findOne({ key, orgId })

    if (!flag) {
      return res.status(404).json({ enabled: false, message: 'Feature not found for this organization' })
    }

    res.json({ enabled: flag.enabled })

  } catch (err) {
    res.status(500).json({ error: 'Server error while checking flag' })
  }
}

module.exports = { checkFlag, getPublicOrganizations, getPublicFlags }