// Importation des packages
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Création d'un routeur express
const router = express.Router();

// On importe les routeurs
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

// On charge les variables d'environnement
require('dotenv').config({ path : './config/.env' });

// On accède aux variables d'environnement
const MY_APP_SECRET = process.env.APP_SECRET;
// On se connecte à la base de données avec mongoose
mongoose.connect(process.env.MONGO,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

// Ajout de headers à l'objet response
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.use(express.json());

// On enregistrer les routeurs
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;