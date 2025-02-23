const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Setup Express
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());  // To parse incoming JSON requests

// Connect to MongoDB
mongoose.connect('mongodb+srv://riddheshfirake:0FM5UIigIo9s0bEv@cluster0.w8u8v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Budget Schema
const budgetSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  emoji: String,
});

const Budget = mongoose.model('Budget', budgetSchema);


// POST endpoint to create a new budget
app.post('/api/budgets', async (req, res) => {
  try {
    const { name, amount, emoji } = req.body;
    const newBudget = new Budget({ name, amount, emoji });
    await newBudget.save();
    res.status(201).json(newBudget);
  } catch (error) {
    res.status(500).json({ message: 'Error creating budget', error });
  }
});

// GET endpoint to fetch total budget
app.get('/api/total-budget', async (req, res) => {
  try {
    const totalBudget = await Budget.aggregate([
      {
        $group: {
          _id: null, // Group all documents
          totalAmount: { $sum: "$amount" }, // Sum all amounts
        },
      },
    ]);

    // If there are no budgets, return 0
    res.status(200).json({ totalBudget: totalBudget.length > 0 ? totalBudget[0].totalAmount : 0 });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating total budget', error });
  }
});


// GET endpoint to fetch all budgets
app.get('/api/budgets', async (req, res) => {
    try {
      const budgets = await Budget.find(); // Fetch all budgets
      res.status(200).json(budgets); // Return the list of budgets
    } catch (error) {
      res.status(500).json({ message: 'Error fetching budgets', error });
    }
  });
  

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
