import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("JWT_LIFETIME:", process.env.JWT_LIFETIME);

const prisma = new PrismaClient();

const register = async (req, res) => {
  try {
    const contentType = req.headers["content-type"];
    if (!contentType || contentType !== "application/json") {
      return res.status(400).json({
        msg: "Invalid Content-Type. Expected application/json",
      });
    }

    const { name, email, password } = req.body;

    let user = await prisma.user.findUnique({ where: { email } });

    if (user) return res.status(409).json({ msg: "User already exists" });

    const salt = await bcryptjs.genSalt();
    const hashedPassword = await bcryptjs.hash(password, salt);

    user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    delete user.password;

    return res.status(201).json({
      msg: "User successfully registered",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const contentType = req.headers["content-type"];
    if (!contentType || contentType !== "application/json") {
      return res.status(400).json({
        msg: "Invalid Content-Type. Expected application/json",
      });
    }

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    const { JWT_SECRET, JWT_LIFETIME } = process.env;

    if (!JWT_SECRET) {
      console.error("JWT_SECRET is not defined in the .env file");
      return res.status(500).json({
        msg: "Internal server error",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_LIFETIME },
    );

    return res.status(200).json({
      msg: "User successfully logged in",
      token: token,
    });
  } catch (err) {
    console.error("Error in login function: ", err);
    return res.status(500).json({
      msg: err.message,
    });
  }
};

const update = async (req, res) => {
  try {
    const userId = req.user.id; // Get the authenticated user's ID from the request

    const { newEmail, newName, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const updatedData = {};

    if (newEmail) updatedData.email = newEmail;
    if (newName) updatedData.name = newName;
    if (newPassword) {
      const salt = await bcryptjs.genSalt();
      updatedData.password = await bcryptjs.hash(newPassword, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updatedData,
    });

    const { JWT_SECRET, JWT_LIFETIME } = process.env;

    if (!JWT_SECRET) {
      console.error("JWT_SECRET is not defined in the .env file");
      return res.status(500).json({
        msg: "Internal server error",
      });
    }

    const token = jwt.sign(
      {
        id: updatedUser.id,
        name: updatedUser.name,
      },
      JWT_SECRET,
      { expiresIn: JWT_LIFETIME },
    );

    return res.status(200).json({
      msg: "User updated successfully",
      user: updatedUser,
      token,
    });
  } catch (err) {
    console.error("Error in update function: ", err);
    return res.status(500).json({
      msg: err.message,
    });
  }
};

export { register, login, update };
