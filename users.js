const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 8081;

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://ms:WebServices%40890@cluster0.chcgobw.mongodb.net/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((error) => {
  console.log('Failed to connect to MongoDB Atlas', error);
});

// Create a user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// Create a user model
const User = mongoose.model('User', userSchema);

// Parse JSON bodies for POST and PUT requests
app.use(express.json());

// Create a new user
app.post('/add', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ success: true, message: 'User added', users : user });
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({ success: true, message: 'User retrieved' });
    res.json(users);
  } catch (err) {
    res.status(500).send(err);
  }
});


// Update a user by ID
app.put('/update/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).send({ success: true, message: 'User updated' });
    }
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete a user by ID
app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
