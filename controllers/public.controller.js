import Product from '../models/product.model.js'

const home = async (req, res, next) => {
  try{
    res.status(200).json({ success: true, message: "Welcome to TapPe Public API" })
  }
  catch(error){
    next(error)
  }
}

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
}

const getProduct = async (req, res, next) => {
  
}