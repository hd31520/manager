const express = require('express')
const router = express.Router()
const {
  createWorker,
  getWorkers,
  getWorker,
  updateWorker,
  deleteWorker
} = require('../controllers/workerController')
const { protect } = require('../middleware/authMiddleware')

router.use(protect)

router.post('/', createWorker)
router.get('/', getWorkers)
router.get('/:id', getWorker)
router.put('/:id', updateWorker)
router.delete('/:id', deleteWorker)

module.exports = router

