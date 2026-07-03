const express = require('express')
const router = express.Router()
const { checkFlag, getPublicOrganizations, getPublicFlags } = require('../Controllers/publicController')

router.get('/check', checkFlag)
router.get('/organizations', getPublicOrganizations)
router.get('/flags', getPublicFlags)

module.exports = router