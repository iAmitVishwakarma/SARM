import asyncHandler from 'express-async-handler';
import Item from '../models/itemModel.js';

// @desc    Get all items for the logged-in user
// @route   GET /api/items
// @access  Private
const getItems = asyncHandler(async (req, res) => {
  // req.user._id humein 'protect' middleware se mil raha hai
  const items = await Item.find({ user: req.user._id });
  res.status(200).json(items);
});

// @desc    Create a new item
// @route   POST /api/items
// @access  Private
const createItem = asyncHandler(async (req, res) => {
  const { name, unit, purchaseRate, saleRate, hsnCode, currentStock } = req.body;

  if (!name || !unit) {
    res.status(400);
    throw new Error('Please provide name and unit');
  }

  const item = new Item({
    user: req.user._id, // Item ko logged-in user se link karein
    name,
    unit,
    purchaseRate: Number(purchaseRate) || 0,
    saleRate: Number(saleRate) || 0,
    hsnCode: hsnCode || '',
    currentStock: Number(currentStock) || 0,
  });

  const createdItem = await item.save();
  res.status(201).json(createdItem);
});

// @desc    Update an item
// @route   PUT /api/items/:id
// @access  Private
const updateItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (item) {
    // Check karein ki yeh item user ka hi hai
    if (item.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    // Update karein
    item.name = req.body.name || item.name;
    item.unit = req.body.unit || item.unit;
    item.purchaseRate = Number(req.body.purchaseRate) ?? item.purchaseRate;
    item.saleRate = Number(req.body.saleRate) ?? item.saleRate;
    item.hsnCode = req.body.hsnCode || item.hsnCode;

    const updatedItem = await item.save();
    res.status(200).json(updatedItem);
  } else {
    res.status(404);
    throw new Error('Item not found');
  }
});

export { getItems, createItem, updateItem };
// TODO: Hum baad mein deleteItem bhi add kar sakte hain