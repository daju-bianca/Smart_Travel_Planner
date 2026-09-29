const reviewService = require('../services/ReviewService');

class ReviewController {
    async add(req, res) {
        try {
            const { userId, routeId, rating, comment, city, userName } = req.body;
            
            const newReview = await reviewService.addReview(userId, routeId, rating, comment, city, userName);
            
            res.status(201).json({ 
                message: "Review adăugat cu succes!", 
                review: newReview 
            });
        } catch (error) {
            
            res.status(403).json({ error: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const reviews = await reviewService.getAllReviews();
            res.status(200).json(reviews);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ReviewController();