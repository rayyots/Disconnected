import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  email: String,
  username: String,
  dataBalance: {
    type: Number,
    default: 500
  },
  hasOwnData: {
    type: Boolean,
    default: false
  },
  rides: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride'
  }],
  savedAddresses: [{
    label: String,
    address: String,
    type: {
      type: String,
      enum: ['home', 'work', 'other']
    }
  }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;