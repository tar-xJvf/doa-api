const express = require('express');
const router = express.Router();

const { 
  getAllKategori, 
  getKategoriById, 
  createKategori, 
  updateKategori,
  deleteKategori,
  deleteManyKategori
} = require('../controllers/kategoriController');

const apiKeyAuth = require('../middleware/apiKeyAuth');
const authAdmin = require('../middleware/authAdmin');

// Reader (mobile app) - butuh x-api-key
router.get('/', apiKeyAuth, getAllKategori);
router.get('/:id', apiKeyAuth, getKategoriById);

// Admin (backoffice) - butuh x-admin-secret
router.post('/', authAdmin, createKategori);
router.put('/:id', authAdmin, updateKategori);

// Bulk delete (letakkan duluan sebelum :id)
router.delete('/bulk', authAdmin, deleteManyKategori);

// Single delete
router.delete('/:id', authAdmin, deleteKategori);

module.exports = router;
