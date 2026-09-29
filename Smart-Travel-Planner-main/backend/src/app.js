const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const User = require('./models/User');
const Route = require('./models/Route');
const UserRoute = require('./models/UserRoute');
const Review = require('./models/Review');

const app = express();

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const routeRoutes = require('./routes/routeRoutes');
const tripRoutes = require('./routes/tripRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

app.use('/api/users', userRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/reviews', reviewRoutes);

const PORT = 3000;

sequelize.sync({alter: true})
    .then(() => {
        console.log("Baza de date SQLite a fost conectata cu succes!");
        app.listen(PORT, () => {
            console.log(`Serverul ruleaza la adresa : http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Eroare la conectarea bazei de date:", error);
    });