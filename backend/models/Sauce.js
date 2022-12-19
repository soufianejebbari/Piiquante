const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number },
    dislikes: { type: Number  },
    usersLiked: { type: Array },
    usersDisliked: { type: Array },
});

// On exporte le schéma en tant que modèle Mongoose, on le rend ainsi disponible pour notre application express
module.exports = mongoose.model('Sauce', sauceSchema);