// index.js

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Initialize the Express application
const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Mock user data with hashed password
const users = [
    { id: 1, username: 'user1', password: bcrypt.hashSync('password123', 10) } // Password: 'password123'
];

// Mock expense data
let expenses = [
    { id: 1, userId: 1, amount: 50, description: 'Lunch' }
];

// Basic route
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// User Authentication Endpoint
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    
    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ userId: user.id }, 'secret_key', { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).send('Invalid credentials');
    }
});

// Get all expenses
app.get('/api/expenses', (req, res) => {
    res.json(expenses);
});

// Add a new expense
app.post('/api/expenses', (req, res) => {
    const { userId, amount, description } = req.body;
    const newExpense = { id: expenses.length + 1, userId, amount, description };
    expenses.push(newExpense);
    res.status(201).json(newExpense);
});

// Update an existing expense
app.put('/api/expenses/:id', (req, res) => {
    const { id } = req.params;
    const { amount, description } = req.body;
    const expense = expenses.find(exp => exp.id == id);
    
    if (expense) {
        expense.amount = amount;
        expense.description = description;
        res.json(expense);
    } else {
        res.status(404).send('Expense not found');
    }
});

// Delete an existing expense
app.delete('/api/expenses/:id', (req, res) => {
    const { id } = req.params;
    expenses = expenses.filter(exp => exp.id != id);
    res.status(204).send();
});

// Calculate total expenses
app.get('/api/expense', (req, res) => {
    const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    res.json({ total: totalExpense });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

