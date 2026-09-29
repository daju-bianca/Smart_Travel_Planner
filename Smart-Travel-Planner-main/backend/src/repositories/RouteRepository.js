const Route = require('../models/Route');

class RouteRepository {
    async createRoute(routeData) {
        return await Route.create(routeData);
    }

    async getAllRoutes() {
        return await Route.findAll();
    }
}

module.exports = new RouteRepository();