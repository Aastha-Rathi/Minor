const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  manufacturingDate: { type: Date, required: true },
  expirationDate: { type: Date, required: true },
  barcode: { type: String }, 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Product', productSchema);
