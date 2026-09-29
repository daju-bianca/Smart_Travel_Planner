const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/ReviewController');

router.post('/add', reviewController.add);
router.get('/', reviewController.getAll);

module.exports = router;