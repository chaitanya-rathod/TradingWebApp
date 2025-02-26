// Load environment variables
require('dotenv').config();

// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');  
const cors = require('cors');

// Import models and data
const { userData } = require('./data/data.js'); 
const { User } = require('./model/UserModel');
const { HoldingsModel } = require('./model/HoldingsModel');
const { PositionsModel } = require('./model/PositionsModel');
const { OrdersModel } = require('./model/OrdersModel');

// Environment variables
const PORT = process.env.PORT || 3002;
const url = process.env.MONGO_URL; // MongoDB Atlas URL from .env

// Initialize express app
const app = express();

// Use middleware
app.use(cors());
app.use(bodyParser.json()); // Use bodyParser to parse JSON request bodies

// Connect to MongoDB Atlas
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.log("MongoDB connection error:", error));

// Signup route
app.get("/signup", (req, res) => {
  res.status(200).send("Sign up for an account");
});
app.post("/signup", async (req, res) => {
  try {
    const { email, username, password } = req.body; // Get form data from request body

    // Create new user with form data
    const newUser = new User({
      email,
      username,
      password,
    });

    // Save user to MongoDB
    await newUser.save();

    res.status(200).send("User registered successfully!");
  } catch (error) {
    res.status(500).send("Error registering user: " + error.message);
  }
});

// Login route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if the password matches
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // If successful, return success message
    res.status(200).json({ message: "Login successful" });

  } catch (error) {
    res.status(500).send("Error logging in: " + error.message);
  }
});


// POST route to add users from userData
app.post('/addUsers', async (req, res) => {
  try {
    for (let i = 0; i < userData.length; i++) {
      const { email, username, password } = userData[i];
      const newUser = new User({ email, username, password });
      await newUser.save();  // Save user to MongoDB
    }
    res.status(200).send("Users added successfully to MongoDB");
  } catch (error) {
    res.status(500).send("Error adding users: " + error.message);
  }
});

// Fetch all holdings
app.get('/allHoldings', async (req, res) => {
  try {
    let allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
  } catch (error) {
    res.status(500).send("Error fetching holdings: " + error);
  }
});

// Fetch all positions
app.get('/allPositions', async (req, res) => {
  try {
    let allPositions = await PositionsModel.find({});
    res.json(allPositions);
  } catch (error) {
    res.status(500).send("Error fetching positions: " + error);
  }
});

// Add new order
app.post("/newOrder", async (req, res) => {
  try {
    let newOrder = new OrdersModel({
      name: req.body.name,
      qty: req.body.qty,
      price: req.body.price, // Corrected price field
      mode: req.body.mode,
    });
    await newOrder.save();
    res.status(200).send("Order saved successfully!");
  } catch (error) {
    res.status(500).send("Error saving order: " + error);
  }
});

// Fetch all orders
app.get("/Orders", async (req, res) => {
  try {
    let allOrders = await OrdersModel.find({});
    res.json(allOrders);
  } catch (error) {
    res.status(500).send("Error fetching orders: " + error);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
