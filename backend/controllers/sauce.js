const Sauce = require('../models/sauce');
const fs = require('fs');

// création des différentes logiques pour les routes sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.likeSauce = (req, res, next) => {
    switch (req.body.like) {
        // Like
        case 1:
            Sauce.updateOne(
                { _id: req.params.id },
                // On ajoute l'id de l'utilisateur dans le tableau usersLiked et on incrémente de 1
                { $push: { usersLiked: req.body.userId }, $inc: { likes: +1 } }
            )
                .then(() => res.status(200).json({ message: 'J\'aime cette sauce !' }))
                .catch((error) => res.status(400).json({ error }));
            break;
        // Annulation du like ou dislike
        case 0:
            Sauce.findOne({ _id: req.params.id })
                .then((sauce) => {
                    // si l'id de l'utilisateur se trouve dans le tableau usersLiked
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        Sauce.updateOne(
                            { _id: req.params.id },
                            // On retire l'id de l'utilisateur du tableau usersLiked
                            { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
                        )
                            .then(() =>
                                res.status(200).json({ message: 'like annulé !' })
                            )
                            .catch((error) => res.status(400).json({ error }));
                    }
                    // si l'id de l'utilisateur se trouve dans le tableau usersDisliked
                    if (sauce.usersDisliked.includes(req.body.userId)) {
                        Sauce.updateOne(
                            { _id: req.params.id },
                            // On retire l'id de l'utilisateur du tableau usersDisliked
                            { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } }
                        )
                            .then(() =>
                                res.status(200).json({ message: 'Dislike annulé !' })
                            )
                            .catch((error) => res.status(400).json({ error }));
                    }
                })
                .catch((error) => res.status(404).json({ error }));
            break;
        // Dislike
        case -1:
            Sauce.updateOne(
                { _id: req.params.id },
                // On ajoute l'id de l'utilisateur dans le tableau usersDisliked et on incrémente de 1
                { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: +1 } }
            )
                .then(() => {
                    res.status(200).json({ message: 'Je n\'aime pas cette sauce !' });
                })
                .catch((error) => res.status(400).json({ error }));
            break;
        default:
            console.log(error);
    }
}