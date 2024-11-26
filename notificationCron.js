const cron = require('node-cron');
const Product = require('./models/Product');

// Notification Logic
cron.schedule('0 0 * * *', async () => {
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  try {
    // Find products expiring within the next 7 days
    const expiringProducts = await Product.find({
      expirationDate: { $gte: today, $lte: nextWeek },
    });

    expiringProducts.forEach((product) => {
      console.log(`Reminder: ${product.productName} will expire on ${product.expirationDate}`);
      // Here you can send notifications to the user (e.g., via email, push notification)
    });
  } catch (error) {
    console.error('Error in notification job:', error);
  }
});
