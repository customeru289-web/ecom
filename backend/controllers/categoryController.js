import Category from '../models/Category.js';
import asyncHandler from '../utils/asyncHandler.js';

const slugify = (text) =>
  text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });
  res.json({ success: true, categories });
});

export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json({ success: true, categories });
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  res.json({ success: true, category });
});

export const createCategory = asyncHandler(async (req, res) => {
  const data = { ...req.body, slug: slugify(req.body.name) };
  if (req.file) data.image = `/uploads/${req.file.filename}`;

  const category = await Category.create(data);
  res.status(201).json({ success: true, category, message: 'Category created' });
});

export const updateCategory = asyncHandler(async (req, res) => {
  let category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const data = { ...req.body };
  if (data.name) data.slug = slugify(data.name);
  if (req.file) data.image = `/uploads/${req.file.filename}`;

  category = await Category.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  res.json({ success: true, category, message: 'Category updated' });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  if (category.productCount > 0) {
    res.status(400);
    throw new Error('Cannot delete category with products');
  }
  await category.deleteOne();
  res.json({ success: true, message: 'Category deleted' });
});
