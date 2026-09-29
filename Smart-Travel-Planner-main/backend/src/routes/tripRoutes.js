const express = require('express');
const router = express.Router();
const userRouteController = require('../controllers/UserRouteController');

router.post('/start', userRouteController.start);
router.post('/finish', userRouteController.finish);

module.exports = router;