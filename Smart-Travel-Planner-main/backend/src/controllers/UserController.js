const userService = require('../services/UserService');

class UserController {
    async register(req, res) {
        try {
            const { username, email, password } = req.body;
            const newUser = await userService.register(username, email, password);
            res.status(201).json(newUser);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await userService.login(email, password);
            
            res.status(200).json({
                message: "Login reușit!",
                userId: user.id,
                userEmail: user.email,
                userRole: user.role, 
            });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    async logout(req, res) {
        try {
            res.status(200).json({ message: "Logout reușit!" });
        } catch (error) {
            res.status(500).json({ error: "Eroare la logout." });
        }
    }

    async updateName(req, res) {
        try {
            const { id } = req.params; 
            const { username } = req.body; 
            
            if (!username || username.trim() === "") {
                return res.status(400).json({ success: false, error: "Numele nu poate fi gol." });
            }

            await userService.updateName(id, username);
            res.status(200).json({ success: true, message: "Nume actualizat!" });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async deleteAccount(req, res) {
        try {
            const { id } = req.params;
            await userService.deleteAccount(id);
            res.status(200).json({ success: true, message: "Cont șters definitiv." });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}

module.exports = new UserController();