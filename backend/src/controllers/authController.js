import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) => {
  console.log("Generating token for user ID:", process.env.JWT_SECRET);
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
  console.log("Generated token:", token);
  return token;
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
    console.log("User registered successfully:", user);
  } catch (error) {
    console.error(" REGISTRATION ERROR:", error);

    res.status(500).json({ message: "Server error during registration" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({ message: "Server error during login" });
  }
};

export const getMe = async (req, res) => {
  // req.user is automatically attached by the 'protect' middleware
  res.status(200).json(req.user);
};
