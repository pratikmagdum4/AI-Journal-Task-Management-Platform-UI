const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Route to handle signup form submission
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    
    // You can handle the data here (e.g., save it to a database)
    console.log('Signup Data:', { username, email, password });

    // Send a response back to the frontend
    res.json({ message: 'Signup successful!' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
