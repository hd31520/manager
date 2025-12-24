const express = require('express')
const router = express.Router()
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  updateInventory
} = require('../controllers/productController')
const { protect } = require('../middleware/authMiddleware')

router.use(protect)

router.post('/', createProduct)
router.get('/', getProducts)
router.get('/:id', getProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)
router.put('/:id/inventory', updateInventory)

module.exports = router

