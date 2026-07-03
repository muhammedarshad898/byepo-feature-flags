const express = require('express')
const router = express.Router()
const { createOrganization, getOrganizations } = require('../Controllers/superAdminController')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

router.post('/organizations', authMiddleware, roleMiddleware('super_admin'), createOrganization)
router.get('/organizations', authMiddleware, roleMiddleware('super_admin'), getOrganizations)

module.exports = router