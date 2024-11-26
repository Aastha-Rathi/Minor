const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// POST /scan-barcode
router.post('/scan-barcode', async (req, res) => {
  try {
    const { barcode, productName, manufacturingDate, expirationDate } = req.body;

    // Save product details, including barcode, to the database
    const newProduct = new Product({
      barcode,  // Include the barcode field
      name: productName,
      manufacturingDate: new Date(manufacturingDate),
      expirationDate: new Date(expirationDate),
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully via barcode scanning.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving product data.' });
  }
});

module.exports = router;
