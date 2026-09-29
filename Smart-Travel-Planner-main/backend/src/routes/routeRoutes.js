const express = require('express');
const router = express.Router();
const routeController = require('../controllers/RouteController');

router.post('/create', routeController.create); 
router.get('/all', routeController.getAll);

module.exports = router;