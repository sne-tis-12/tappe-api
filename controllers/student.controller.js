import Student from '../models/student.model.js'
import bcrypt from 'bcrypt'

const home = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: "Welcome to TapPe Student API" });
  } catch (error) {
    next(error);
  }
}

const register = async (req, res, next) => {
  const { email, password, name, uid } = req.body
  const studentExistsEmail = await Student.findOne({ email })
  const studentExistsUid = await Student.findOne({ uid })
  try{
    // Check if admin already exists
    if(studentExistsEmail || studentExistsUid) throw new Error('Student already exists')
    // Create new admin
    // Encrypt password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const student = await Student.create({ email, password: hashedPassword, name, uid })
    res.status(201).json({ message: "Student created successfully",student })
  }
  catch(error){
    next(error)
  }
}

const login = async (req, res, next) => {
  try{
    const { uid, password } = req.body
    const student = await Student.findOne({ uid })
    // match password with hashed password
    const isMatch = student && await bcrypt.compare(password, student.password)
    if(!isMatch || !student) throw new Error('Invalid credentials')
    res.status(200).json({ message: "Logged in successfully",student })
  }
  catch(error){
    next(error)
  }
}

const logout = async (req, res, next) => {
  try{
    res.status(200).json({ success: true })
  }
  catch(error){
    next(error)
  }
}

export const studentController = {
  home,
  register,
  login,
  logout,
};