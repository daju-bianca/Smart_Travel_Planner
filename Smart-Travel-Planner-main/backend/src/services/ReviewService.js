const reviewRepository = require('../repositories/ReviewRepository');
const userRouteRepository = require('../repositories/UserRouteRepository');

class ReviewService {
    async addReview(userId, routeId, rating, comment, city, userName) {

        if (!userId || !routeId || !rating) {
            throw new Error("User ID, Route ID și nota (rating) sunt obligatorii!");
        }

        if (rating < 1 || rating > 5) {
            throw new Error("Nota trebuie să fie între 1 și 5.");
        }

        const trip = await userRouteRepository.findUserRoute(userId, routeId);
        
        if (!trip) {

            throw new Error("Nu poți lăsa review pentru o rută pe care nu ai început-o!");
        }

        if (trip.status !== 'COMPLETED') {
            throw new Error("Nu poți lăsa review! Trebuie să finalizezi ruta mai întâi.");
        }

        const newReview = await reviewRepository.createReview({
            userRouteId: trip.id,
            rating: rating,
            comment: comment || "",
            city: city || null,
            userName: userName || null
        });

        return newReview;
    }

    async getAllReviews() {
        try {
            const reviews = await reviewRepository.getAllReviews();
            return reviews || [];
        } catch (error) {
            throw new Error("Eroare la obținerea review-urilor: " + error.message);
        }
    }
}

module.exports = new ReviewService();