const mongoose = require('mongoose');
const { isEmail, isStrongPassword } = require('validator');

// Define the User schema
const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: [isEmail,'Entered email address not valid!']
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters'],
    validate: [isStrongPassword, 'Password not strong enough']
  },
  
},{
  timestamps: true
});

// Create the Admin model
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;