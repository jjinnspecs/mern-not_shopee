import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


import crypto from 'crypto';
import nodemailer from 'nodemailer';

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const OTP_COOLDOWN_MS = 2 * 60 * 1000; // 2 minutes

//for admin login
export const adminLogin = async (req, res) => {
try {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const admin = await User.findOne({ username, role: 'admin' });
    if (!admin) 
        return res.status(401).json({ message: 'Invalid username or password' });
    
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) 
        return res.status(401).json({ message: 'Invalid username or password' });
    

    const token = jwt.sign(
        { id: admin._id, role: admin.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' }
    );

    res.json({ success: true, token});
} catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

//for user login
export const requestOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) 
            return res.status(400).json({ message: 'Email is required' });
        
        // Check if user exists
        let user = await User.findOne({ email, role: 'user'});
        // If user does not exist, create a new user
        if (!user) {
            user = await User.create({
                email, 
                role: 'user'
            });
        } else {
            const  now = Date.now();
            // If OTP was sent within the cooldown period, return an error
            if (user.otpSentAt && now - user.otpSentAt < OTP_COOLDOWN_MS) {
                const waitTime = Math.ceil((OTP_COOLDOWN_MS - (now - user.otpSentAt)) / 1000); // in seconds
                // Return a message indicating how long the user should wait
                return res.status(429).json({ message: `Please wait ${waitTime} seconds before requesting another OTP.` });
            }

        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
        user.otp = hashedOtp;
        user.otpExpires = Date.now() + OTP_EXPIRY_MS; // OTP valid for 10 minutes
        user.otpSentAt = Date.now(); // Set the time when OTP was sent
        await user.save();

        // Send OTP via email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Not Shopee OTP" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Your OTP Code',
             html: `<p>Your OTP code is <strong>${otp}</strong>. 
             It is valid for 10 minutes.</p>`,
        });
        res.json({ success: true, message: 'OTP sent to your email' });
    } catch (error) {
        console.error('Error during OTP request:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

//user OTP verification
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp)
            return res.status(400).json({ message: 'Email and OTP are required' });
        
        const user = await User.findOne({ email, role: 'user' });
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
        if (
            !user ||
            user.otp !== hashedOtp ||
            !user.otpExpires ||
            user.otpExpires < Date.now()
        ) {
            return res.status(401).json({ message: 'Invalid or expired OTP' });
        }

        user.otp = null; // Clear OTP after verification
        user.otpExpires = null; // Clear OTP expiration
        user.otpSentAt = null; // Clear OTP sent time
        await user.save();

        const token = jwt.sign(
            { id: user._id, role: user.role},
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        const { _id, email: userEmail, role } = user;
        res.json({ success: true, token, user: { _id, email: userEmail, role} });
    } catch (error) {
        console.error('Error during OTP verification:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

