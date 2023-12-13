const mongoose = require('mongoose');


const transactionSchema = new mongoose.Schema({
  userId: {
    type: String, // Assuming you have a User model with an ObjectId as the primary key
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
    default:'stripe'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Export the model to be used in other parts of your application
module.exports = Transaction;