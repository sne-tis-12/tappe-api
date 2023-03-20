import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js';
import Vendor from '../models/vendor.model.js';

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token; // Assuming you are storing the JWT token in a cookie named 'token'

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.role = decoded.role; // Set the role on the req object
    req.user = decoded.user; // Set the user object on the req object
    if(req.role === 'admin') {
      // Find admin by id
      const admin = await Admin.findById(req.user._id);
      // Check if the token is in the admin's token array
      const tokenExists = admin.tokens.some((tokenObj) => tokenObj.token === token);
      if (!tokenExists) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
    } else if(req.role === 'vendor') {
      // Find vendor by id
      const vendor = await Vendor.findById(req.user._id);
      // Check if the token is in the vendor's token array
      const tokenExists = vendor.tokens.some((tokenObj) => tokenObj.token === token);
      if (!tokenExists) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
    }
    next();
  } catch (error) {
    console.log(error)
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.role && req.role === 'admin') {
    return next(); // User is authenticated as an admin, continue to the next middleware/function
  } else {
    return res.status(401).json({ success: false, message: 'Unauthorized' }); // User is not authenticated as an admin, return a 401 Unauthorized status code
  }
};

export const isVendor = (req, res, next) => {
  if (req.role && req.role === 'vendor') {
    return next(); // User is authenticated as a vendor, continue to the next middleware/function
  } else {
    return res.status(401).json({ success: false, message: 'Unauthorized' }); // User is not authenticated as a vendor, return a 401 Unauthorized status code
  }
}