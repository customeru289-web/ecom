import Product from '../models/Product.js';
import Category from '../models/Category.js';
import asyncHandler from '../utils/asyncHandler.js';
import APIFeatures from '../utils/apiFeatures.js';

const slugify = (text) =>
  text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

export const getProducts = asyncHandler(async (req, res) => {
  const baseQuery = Product.find({ isActive: true }).populate('category', 'name slug');

  if (req.query.category) {
    baseQuery.find({ category: req.query.category });
  }

  const features = new APIFeatures(baseQuery, req.query)
    .search()
    .filter()
    .priceFilter()
    .ratingFilter()
    .sort();

  const countQuery = Product.find(features.query.getFilter());
  const total = await countQuery.countDocuments();

  features.paginate();
  const products = await features.query;

  res.json({
    success: true,
    products,
    page: features.page,
    pages: Math.ceil(total / features.limit),
    total,
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name slug')
    .populate('reviews.user', 'name avatar');

  if (!product || !product.isActive) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({ success: true, product });
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true, featured: true })
    .populate('category', 'name slug')
    .limit(8);
  res.json({ success: true, products });
});

export const getNewArrivals = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true, newArrival: true })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(8);
  res.json({ success: true, products });
});

export const getBestSellers = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true, bestSeller: true })
    .populate('category', 'name slug')
    .sort({ salesCount: -1 })
    .limit(8);
  res.json({ success: true, products });
});

export const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const products = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
    isActive: true,
  })
    .limit(4)
    .populate('category', 'name slug');

  res.json({ success: true, products });
});

export const createProduct = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  data.slug = slugify(data.name);

  if (req.files?.length) {
    data.images = req.files.map((f) => `/uploads/${f.filename}`);
  }

  if (typeof data.specifications === 'string') {
    data.specifications = JSON.parse(data.specifications);
  }

  const product = await Product.create(data);
  await Category.findByIdAndUpdate(product.category, { $inc: { productCount: 1 } });

  res.status(201).json({ success: true, product, message: 'Product created' });
});

export const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const data = { ...req.body };
  if (data.name) data.slug = slugify(data.name);

  if (req.files?.length) {
    const newImages = req.files.map((f) => `/uploads/${f.filename}`);
    data.images = [...(product.images || []), ...newImages];
  }

  if (typeof data.specifications === 'string') {
    data.specifications = JSON.parse(data.specifications);
  }

  if (data.category && data.category !== product.category.toString()) {
    await Category.findByIdAndUpdate(product.category, { $inc: { productCount: -1 } });
    await Category.findByIdAndUpdate(data.category, { $inc: { productCount: 1 } });
  }

  product = await Product.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  res.json({ success: true, product, message: 'Product updated' });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await Category.findByIdAndUpdate(product.category, { $inc: { productCount: -1 } });
  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted' });
});

export const getAdminProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.keyword) {
    filter.name = { $regex: req.query.keyword, $options: 'i' };
  }
  if (req.query.stock === 'low') {
    filter.$expr = { $lte: ['$stock', '$lowStockThreshold'] };
  }

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({ success: true, products, page, pages: Math.ceil(total / limit), total });
});

export const getStockAlerts = asyncHandler(async (req, res) => {
  const products = await Product.find({
    $expr: { $lte: ['$stock', '$lowStockThreshold'] },
    isActive: true,
  }).select('name stock lowStockThreshold images');

  res.json({ success: true, products, count: products.length });
});

export const removeProductImage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  product.images = product.images.filter((img) => img !== req.body.imageUrl);
  await product.save();
  res.json({ success: true, product });
});
