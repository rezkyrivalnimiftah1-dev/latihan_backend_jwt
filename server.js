// server.js
require('dotenv').config(); // load .env
const express = require('express');
const app = express();

// routes
const authRoutes = require('./routes/authroutes');
const categoryRoutes = require('./routes/categoryroutes');
const movieRoutes = require('./routes/movieroutes');

// middleware global
app.use(express.json()); // parse JSON body

// mount routes
app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/movies', movieRoutes);

// basic error handler (simple)
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan pada port ${PORT}`);
});