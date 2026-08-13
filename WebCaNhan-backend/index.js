require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init db
require('./src/dbs/init.sql');

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// init routes
app.use('/', require('./src/routes'));

// handling errors
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

const errorMiddleware = require('./src/middlewares/error.middleware');
app.use(errorMiddleware);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
