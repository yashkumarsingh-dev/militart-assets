const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Base } = require("../models/associations");
const { sequelize } = require("../models/index");

// Register new user
const register = async (req, res) => {
  try {
    const { name, firstName, lastName, email, password, role, base_id } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Combine firstName and lastName if provided, otherwise use name
    const fullName = firstName && lastName ? `${firstName} ${lastName}` : name;

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await User.create({
      name: fullName,
      email,
      password_hash: passwordHash,
      role,
      base_id,
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        base_id: user.base_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        base_id: user.base_id,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // console.log("Login attempt for email:", email);

    // Find user
    const user = await User.findOne({
      where: { email },
      include: [{ model: Base, as: "Base" }],
    });

    if (!user) {
      // console.log("User not found for email:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // console.log("User found:", user.name, "Role:", user.role);

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    // console.log("Password validation result:", isValidPassword);

    if (!isValidPassword) {
      // console.log("Invalid password for user:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        base_id: user.base_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // console.log("Login successful for user:", user.name);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        base_id: user.base_id,
        base: user.Base,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      include: [{ model: Base, as: "Base" }],
      attributes: { exclude: ["password_hash"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update current user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { firstName, lastName, password } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update name fields
    if (firstName && lastName) {
      user.name = `${firstName} ${lastName}`;
    }
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    // Update password if provided
    if (password && password.length >= 6) {
      const saltRounds = 10;
      user.password_hash = await bcrypt.hash(password, saltRounds);
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        base_id: user.base_id,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all users (for assignment dropdowns)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "base_id"],
    });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  getAllUsers,
};
