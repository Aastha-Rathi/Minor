const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

// Sign-Up Route
router.post(
  '/signup',
  [
    // Validation for username, email, and securityCode
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Enter a valid email'),
    body('securityCode')
      .isLength({ min: 6, max: 6 })
      .isNumeric()
      .withMessage('Security code must be exactly 6 digits'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, securityCode } = req.body;

    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the security code
      const hashedCode = await bcrypt.hash(securityCode, 10);

      // Save the new user
      const newUser = new User({
        username,
        email,
        securityCode: hashedCode, // Store the hashed code
      });

      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error in signup:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Login Route
router.post(
  '/login',
  [
    // Validation for email and securityCode
    body('email').isEmail().withMessage('Enter a valid email'),
    body('securityCode')
      .isLength({ min: 6, max: 6 })
      .isNumeric()
      .withMessage('Security code must be exactly 6 digits'),
  ],
  async (req, res) => {
    console.log('Request Body:', req.body); 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

      return res.status(400).json({ errors: errors.array() });
    }

    const { email, securityCode } = req.body;

    try {
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or security code' });
      }

      
      console.log('Hashed Security Code from DB:', user.securityCode); 
      console.log('Security Code from Request:', securityCode); 

      // Compare security codes
      const isMatch = await bcrypt.compare(securityCode, user.securityCode);
      console.log('Does the security code match?', isMatch); 
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or security code' });
      }

      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', {
        expiresIn: '1h',
      });

      res.json({ token, message: 'Login successful' });
    } catch (error) {
      console.error('Error in login:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
