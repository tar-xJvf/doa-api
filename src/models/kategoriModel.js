//kategoriModel.js
const pool = require('../config/db');


const Kategori = {

    getAllKategori: async ({ page = 1, limit = 10, q = '' }) => {
        const offset = (page - 1) * limit;
        const search = `%${q}%`;
        const result = await pool.query(
            `SELECT * FROM kategori_tbl
       WHERE nama_kategori ILIKE $1
       ORDER BY id DESC
       LIMIT $2 OFFSET $3`,
            [search, limit, offset]
        );
        return result; // biarkan controller yang ambil result.rows
    },

    getById: async (id) => {
        const result = await pool.query('select * from kategori_tbl where id =$1', [id]);
        return result.rows[0];
    },
    //single data

    create: async (data) => {
        const { nama_kategori, deskripsi } = data;
        const result = await pool.query(
            `insert into kategori_tbl(nama_kategori,deskripsi) 
            values($1,$2)returning *`,
            [nama_kategori, deskripsi]
        );
        return result.rows[0];
    },
    //bulk insert
    createMany: async (dataArray) => {
        const values = [];
        const placeholders = [];

        dataArray.forEach((item, index) => {
            const i = index * 2;
            values.push(
                item.nama_kategori,
                item.deskripsi
            );
            placeholders.push(`($${i + 1}, $${i + 2})`);
        });
        const result = await pool.query(
            `insert into kategori_tbl(nama_kategori,deskripsi) 
             values ${placeholders.join(', ')}
              RETURNING *`,
            values

        );
        return result.rows

    },

    update: async (id, data) => {
        const { nama_kategori, deskripsi } = data;
        const result = await pool.query(
            `UPDATE kategori_tbl
         SET nama_kategori = $1,
             deskripsi = $2,
             updated_at = NOW()
         WHERE id = $3
         RETURNING *`,
            [nama_kategori, deskripsi, id]
        );
        return result.rows[0];
    },

    // Single delete
delete: async (id) => {
    const result = await pool.query(
        `DELETE FROM kategori_tbl WHERE id = $1 RETURNING *`,
        [id]
    );
    return result.rows[0]; // single
},

// Bulk delete (pakai array id)
deleteMany: async (idArray) => {
    const result = await pool.query(
        `DELETE FROM kategori_tbl 
         WHERE id = ANY($1) 
         RETURNING *`,
        [idArray]
    );
    return result.rows; // array
}

};

module.exports = Kategori