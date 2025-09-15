
const express = require('express');
const cors = require('cors');

const doaRoutes = require('./routers/doaRoutes');
const kategoriRoutes = require('./routers/kategoriRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1/doa',doaRoutes);
app.use('/api/v1/kategori', kategoriRoutes);

module.exports = app;