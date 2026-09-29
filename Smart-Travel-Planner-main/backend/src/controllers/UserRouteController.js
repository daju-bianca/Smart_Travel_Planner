const userRouteService = require('../services/UserRouteService');

class UserRouteController {

    async start(req, res) {
        try {

            const { userId, routeId } = req.body;
            
            const trip = await userRouteService.startTrip(userId, routeId);
            
            res.status(201).json({ 
                message: "Călătorie începută cu succes! Status: IN_PROGRESS", 
                trip: trip 
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async finish(req, res) {
        try {
            const { userId, routeId } = req.body;
            
            const result = await userRouteService.finishTrip(userId, routeId);
            
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new UserRouteController();