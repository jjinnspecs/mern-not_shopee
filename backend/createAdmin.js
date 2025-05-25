import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../backend/models/user.model.js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const username = "admin";
  const password = "admin123";
  const hashedPassword = await bcrypt.hash(password, 10);

  const existing = await User.findOne({ username, role: "admin" });
  if (existing) {
    console.log("Admin already exists.");
    process.exit();
  }

  await User.create({
    username,
    password: hashedPassword,
    role: "admin"
  });

  console.log("Admin created!");
  process.exit();
}

createAdmin();