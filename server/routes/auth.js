import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/Users.js';

const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password} = req.body;
    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Return user data (excluding password)
        // const { password: _, ...userData } = user.toObject();
        res.json(user);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', email: newUser.email, firstName: newUser.firstName, lastName: newUser.lastName });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/user/me', async (req, res) => {
    const authHeader = req.headers.authorization;
    const userId = authHeader?.split(' ')[1];
  
    if (!userId) return res.status(401).json({ message: "No token provided" });
  
    try {
      const user = await User.findById(userId).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.json({ user });
    } catch (err) {
      console.error("Error finding user by ID:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });


export default router;
