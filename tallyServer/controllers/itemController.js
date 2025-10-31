import asyncHandler from 'express-async-handler';
import Item from '../models/itemModel.js';

// @desc    Get all items for the logged-in user
const getItems = asyncHandler(async (req, res) => {
  const items = await Item.find({ user: req.user._id });
  res.status(200).json(items);
});

// @desc    Create a new item
const createItem = asyncHandler(async (req, res) => {
  // --- ADDED gstRate ---
  const { name, unit, purchaseRate, saleRate, hsnCode, currentStock, gstRate } = req.body;

  if (!name || !unit) {
    res.status(400);
    throw new Error('Please provide name and unit');
  }

  const item = new Item({
    user: req.user._id,
    name,
    unit,
    purchaseRate: Number(purchaseRate) || 0,
    saleRate: Number(saleRate) || 0,
    hsnCode: hsnCode || '',
    currentStock: Number(currentStock) || 0,
    gstRate: Number(gstRate) || 0, // --- ADDED ---
  });

  const createdItem = await item.save();
  res.status(201).json(createdItem);
});

// @desc    Update an item
const updateItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (item) {
    if (item.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    item.name = req.body.name || item.name;
    item.unit = req.body.unit || item.unit;
    item.purchaseRate = Number(req.body.purchaseRate) ?? item.purchaseRate;
    item.saleRate = Number(req.body.saleRate) ?? item.saleRate;
    item.hsnCode = req.body.hsnCode || item.hsnCode;
    item.gstRate = Number(req.body.gstRate) ?? item.gstRate; // --- ADDED ---
    
    // Note: We don't update currentStock from here. It's an opening balance.

    const updatedItem = await item.save();
    res.status(200).json(updatedItem);
  } else {
    res.status(404);
    throw new Error('Item not found');
  }
});

export { getItems, createItem, updateItem };