const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load models
const User = require('./models/User');
const Item = require('./models/Item');
const Claim = require('./models/Claim');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

const seedData = async () => {
  try {
    // Clear existing data
    await Claim.deleteMany();
    await Item.deleteMany();
    await User.deleteMany();

    console.log('Data Cleared...');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    // Create Users
    const users = await User.create([
      {
        name: 'Muhammad Usman',
        email: 'usman@example.com',
        password: password,
        role: 'admin'
      },
      {
        name: 'M. Hassam Raza',
        email: 'hassam@example.com',
        password: password,
        role: 'user'
      },
      {
        name: 'Test Student',
        email: 'test@example.com',
        password: password,
        role: 'user'
      }
    ]);

    console.log('Users Created...');

    // Create Items
    const items = await Item.create([
      {
        title: 'iPhone 13 Pro',
        description: 'Blue color, found near the cafeteria. No case.',
        category: 'Electronics',
        type: 'Found',
        location: 'Cafeteria Area',
        user: users[0]._id
      },
      {
        title: 'Wallet',
        description: 'Black leather wallet with some cash and ID cards.',
        category: 'Personal Effects',
        type: 'Lost',
        location: 'Library Block',
        user: users[1]._id
      },
      {
        title: 'University ID Card',
        description: 'FA23-BSE-082 ID card found in the lobby.',
        category: 'Documents',
        type: 'Found',
        location: 'Main Lobby',
        user: users[2]._id
      },
      {
        title: 'Laptop Charger',
        description: 'Dell 65W charger left in the lab.',
        category: 'Electronics',
        type: 'Lost',
        location: 'Lab 04',
        user: users[1]._id
      }
    ]);

    console.log('Items Created...');

    // Create a Claim
    await Claim.create({
      item: items[0]._id,
      user: users[1]._id,
      description: 'I lost my blue iPhone 13 yesterday near the cafe. It has a slight scratch on the bottom left.',
      status: 'Pending'
    });

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
