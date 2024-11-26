const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const router = express.Router();

// Add product manually
router.post(
  '/add',
  [
    body('productName').notEmpty().withMessage('Product name is required'),
    body('manufacturingDate').isISO8601().withMessage('Valid manufacturing date is required'),
    body('expirationDate').isISO8601().withMessage('Valid expiration date is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productName, manufacturingDate, expirationDate, barcode, userId } = req.body;

    try {
      const product = new Product({
        productName,
        manufacturingDate,
        expirationDate,
        barcode,
        userId,
      });

      await product.save();
      res.status(201).json({ message: 'Product added successfully', product });
    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
