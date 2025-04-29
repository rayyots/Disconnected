import User from '../models/User.js';

export const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-__v -createdAt -updatedAt');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const updateDataPreference = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { hasOwnData: req.body.hasOwnData },
      { new: true }
    );
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getSavedAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('savedAddresses');
    res.json({ success: true, addresses: user.savedAddresses });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const saveAddress = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $push: { savedAddresses: req.body } },
      { new: true }
    );
    res.json({ success: true, addresses: user.savedAddresses });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $pull: { savedAddresses: { _id: req.params.id } } },
      { new: true }
    );
    res.json({ success: true, addresses: user.savedAddresses });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};