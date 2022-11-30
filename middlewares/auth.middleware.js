import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // Assuming you are storing the JWT token in a cookie named 'token'

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.role = decoded.role; // Set the role on the req object
    req.user = decoded.user; // Set the user object on the req object
    next();
  } catch (error) {
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