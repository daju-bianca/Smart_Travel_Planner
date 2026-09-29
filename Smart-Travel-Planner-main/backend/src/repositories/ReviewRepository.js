const Review = require('../models/Review');

class ReviewRepository {
    async createReview(reviewData) {
        return await Review.create(reviewData);
    }

    async getAllReviews() {
        return await Review.findAll();
    }
}

module.exports = new ReviewRepository();