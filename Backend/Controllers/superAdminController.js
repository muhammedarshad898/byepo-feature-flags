const Organization = require('../models/Organization')

// Create a new organization
const createOrganization = async (req, res) => {
  try {
    const { name } = req.body

    if (!name) {
      return res.status(400).json({ error: 'Organization name is required' })
    }

    const existing = await Organization.findOne({ name })
    if (existing) {
      return res.status(400).json({ error: 'Organization already exists' })
    }

    const newOrg = new Organization({ name })
    await newOrg.save()

    res.status(201).json(newOrg)
  } catch (err) {
    res.status(500).json({ error: 'Server error while creating organization' })
  }
}

// Get list of all organizations
const getOrganizations = async (req, res) => {
  try {
    const orgs = await Organization.find()
    res.json(orgs)
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching organizations' })
  }
}

module.exports = { createOrganization, getOrganizations }