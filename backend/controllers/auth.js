import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const verifyPhone = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    let user = await User.findOne({ phoneNumber });
    if (!user) {
      user = new User({ phoneNumber });
      await user.save();
    }

    return res.status(200).json({ 
      success: true, 
      message: 'OTP sent successfully (use any code for demo)' 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { phoneNumber, code } = req.body;
    const user = await User.findOne({ phoneNumber });
    
    if (!user) return res.status(400).json({ success: false, error: 'User not found' });

    // Demo: Accept any code
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ 
      success: true, 
      token,
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        dataBalance: user.dataBalance,
        hasOwnData: user.hasOwnData
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};