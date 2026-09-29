const routeService = require('../services/RouteService');
const aiService = require('../services/AiService');

class RouteController {
    async create(req, res) {
        try {

            const { oras, prompt_used } = req.body;
            
            const generatedPlaces = await aiService.genereazaRuta(oras, prompt_used);
            
            const title = `Excursie generată AI în ${oras}`;
            
            const newRoute = await routeService.addRoute(title, prompt_used, generatedPlaces, oras);
            
            res.status(201).json({ 
                message: "Rută generată cu AI și salvată cu succes!", 
                route: newRoute 
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const routes = await routeService.getRoutes();
            res.status(200).json(routes);
        } catch (error) {
            res.status(500).json({ error: "Eroare la preluarea rutelor." });
        }
    }
}

module.exports = new RouteController();