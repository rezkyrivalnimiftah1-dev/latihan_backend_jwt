// controllers/movieController.js
const pool = require('../config/db');

module.exports = {
    // GET /api/movies
    getAll: async (req, res, next) => {
        try {
            // join category to get category name
            const [rows] = await pool.execute(
                `SELECT m.*, c.name AS categoryName
                FROM movies m
                LEFT JOIN categories c ON m.categoryId = c.id
                ORDER BY m.id DESC`
            );
            res.json(rows);
        } catch (err) { next(err); }
    },
    
// GET /api/movies/:id
getById: async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const [rows] = await pool.execute(
            `SELECT m.*, c.name AS categoryName
            FROM movies m
            LEFT JOIN categories c ON m.categoryId = c.id
            WHERE m.id = ?`, [id]
        );
        if (rows.length === 0) return res.status(404).json({ message: 'Movie tidak ditemukan' });
        res.json(rows[0]);
    } catch (err) { next(err); }
},

//create // protecd

    // ... (kode sebelumnya)

    // POST /api/movies (protected)
    create: async (req, res, next) => {
    try {
        const { title, year, categoryId } = req.body;
        const userId = req.user ? req.user.id : null;

        const [result] = await pool.execute(
            'INSERT INTO movies (title, year, categoryId, userId) VALUES (?, ?, ?, ?)',
            [title, year || null, categoryId || null, userId]
        );
        res.status(201).json({ id: result.insertId, title, year: year || null, categoryId: categoryId || null });
    } catch (err) { next(err); }
},

//update/edit
// PUT /api/movies/:id (protected)
update: async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { title, year, categoryId } = req.body;

        const fields = [];
        const values = [];
        if (title !== undefined) { fields.push('title = ?'); values.push(title); }
        if (year !== undefined) { fields.push('year = ?'); values.push(year); }
        if (categoryId !== undefined) { fields.push('categoryId = ?'); values.push(categoryId); }

        if (fields.length === 0) return res.status(400).json({ message: 'Nothing to update' });

        values.push(id);
        const sql = `UPDATE movies SET ${fields.join(', ')} WHERE id = ?`;
        const [result] = await pool.execute(sql, values);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Movie tidak ditemukan' });
        res.json({ message: 'Movie diperbarui' });
    } catch (err) { next(err); }
},

// DELETE /api/movies/:id (protected)
remove: async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const [result] = await pool.execute('DELETE FROM movies WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Movie tidak ditemukan' });
        res.json({ message: 'Movie dihapus' });
    } catch (err) { next(err); }
}
}