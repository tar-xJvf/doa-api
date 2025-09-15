const Joi = require('joi');
const Doa = require('../models/doaModel');
const Kategori = require('../models/kategoriModel');


//schema validasi

const doaSchema = Joi.object({
  judul: Joi.string().min(2).max(100).required(),
  tulisan_arab: Joi.string().min(2).required(),
  tulisan_latin: Joi.string().min(2).required(),
  terjemah: Joi.string().min(2).required(),
  kategori_id: Joi.number().required()
});


const schemaCreateDoa = Joi.alternatives().try(
  doaSchema,
  Joi.array().items(doaSchema)
);


const schemaUpdateDoa = Joi.object({
  judul: Joi.string().min(2).max(100).required(),
  tulisan_arab: Joi.string().min(2).required(),
  tulisan_latin: Joi.string().min(2).required(),
  terjemah: Joi.string().min(2).required(),
  kategori_id: Joi.number().required()
});


exports.getAllDoa = async (req, res) => {
  try {
    const { page = 1, limit = 10, q = '' } = req.query;
    const result = await Doa.getAll({ page, limit, q });

    res.status(200).json({
      success: true,
      message: "Data doa berhasil diambil",
      data: result.rows,
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

exports.getDoaById = async (req, res) => {
  try {
    const data = await Doa.getById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Doa tidak ditemukan' });
    res.status(200).json({
      success: true,
      message: "Data berhasil diambil",
      data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.createDoa = async (req, res) => {
  try {
    // Validasi: single object atau array
    const { error, value } = schemaCreateDoa.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    let data;
    if (Array.isArray(value)) {
      // Bulk insert
      data = await Doa.createMany(value);
    } else {
      // Single insert
      data = await Doa.create(value);
    }

    res.status(201).json({
      success: true,
      message: Array.isArray(value)
        ? "Berhasil menambahkan banyak data"
        : "Berhasil menambahkan data baru",
      data
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'Nama doa sudah digunakan'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.updateDoa = async (req, res) => {
  try {
    const { error, value } = schemaUpdateDoa.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.message });

    const updated = await Doa.updateDoa(req.params.id, value);
    if (!updated) return res.status(404).json({ success: false, message: 'Doa tidak ditemukan' });
    res.status(200).json({
      success: true,
      message: "Perubahan data berhasil disimpan",
      data: updated
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Nama Doa sudah digunakan' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Single delete
exports.deleteDoa = async (req, res) => {
  try {
    const deleted = await Doa.delete(req.params.id);
    if (!deleted) return res.status(404).json({
       success: false, 
       message: 'Doa tidak ditemukan' });
    res.status(200).json({
      success: true,
      message: "Penghapusan data berhasil",
      data: deleted
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Bulk Delete

exports.deleteManyDoa = async (req, res) => {
  try {

    const ids = req.body.ids;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Harus kirim array id"
      });
    }
    const deleted = await Doa.deleteMany(ids);
    if (deleted === 0) {
      return res.status(404).json({
        success: false,
        message: "Tidak ada Doa ditemukan"
      });
    }
    res.status(200).json({
      success: true,
      message: "Penghapusan data berhasil",
      data: deleted
    });


  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};