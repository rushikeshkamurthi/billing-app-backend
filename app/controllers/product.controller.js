const db = require("../models");
const Product = db.product;
const Shop = db.shop;
const Account = db.account;

/**
 * @desc Create a new product
 */
exports.createProduct = async (req, res) => {
  try {
    const { name, category, subcategory, type, price, shopId } = req.body;

    if (!shopId) {
      return res.status(400).json({ message: "Shop ID is required" });
    }

    const shop = await Shop.findByPk(shopId);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const product = await Product.create({
      name,
      category,
      subcategory,
      type,
      price,
      shopId,
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get all products with pagination
 */
exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { rows: products, count } = await Product.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{ model: Shop, as: "shop" }],
    });

    res.status(200).json({
      totalProducts: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get product by ID
 */
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Shop, as: "shop" }],
    });

    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get products by shop ID
 */
exports.getProductsByShop = async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const products = await Product.findAll({
      where: { shopId },
      include: [{ model: Shop, as: "shop" }],
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get products by account ID
 */
exports.getProductsByAccount = async (req, res) => {
  try {
    const accountId = req.params.accountId;

    const shops = await Shop.findAll({
      where: { accountId },
      attributes: ["id"],
    });
    if (!shops.length) {
      return res
        .status(404)
        .json({ message: "No shops found for this account" });
    }

    const shopIds = shops.map((shop) => shop.id);
    const products = await Product.findAll({
      where: { shopId: shopIds },
      include: [{ model: Shop, as: "shop" }],
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Update product by ID
 */
exports.updateProduct = async (req, res) => {
  try {
    const [updated] = await Product.update(req.body, {
      where: { id: req.params.id },
    });

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Product not found or no changes made" });
    }

    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Delete product by ID
 */
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.destroy({ where: { id: req.params.id } });

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
