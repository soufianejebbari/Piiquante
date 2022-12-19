const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// On crée un schéma de données avec les champs requis pour un user
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

// On exporte le schéma en tant que modèle Mongoose
module.exports = mongoose.model('User', userSchema);