if (typeof crypto === 'undefined') global.crypto = require('crypto').webcrypto;
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load models
const User = require('./models/User');
const Item = require('./models/Item');
const Claim = require('./models/Claim');
const Comment = require('./models/Comment');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

const seedData = async () => {
  try {
    // Clear existing data
    await Comment.deleteMany();
    await Claim.deleteMany();
    await Item.deleteMany();
    await User.deleteMany();

    console.log('Data Cleared...');

    const seedPassword = 'password123';

    // Create Users (plain password; User model pre-save hook hashes it)
    const users = await User.create([
      {
        name: 'Muhammad Usman',
        email: 'usman@example.com',
        password: seedPassword,
        role: 'admin'
      },
      {
        name: 'M. Hassam Raza',
        email: 'hassam@example.com',
        password: seedPassword,
        role: 'user'
      },
      {
        name: 'Test Student',
        email: 'test@example.com',
        password: seedPassword,
        role: 'user'
      }
    ]);

    console.log('Users Created...');

    // Create Items
    const items = await Item.create([
      {
        title: 'iPhone 13 Pro',
        description: 'Blue color iPhone 13 Pro found near the cafeteria. No case. Screen is intact.',
        category: 'Electronics',
        type: 'Found',
        location: 'Cafeteria Area',
        status: 'Active',
        user: users[0]._id
      },
      {
        title: 'Black Leather Wallet',
        description: 'Black leather wallet with some cash and two ID cards. Lost somewhere near the library block.',
        category: 'Personal Effects',
        type: 'Lost',
        location: 'Library Block',
        status: 'Active',
        user: users[1]._id
      },
      {
        title: 'University ID Card',
        description: 'FA23-BSE-082 student ID card found in the main lobby near the reception desk.',
        category: 'Documents',
        type: 'Found',
        location: 'Main Lobby',
        status: 'Resolved',
        user: users[2]._id
      },
      {
        title: 'Dell Laptop Charger',
        description: 'Dell 65W laptop charger left in Lab 04. Has a small sticker on it.',
        category: 'Electronics',
        type: 'Lost',
        location: 'Lab 04',
        status: 'Active',
        user: users[1]._id
      },
      {
        title: 'Blue Backpack',
        description: 'Blue Nike backpack with a water bottle inside. Found in the parking area.',
        category: 'Personal Effects',
        type: 'Found',
        location: 'Parking Area',
        status: 'Active',
        user: users[0]._id
      },
      {
        title: 'Prescription Glasses',
        description: 'Black framed prescription glasses in a brown case. Lost near the canteen.',
        category: 'Personal Effects',
        type: 'Lost',
        location: 'Canteen',
        status: 'Active',
        user: users[2]._id
      },
      {
        title: 'USB Flash Drive',
        description: '32GB SanDisk flash drive, red color. Found on a desk in the computer lab.',
        category: 'Electronics',
        type: 'Found',
        location: 'Computer Lab 2',
        status: 'Active',
        user: users[0]._id
      },
      {
        title: 'Student Notebook',
        description: 'Spiral notebook with "Data Structures" notes. Name on cover: Ali Hassan.',
        category: 'Documents',
        type: 'Found',
        location: 'Lecture Hall B',
        status: 'Active',
        user: users[2]._id
      }
    ]);

    console.log('Items Created...');

    // Create Claims
    await Claim.create([
      {
        item: items[0]._id,
        user: users[1]._id,
        description: 'I lost my blue iPhone 13 yesterday near the cafe. It has a slight scratch on the bottom left corner and my wallpaper is a mountain photo.',
        status: 'Pending'
      },
      {
        item: items[4]._id,
        user: users[2]._id,
        description: 'That is my blue Nike backpack. Inside there should be a red water bottle and a calculator along with some notebooks.',
        status: 'Approved'
      }
    ]);

    console.log('Claims Created...');

    // Create Comments
    await Comment.create([
      {
        item: items[0]._id,
        user: users[1]._id,
        text: 'Is the phone still available? I think it might be mine. What is the exact model number?'
      },
      {
        item: items[0]._id,
        user: users[0]._id,
        text: 'Yes it is still here. Please come to the admin office with proof of ownership.'
      },
      {
        item: items[1]._id,
        user: users[2]._id,
        text: 'I found a wallet near the library yesterday. Can you describe what cards were inside?'
      },
      {
        item: items[3]._id,
        user: users[0]._id,
        text: 'Found a Dell charger in Lab 04. Please check at the security desk.'
      },
      {
        item: items[6]._id,
        user: users[2]._id,
        text: 'Is it a USB 3.0 drive? I lost one similar to this last week.'
      }
    ]);

    console.log('Comments Created...');
    console.log('Data Imported Successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
