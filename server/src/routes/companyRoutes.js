const express = require('express')
const router = express.Router()
const {
  createCompany,
  getCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
  getCompanyStats
  ,
  getCompanyUsersCount
} = require('../controllers/companyController')
const { protect } = require('../middleware/authMiddleware')
const { checkCompanyAccess } = require('../middleware/roleMiddleware')

router.use(protect)

router.post('/', createCompany)
router.get('/', getCompanies)
router.get('/:id', getCompany)
router.put('/:id', updateCompany)
router.delete('/:id', deleteCompany)
router.get('/:id/stats', getCompanyStats)
router.get('/:id/users-count', getCompanyUsersCount)

module.exports = router

