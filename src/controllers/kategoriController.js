//kategoriController.js

const Joi = require('joi');
const Kategori = require('../models/kategoriModel');


const kategoriSchema = Joi.object({
  nama_kategori: Joi.string().min(2).max(100).required(),
  deskripsi: Joi.string().allow('', null),
});
const schemaCreateKategori = Joi.alternatives().try(
  kategoriSchema,
  Joi.array().items(kategoriSchema)
);

const schemaUpdateKategori = Joi.object({
  nama_kategori: Joi.string().min(2).max(100).required(),
  deskripsi: Joi.string().allow('', null),
}

);
exports.getAllKategori = async (req, res) => {
  try {
    const { page = 1, limit = 10, q = '' } = req.query;
    const result = await Kategori.getAllKategori({ page, limit, q });

    res.status(200).json({
      success: true,
      message: "Data kategori berhasil diambil",
      data: result.rows, // karena model return result
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: result.rowCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getKategoriById = async (req, res) => {
  try {
    const data = await Kategori.getById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' })
    res.status(200).json({
      success: true,
      message: "Data berhasil diambil",
      data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });

  }
};

exports.createKategori = async (req, res) => {
  try {
    const { error, value } = schemaCreateKategori.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    let data;
    if (Array.isArray(value)) {
      //bulk insert
      data = await Kategori.createMany(value);
    } else {
      //single insert
      data = await Kategori.create(value);
    }

    res.status(201).json({
      success: true,
      message: Array.isArray(value)
        ? "Berhasil menambahkan banyak data"
        : "Berhasil menambahkan data baru",
      data
    });
  }catch (error) {
      if (error.code === '23505') {
        return res.status(409).json({
          success: false,
          message: 'Nama kategori sudah digunakan'
        });
      }
      res.status(500).json({
        success: false,
        message: error.message
      });
    };
  }


exports.updateKategori = async (req, res) => {
    try {
      const { error, value } = schemaUpdateKategori.validate(req.body);
      if (error) return res.status(400).json({ success: false, message: error.message });

      const updated = await Kategori.update(req.params.id, value);
      if (!updated) return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' });
      res.status(200).json({
        success: true,
        message: "Perubahan data berhasil disimpan",
        data: updated
      });
    } catch (err) {
      if (err.code === '23505') {
        return res.status(409).json({ success: false, message: 'Nama kategori sudah digunakan' });
      }
      res.status(500).json({ success: false, message: err.message });
    }
  };


// Single delete
exports.deleteKategori = async (req, res) => {
  try {
    const deleted = await Kategori.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' });
    }
    res.status(200).json({
      success: true,
      message: "Penghapusan data berhasil",
      data: deleted
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Bulk delete
exports.deleteManyKategori = async (req, res) => {
  try {
    const ids = req.body.ids; // contoh: { "ids": [1, 2, 3] }

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: "Harus kirim array id" });
    }

    const deleted = await Kategori.deleteMany(ids);
    if (deleted.length === 0) {
      return res.status(404).json({ success: false, message: "Tidak ada kategori ditemukan" });
    }

    res.status(200).json({
      success: true,
      message: "Penghapusan data berhasil",
      data: deleted
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

