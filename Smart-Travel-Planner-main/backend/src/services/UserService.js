const User = require('../models/User');
const userRepository = require('../repositories/UserRepository');

class UserService {
    async register(username, email, password) {
        if (!username || !email || !password) {
            throw new Error("Toate câmpurile sunt obligatorii!");
        }

        if(password.length < 8){
            throw new Error("Parola trebuie sa contina cel putin 8 caractere!");
        }

        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error("Email-ul este deja folosit!");
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;
        if (!passwordRegex.test(password)) {
            throw new Error("Parola trebuie sa contina cel putin o majuscula si o cifra!");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("Adresa de email nu este valida!");
        }
        return await userRepository.createUser({ username, email, password });
    }

    async login(email, password) {
        if (!email || !password) {
            throw new Error("Email-ul și parola sunt obligatorii!");
        }

        const user = await userRepository.findByEmail(email);

        if (!user) {
            throw new Error("Utilizatorul nu a fost găsit!");
        }

        if (user.password !== password) {
            throw new Error("Parolă incorectă!");
        }

        return {
            id: user.id,
            username: user.username,
            email: user.email
        };
    }

    async updateName(userId, newUsername) {
        const user = await User.findByPk(userId); 
        if (!user) {
            throw new Error("Utilizatorul nu a fost găsit.");
        }
        user.username = newUsername; 
        await user.save();
        return user;
    }

    async deleteAccount(userId) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error("Utilizatorul nu a fost găsit.");
        }
        await user.destroy();
        return true;
    }
}

module.exports = new UserService();