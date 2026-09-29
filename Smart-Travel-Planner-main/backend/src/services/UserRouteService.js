const userRouteRepository = require('../repositories/UserRouteRepository');

class UserRouteService {

    async startTrip(userId, routeId) {
        if (!userId || !routeId) {
            throw new Error("Avem nevoie de ID-ul userului și ID-ul rutei!");
        }

        const existingTrip = await userRouteRepository.findUserRoute(userId, routeId);
        if (existingTrip) {
            throw new Error("Ai început deja această rută!");
        }

        return await userRouteRepository.startRoute(userId, routeId);
    }

    async finishTrip(userId, routeId) {

        const trip = await userRouteRepository.findUserRoute(userId, routeId);
        
        if (!trip) {
            throw new Error("Nu poți termina o rută pe care nu ai început-o!");
        }

        if (trip.status === 'COMPLETED') {
            throw new Error("Ai finalizat deja această rută!");
        }

        await userRouteRepository.completeRoute(trip.id);
        
        return { message: "Felicitări! Ai finalizat ruta." };
    }
}

module.exports = new UserRouteService();