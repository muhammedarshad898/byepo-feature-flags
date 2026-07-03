const express = require('express')
const router = express.Router()
const { createFlag, getFlags, updateFlag, deleteFlag } = require('../Controllers/flagController')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

router.post('/', authMiddleware, roleMiddleware('org_admin'), createFlag)
router.get('/', authMiddleware, roleMiddleware('org_admin'), getFlags)
router.patch('/:id', authMiddleware, roleMiddleware('org_admin'), updateFlag)
router.delete('/:id', authMiddleware, roleMiddleware('org_admin'), deleteFlag)

module.exports = router