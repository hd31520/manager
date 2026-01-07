const express = require('express')
const router = express.Router()
const {
  createProduct,
  getProducts,
  getProductsStockValue,
  getProduct,
  updateProduct,
  deleteProduct,
  updateInventory
} = require('../controllers/productController')
const { protect } = require('../middleware/authMiddleware')

router.use(protect)

router.post('/', createProduct)
router.get('/', getProducts)
router.get('/stock-value', getProductsStockValue)
router.get('/:id', getProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)
router.put('/:id/inventory', updateInventory)

module.exports = router

