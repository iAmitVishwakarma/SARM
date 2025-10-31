import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register (Create) a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { shopName, email, password } = req.body;

  // 1. Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400); // Bad Request
    throw new Error('User already exists');
  }

  // 2. Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 3. Create new user in database
  const user = await User.create({
    shopName,
    email,
    password: hashedPassword,
  });

  if (user) {
    // 4. Generate token and send response
    generateToken(res, user._id);
    res.status(201).json({ // 201 = Created
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

  // 1. Find user by email
  const user = await User.findOne({ email });

  // 2. Check if user exists and password matches
  if (user && (await bcrypt.compare(password, user.password))) {
    // 3. Generate token and send response
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      shopName: user.shopName,
      email: user.email,
    });
  } else {
    res.status(401); // Unauthorized
    throw new Error('Invalid email or password');
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private (soon)
const logoutUser = asyncHandler(async (req, res) => {
  // Cookie ko clear kar do
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
  // req.user humein 'protect' middleware se mil raha hai
  if (req.user) {
    res.status(200).json({
      _id: req.user._id,
      shopName: req.user.shopName,
      email: req.user.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export { registerUser, loginUser, logoutUser , getUserProfile };