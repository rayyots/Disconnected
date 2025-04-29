import Ride from '../models/Ride.js';
import User from '../models/User.js';

export const completeRide = async (req, res) => {
  try {
    const rideData = {
      ...req.body,
      userId: req.userId,
      date: new Date()
    };

    const ride = new Ride(rideData);
    await ride.save();

    await User.findByIdAndUpdate(
      req.userId,
      { 
        $inc: { dataBalance: -rideData.dataUsed },
        $push: { rides: ride._id }
      }
    );

    res.json({ success: true, ride });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getRideHistory = async (req, res) => {
  try {
    const rides = await Ride.find({ userId: req.userId })
      .sort({ date: -1 })
      .select('-__v -userId');
    res.json({ success: true, rides });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};