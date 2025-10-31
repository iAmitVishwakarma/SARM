import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// ... registerUser, loginUser, logoutUser functions ...
// (Aapke existing functions jaise hain waise hi rahenge)

// @desc    Register (Create) a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { shopName, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({
    shopName,
    email,
    password: hashedPassword,
  });
  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      shopName: user.shopName,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user (Login) & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      shopName: user.shopName,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private (soon)
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
});


// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  if (req.user) {
    res.status(200).json({
      _id: req.user._id,
      shopName: req.user.shopName,
      email: req.user.email,
      // --- SEND FULL PROFILE ---
      gstin: req.user.gstin,
      address: req.user.address,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// --- NEW FUNCTION ---
// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.shopName = req.body.shopName || user.shopName;
    user.email = req.body.email || user.email;
    user.gstin = req.body.gstin || user.gstin;
    user.address = req.body.address || user.address;

    // Optional: Agar password update karna hai (abhi skip kar rahe hain)
    // if (req.body.password) {
    //   const salt = await bcrypt.genSalt(10);
    //   user.password = await bcrypt.hash(req.body.password, salt);
    // }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      shopName: updatedUser.shopName,
      email: updatedUser.email,
      gstin: updatedUser.gstin,
      address: updatedUser.address,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


export { registerUser, loginUser, logoutUser , getUserProfile, updateUserProfile }; // --- ADDED updateUserProfile ---