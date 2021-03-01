const express = require("express");
const router = express.Router();

const auth = require ("../middleware/auth");
const saucesCtrl = require("../controllers/sauces");
const multer = require("../middleware/multer-config");

router.get('/', auth, saucesCtrl.getAllSauces);
router.post('/', auth, multer, saucesCtrl.createSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id',auth, saucesCtrl.deleteSauce);
router.get('/:id', auth, saucesCtrl.getOneSauce);


module.exports = router;