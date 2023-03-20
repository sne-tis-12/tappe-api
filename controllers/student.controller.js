import Student from "../models/student.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const home = async (_, res, next) => {
  try {
    res
      .status(200)
      .json({ success: true, message: "Welcome to TapPe Student API" });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  const { email, password, name, uid } = req.body;
  const studentExistsEmail = await Student.findOne({
    email: email.toLowerCase(),
  });
  const studentExistsUid = await Student.findOne({ uid: uid.toLowerCase() });
  try {
    if (studentExistsEmail || studentExistsUid)
      throw new Error("Student already exists");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await Student.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      uid: uid.toLowerCase(),
    });
    res.status(201).json({ message: "Student created successfully", success: true });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { uid, password } = req.body;
    const student = await Student.findOne({ uid: uid.toLowerCase() });
    const isMatch = student && (await bcrypt.compare(password, student.password));
    if (!student || !isMatch) {
      throw new Error("Invalid credentials");
    }
    const { password: _, ...restDetailsOfStudent } = student.toObject();
    const token = jwt.sign(
      { user: restDetailsOfStudent, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(200).json({
      success:true,
      message: "Logged in successfully",
      token,
    });
  } catch (error) {
    next(error);
  }
};

const verifyToken = async (req, res, next) => {
  try {
    const { token, cred } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { uid } = decoded.user;
    if (cred.toLowerCase() === uid.toLowerCase()) {
      const student = await Student.findOne({ uid: uid.toLowerCase() });
      const { password: _, ...restDetailsOfStudent } = student.toObject();
      res.status(200).json({ status: true, student: restDetailsOfStudent });
    } else {
      res.status(401).json({ status: false });
    }
  } catch (error) {
    next(error);
  }
};

const addBalance = async (req, res, next) => {
  const { uid, amount } = req.body;
  try {
    const student = await Student.findOne({ uid });
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }
    const newBalance = student.balance + amount;
    // Update student balance
    student.balance = newBalance;
    await student.save();
    const { password: _, ...restDetailsOfStudent } = student.toObject();
    res.status(200).json({
      success: true,
      message: "Balance added successfully",
      student: restDetailsOfStudent,
    });
  } catch (error) {
    next(error);
  }
};

const getData = async (req, res, next) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { uid } = decoded.user;
    const student = await Student.findOne({ uid });
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }
    const { password: _, ...restDetailsOfStudent } = student.toObject();
    res.status(200).json({
      student: restDetailsOfStudent,
    });
  } catch (error) {
    next(error);
  }
};

export const studentController = {
  home,
  register,
  login,
  verifyToken,
  addBalance,
  getData,
};
