const routeRepository = require('../repositories/RouteRepository');

class RouteService {
    async addRoute(title, promptUsed, places, oras) {

        if (!title || !promptUsed || !places || !oras) {
            throw new Error("Titlul, prompt-ul, orașul și lista de locații sunt obligatorii!");
        }

        const newRoute = await routeRepository.createRoute({
            title: title,
            prompt_used: promptUsed,
            oras: oras,
            places: places 
        });

        return newRoute;
    }

    async getRoutes() {
        return await routeRepository.getAllRoutes();
    }
}

module.exports = new RouteService();