import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import Student from "../models/student.model.js";
import bcrypt from "bcrypt";

const home = async (req, res, next) => {
  try {
    res
      .status(200)
      .json({ success: true, message: "Welcome to TapPe Admin API" });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  const { email, password, name } = req.body;
  try {
    const adminExists = await Admin.findOne({ email });

    // Check if admin already exists
    if (adminExists) throw new Error("Admin already exists");

    // Create new admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const admin = await Admin.create({ email, password: hashedPassword, name });

    // Generate token and save to database
    const token = jwt.sign(
      { user: admin.toObject(), role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    admin.tokens.push({ token });
    await admin.save();

    // Set token cookie and send response
    res.cookie("token", token, {httpOnly:true});
    res.status(201).json({ message: "Admin created successfully", admin: admin.toObject() });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    // match password with hashed password
    const isMatch = admin && (await bcrypt.compare(password, admin.password));
    if (!isMatch || !admin) throw new Error("Invalid credentials");
    const { password: _, ...restDetailsOfAdmin } = admin.toObject();
    // Set admin session using jwt
    const token = jwt.sign(
      { user: restDetailsOfAdmin, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.cookie("token", token);
    res.status(200).json({ message: "Logged in successfully", admin: restDetailsOfAdmin });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    // Remove token from database
    res.cookie("token", "loggedout", {httpOnly:true});
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

const activate = async (req, res, next) => {
  const { uid, card_id } = req.body;
  try {
    const student = await Student.findOneAndUpdate(
      { uid },
      { card_id },
      { new: true }
    );
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }
    res.status(200).json({
      success: true,
      message: "Student Card activated successfully",
      student,
    });
  } catch (error) {
    next(error);
  }
};

export const adminController = {
  home,
  register,
  login,
  logout,
  activate,
};
