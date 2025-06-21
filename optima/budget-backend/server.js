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


// =====================
// EXPENSES MODEL & ROUTES
// =====================
const expenseSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  category: String,
  date: { type: Date, default: Date.now },
});
const Expense = mongoose.model('Expense', expenseSchema);

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

// GET endpoint to fetch all expenses
app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find();
    console.log('Fetched Expenses:', expenses);  // Debugging log
    res.status(200).json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Error fetching expenses', error });
  }
});

// POST endpoint to add a new expense
app.post('/api/expenses', async (req, res) => {
  try {
    const { name, amount, category } = req.body;
    const newExpense = new Expense({ name, amount, category });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: 'Error adding expense', error });
  }
});


// PUT endpoint to update an expense by ID
app.put('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, amount, category } = req.body;

    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { name, amount, category },
      { new: true } // Return the updated document
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: 'Error updating expense', error });
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
