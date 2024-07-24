// index.js
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

// Mock user data
const users = [
    { id: 1, username: 'user1', password: '$2a$10$6uSzGhRZnN/aYocQ47XvSuMLTCEePPTxNo/xlU3oYtG7dB5VYEB0u' } // password: 'password123'
];

// Mock expense data
let expenses = [
    { id: 1, userId: 1, amount: 50, description: 'Lunch' }
];

// Middleware
app.use(bodyParser.json());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
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

// Expense Management Endpoints
app.get('/api/expenses', (req, res) => {
    res.json(expenses);
});

app.post('/api/expenses', (req, res) => {
    const { userId, amount, description } = req.body;
    const newExpense = { id: expenses.length + 1, userId, amount, description };
    expenses.push(newExpense);
    res.status(201).json(newExpense);
});

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

app.delete('/api/expenses/:id', (req, res) => {
    const { id } = req.params;
    expenses = expenses.filter(exp => exp.id != id);
    res.status(204).send();
});

// Expense Calculation Endpoint
app.get('/api/expense', (req, res) => {
    const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    res.json({ total: totalExpense });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
