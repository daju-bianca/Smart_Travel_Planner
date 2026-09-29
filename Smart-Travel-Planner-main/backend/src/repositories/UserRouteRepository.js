const UserRoute = require('../models/UserRoute');

class UserRouteRepository {

    async startRoute(userId, routeId) {
        return await UserRoute.create({ 
            userId: userId, 
            routeId: routeId, 
            status: 'IN_PROGRESS' 
        });
    }

    async findUserRoute(userId, routeId) {
        return await UserRoute.findOne({ 
            where: { userId: userId, routeId: routeId } 
        });
    }

    async completeRoute(userRouteId) {
        return await UserRoute.update(
            { status: 'COMPLETED' }, 
            { where: { id: userRouteId } }
        );
    }
}

module.exports = new UserRouteRepository();