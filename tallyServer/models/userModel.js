import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Har email unique hona chahiye
    },
    password: {
      type: String,
      required: true,
      // Hum password ko hash karke save karenge (Next milestone mein)
    },
    gstin: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // Automatically createdAd aur updatedAt fields add karega
  }
);

const User = mongoose.model('User', userSchema);
export default User;