const User = require('../models/User');

class UserRepository {
    async createUser(userData) {
        return await User.create(userData);
    }

    async findByEmail(email) {
        return await User.findOne({ where: { email: email } });
    }
}

module.exports = new UserRepository();