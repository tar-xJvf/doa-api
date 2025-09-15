
const pool = require('../config/db');

const Doa = {
    getAll: async ({ page = 1, limit = 10, q = '' }) => {
        const offset = (page - 1) * limit;
        const search = `%${q}%`;
        const result = await pool.query(
            `SELECT * FROM doa_tbl 
            WHERE judul ILIKE $1 
            ORDER BY id DESC
            LIMIT $2 OFFSET $3`,
            [search, limit, offset]
        );
        return result;
    },

    getById: async (id) => {
        const result = await pool.query('SELECT * FROM doa_tbl WHERE id = $1', [id]);
        return result.rows[0];
    },

    // SINGLE INSERT
    create: async (data) => {
        const { judul, tulisan_arab, tulisan_latin, terjemah, kategori_id } = data;
        const result = await pool.query(
            `INSERT INTO doa_tbl (judul, tulisan_arab, tulisan_latin, terjemah, kategori_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [judul, tulisan_arab, tulisan_latin, terjemah, kategori_id]
        );
        return result.rows[0];
    },

    // BULK INSERT
    createMany: async (dataArray) => {
        const values = [];
        const placeholders = [];

        dataArray.forEach((item, index) => {
            const i = index * 5;
            values.push(
                item.judul,
                item.tulisan_arab,
                item.tulisan_latin,
                item.terjemah,
                item.kategori_id
            );
            placeholders.push(`($${i + 1}, $${i + 2}, $${i + 3}, $${i + 4}, $${i + 5})`);
        });

        const result = await pool.query(
            `INSERT INTO doa_tbl (judul, tulisan_arab, tulisan_latin, terjemah, kategori_id)
            VALUES ${placeholders.join(', ')}
            RETURNING *`,
            values
        );
        return result.rows;
    },

    updateDoa: async (id, data) => {
        const { judul, tulisan_arab, tulisan_latin, terjemah, kategori_id } = data;
        const result = await pool.query(
            `UPDATE doa_tbl SET 
            judul=$1, tulisan_arab=$2,
            tulisan_latin=$3, terjemah=$4,
            kategori_id=$5, updated_at=NOW() 
            WHERE id=$6 RETURNING *`,
            [judul, tulisan_arab, tulisan_latin, terjemah, kategori_id, id]
        );
        return result.rows[0];
    },

    //single delete
    delete: async (id) => {
        const result = await pool.query(
            'DELETE FROM doa_tbl WHERE id = $1 RETURNING *',
            [id]
        );
        return result.rows[0];
    },

    //bulk delete(pakai array id)
    deleteMany: async(idArray)=>{
        const result = await pool.query(
            `DELETE FROM doa_tbl
             WHERE id= ANY($1)
             RETURNING *`,
             [idArray]
        );
        return result.rows
    }
};

module.exports = Doa;
