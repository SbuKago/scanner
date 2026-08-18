const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serves index.html, app.js, style.css

// MySQL Pool Connection Configuration
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'your_mysql_password', // Update to your DB password
  database: 'dispatch_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Barcode Scanning API Endpoint
app.post('/api/scan', async (req, res) => {
  const { scannedBarcode } = req.body;

  if (!scannedBarcode || typeof scannedBarcode !== 'string') {
    return res.status(400).json({ error: 'A valid scannedBarcode string is required' });
  }

  // Matches 'CASE' scans before 'UNIT' scans
  const cleanBarcode = scannedBarcode.trim();
  // Strip leading '1' if scanning a 14-digit GTIN-14 outer barcode
  const alternativeBarcode = (cleanBarcode.length === 14 && cleanBarcode.startsWith('1')) 
    ? cleanBarcode.substring(1) 
    : cleanBarcode;

  const query = `
    SELECT 
      product_code,
      scanned_barcode,
      scan_type,
      multiplier,
      units_per_case,
      description,
      cases_per_pallet
    FROM vw_all_barcodes 
    WHERE scanned_barcode IN (?, ?) 
    ORDER BY FIELD(scan_type, 'CASE', 'UNIT') ASC
    LIMIT 1;
  `;

  const [rows] = await db.execute(query, [cleanBarcode, alternativeBarcode]);

  try {
    const [rows] = await db.execute(query, [scannedBarcode.trim()]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Barcode not found' });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error('Database Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});