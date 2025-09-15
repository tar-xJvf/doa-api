const express = require('express');
const router = express.Router();

const doaController = require('../controllers/doaController');
const apiKeyAuth = require('../middleware/apiKeyAuth');
const authAdmin = require('../middleware/authAdmin');

//public reader / search

router.get('/',apiKeyAuth,doaController.getAllDoa);
router.get('/:id',apiKeyAuth,doaController.getDoaById);


//Admin CRUD

router.post('/',authAdmin,doaController.createDoa);
router.put('/:id',authAdmin,doaController.updateDoa);
// bulk delete
router.delete('/bulk',authAdmin,doaController.deleteManyDoa);
// single delete
router.delete('/:id',authAdmin,doaController.deleteDoa);

module.exports = router;