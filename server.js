const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cron = require('node-cron'); // For scheduling notifications
const nodemailer = require('nodemailer'); // For sending email notifications
const Product = require('./models/Product'); // Import Product model

// Initialize the app
const app = express();

// Import routes
const barcodeRoutes = require('./routes/barcode'); // Barcode-based product entry
const manualEntryRoutes = require('./routes/manualEntry'); // Manual product entry
const authRoutes = require('./routes/auth'); // Authentication routes

// Middleware to parse incoming JSON requests
app.use(express.json());

// Use routes under '/api'
app.use('/api/barcode', barcodeRoutes);
app.use('/api/manual-entry', manualEntryRoutes);
app.use('/api/auth', authRoutes);

// Serve static files (e.g., HTML, CSS, JS) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose
  .connect(
    'mongodb+srv://aastharathi0404:kavitarathi29@cluster0.bciml.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
  )
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Set the port number
const PORT = process.env.PORT || 5000;

// Cron Job for Notifications
cron.schedule('0 0 * * *', async () => {
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  try {
    // Find products expiring within the next 7 days
    const expiringProducts = await Product.find({
      expirationDate: { $gte: today, $lte: nextWeek },
    });

    expiringProducts.forEach(async (product) => {
      console.log(`Reminder: ${product.productName} will expire on ${product.expirationDate}`);
      
      // Optional: Send email notifications
      if (product.userId) {
        const user = await User.findById(product.userId); // Assuming User model exists
        if (user && user.email) {
          sendNotification(user.email, product.productName, product.expirationDate);
        }
      }
    });
  } catch (error) {
    console.error('Error in notification job:', error);
  }
});

// Nodemailer Email Notification Function
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kavitarathi942@gmail.com', 
    pass: '152919aastha', 
  },
});

const sendNotification = (email, productName, expirationDate) => {
  const mailOptions = {
    from: 'kavitarathi942@gamil.com',
    to: email,
    subject: 'Product Expiration Reminder',
    text: `Reminder: Your product "${productName}" will expire on ${expirationDate}. Please consume it soon.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log(`Notification sent to ${email}: ${info.response}`);
    }
  });
};

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
