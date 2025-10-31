import asyncHandler from 'express-async-handler';
import Party from '../models/partyModel.js';

// @desc    Get all parties for the logged-in user
// @route   GET /api/parties
// @access  Private
const getParties = asyncHandler(async (req, res) => {
  const parties = await Party.find({ user: req.user._id });
  res.status(200).json(parties);
});

// @desc    Create a new party
// @route   POST /api/parties
// @access  Private
const createParty = asyncHandler(async (req, res) => {
  const { name, type, gstin, phone, balance } = req.body;

  if (!name || !type) {
    res.status(400);
    throw new Error('Please provide name and type (Debtor/Creditor)');
  }

  const party = new Party({
    user: req.user._id, // Party ko user se link karein
    name,
    type,
    gstin: gstin || '',
    phone: phone || '',
    balance: Number(balance) || 0, // Yeh Opening Balance hai
  });

  const createdParty = await party.save();
  res.status(201).json(createdParty);
});

// @desc    Update a party
// @route   PUT /api/parties/:id
// @access  Private
const updateParty = asyncHandler(async (req, res) => {
  const party = await Party.findById(req.params.id);

  if (party) {
    // Check karein ki yeh party user ki hi hai
    if (party.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    party.name = req.body.name || party.name;
    party.type = req.body.type || party.type;
    party.gstin = req.body.gstin || party.gstin;
    party.phone = req.body.phone || party.phone;
    // Note: Balance ko yahaan se directly update nahi karna chahiye.
    // Balance transactions ke through update hoga.

    const updatedParty = await party.save();
    res.status(200).json(updatedParty);
  } else {
    res.status(404);
    throw new Error('Party not found');
  }
});

export { getParties, createParty, updateParty };