const Sauce = require('../models/sauce')
const fs = require('fs')

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce)
  delete sauceObject._id
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0
  })
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistré !' }))
    .catch(error => res.status(400).json({ error }))
}

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      }
    : { ...req.body }
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifié !' }))
    .catch(error => res.status(400).json({ error }))
}

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images')[1]
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimé !' }))
          .catch(error => res.status(400).json({ error }))
      })
    })
    .catch(error => res.status(500).json({ error }))
}

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      // let sauce = sauce;
      // sauce.likes = sauce.usersLiked.length
      res.status(200).json(sauce)
    })
    .catch(error => res.status(404).json({ error }))
}

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }))
}

exports.likeDislikeSauce = (req, res, next) => {
  const userId = req.body.userId
  const like = req.body.like
  const sauceId = req.params.id
  Sauce.findOne({ _id: sauceId })
    .then(sauce => {
      // New value modification
      const newValues = {
        usersLiked: sauce.usersLiked,
        usersDisliked: sauce.usersDisliked,
        likes: 0,
        dislikes: 0
      }
      // In case :
      switch (like) {
        case 1: // sauce liked
          newValues.usersLiked.push(userId)
          break
        case -1: // sauce disliked
          newValues.usersDisliked.push(userId)
          break
        case 0: // delete like/dislike
          if (newValues.usersLiked.includes(userId)) {
            // delete like
            const index = newValues.usersLiked.indexOf(userId)
            newValues.usersLiked.splice(index, 1)
          } else {
            // delete dislike
            const index = newValues.usersDisliked.indexOf(userId)
            newValues.usersDisliked.splice(index, 1)
          }
          break
      };
      // Calcul du nombre de likes / dislikes
      newValues.likes = newValues.usersLiked.length
      newValues.dislikes = newValues.usersDisliked.length
      // Mise à jour de la sauce avec les nouvelles valeurs
      Sauce.updateOne({ _id: sauceId }, newValues)
        .then(() => res.status(200).json({ message: 'Sauce notée !' }))
        .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
}
