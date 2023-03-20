import jwt from "jsonwebtoken";
import Vendor from "../models/vendor.model.js";
import Product from "../models/product.model.js";
import bcrypt from "bcrypt";

const home = async (req, res, next) => {
  try {
    res
      .status(200)
      .json({ success: true, message: "Welcome to TapPe Vendor API" });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  const { email, password, name, address, phone } = req.body;
  const vendorExists = await Vendor.findOne({ email });
  try {
    if (vendorExists) throw new Error("Vendor already exists");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await Vendor.create({
      email,
      password: hashedPassword,
      name,
      address,
      phone,
    });
    res.status(201).json({ message: "Vendor created successfully", success: true });
  } catch (error) {
    next(error);
  }
};

const verifyToken = async (req, res, next) => {
  try {
    const { token, cred } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded.user;
    if (cred.toLowerCase() === email.toLowerCase()) {
      const vendor = await Vendor.findOne({ email: email.toLowerCase() });
      const { password: _, ...restDetailsOfVendor } = vendor.toObject();
      res.status(200).json({ success: true, vendor: restDetailsOfVendor });
    } else {
      res.status(401).json({ success: false });
    }
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const vendor = await Vendor.findOne({ email });
    const isMatch = vendor && (await bcrypt.compare(password, vendor.password));
    if (!isMatch || !vendor) throw new Error("Invalid credentials");
    const { password: _, ...restDetailsOfVendor } = vendor.toObject();
    const token = jwt.sign(
      { user: restDetailsOfVendor, role: "vendor" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res
      .status(200)
      .json({ success: true, message: "Logged in successfully", token });
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    // Find products by vendor id
    const products = await Product.find({ vendor: req.user._id });
    if (!products) throw new Error("No products found for given vendor");
    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

const addProduct = async (req, res, next) => {
  try {
    const { name, short_name, price, description, image_url } = req.body;
    const vendor = req.user._id;
    const product = await Product.create({
      name,
      short_name,
      price,
      description,
      image_url,
      vendor,
    });
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Find product by id only if vendor is the owner
    const product = await Product.findOne({ _id: id, vendor: req.user._id });
    if (!product) throw new Error("Product not found");
    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, short_name, price, description, image_url } = req.body;
    // Find and update product by id only if vendor is the owner
    const product = Product.findOneAndUpdate(
      { _id: id, vendor: req.user._id },
      { name, short_name, price, description, image_url },
      { new: true }
    );
    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Find and delete product by id only if vendor is the owner
    const product = Product.findOneAndDelete({ _id: id, vendor: req.user._id });
    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const vendorController = {
  home,
  register,
  login,
  verifyToken,
  getProducts,
  addProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};
