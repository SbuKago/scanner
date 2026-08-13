const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection Config
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'dispatch_db'
});

// Endpoint: Lookup product by Barcode directly from MySQL
app.get('/api/products/:barcode', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT barcode, product_code AS productCode, description, weight FROM products WHERE barcode = ?', 
            [req.params.barcode]
        );
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint: Fetch all products for the Product Master tab
app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log('Dispatch API Server running on port 3000'));