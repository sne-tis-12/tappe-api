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
  const adminExists = await Admin.findOne({ email });
  try {
    // Check if admin already exists
    if (adminExists) throw new Error("Admin already exists");
    // Create new admin
    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const admin = await Admin.create({ email, password: hashedPassword, name });
    // Set admin session using jwt
    const token = jwt.sign(
      { user: admin, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.clearCookie("token");
    res.cookie("token", token, { httpOnly: true });

    res.status(201).json({ message: "Admin created successfully", admin });
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
    // Set admin session using jwt
    const token = jwt.sign(
      { user: admin, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
    });
    res.status(200).json({ message: "Logged in successfully", admin });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.cookie("token", "null", { httpOnly: true });
    res.status(200).json({ success: true, message: "Logged Out Successfully" });
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

const addBalance = async (req, res, next) => {
  const { uid, amount } = req.body;
  try {
    const student = Student.findOne({ uid });
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }
    const newBalance = student.balance + amount;
    // Update student balance
    student.balance = newBalance;
    await student.save();
    res
      .status(200)
      .json({ success: true, message: "Balance added successfully", student });
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
  addBalance,
};
