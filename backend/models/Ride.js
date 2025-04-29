import mongoose from 'mongoose';

const rideSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pickupLocation: String,
  dropoffLocation: String,
  distance: Number,
  duration: Number,
  baseFare: Number,
  dataUsed: Number,
  dataCost: Number,
  totalCost: Number,
  paymentMethod: String,
  date: Date
}, { timestamps: true });

const Ride = mongoose.model('Ride', rideSchema);

export default Ride;