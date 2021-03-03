const Sauce = require ("../models/sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: [],
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  };

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
         } : { ...req.body};
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
       const filename = sauce.imageUrl.split("/images")[1]; 
       fs.unlink(`images/${filename}`, () =>{
        Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
        .catch(error => res.status(400).json({ error }));
       });
    })
    .catch(error => res.status(500).json({error}));
  };

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
         // let sauce = sauce;
         // sauce.likes = sauce.usersLiked.length
          return res.status(200).json(sauce)
      })
      .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
};

exports.likeDislikeSauce = (req, res, next) => {
    console.log(req.body.like)
    let like = req.body.like
    let option = {}
    switch(like) {
        case -1:
            console.log("case -1");
            option =
                {
                    $push : { usersDisliked : req.body.userId },
                    $inc: { dislikes : 1 }
                };
            break;
        case 0:
            console.log("case 0");
            //if (user)
            option =
                {
                    $pull : { usersLiked : req.body.userId },
                    $pull : { usersDisliked : req.body.userId },
                    $dec: { likes : 1 },
                    $dec: { dislikes : 1 }
                };
            break;
        case 1:
            console.log("case 1");
            console.log(req.body);
            option =
                {   
                    $inc : { likes : 1 },
                    $push : { usersLiked : req.body.userId }
                };
            break;
    }
    Sauce.updateOne({ _id: req.params.id }, option)
        .then(() => res.status(200).json({ message: "Objet Liké!" }))      
        .catch(error => res.status(400).json({ error }));
};




