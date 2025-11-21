import mongoose from 'mongoose';

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a pet name'],
      trim: true,
    },
    species: {
      type: String,
      required: [true, 'Please provide species'],
      enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'],
    },
    breed: {
      type: String,
      required: [true, 'Please provide breed'],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, 'Please provide age'],
      min: 0,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female'],
      required: true,
    },
    size: {
      type: String,
      enum: ['Small', 'Medium', 'Large'],
      required: true,
    },
    color: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide description'],
    },
    medicalHistory: {
      type: String,
      default: 'No known medical issues',
    },
    vaccinated: {
      type: Boolean,
      default: false,
    },
    neutered: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['Available', 'Pending', 'Adopted'],
      default: 'Available',
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/400x300?text=Pet+Photo',
    },
    adoptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    adoptedDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search and filter
petSchema.index({ name: 'text', breed: 'text', description: 'text' });

const Pet = mongoose.model('Pet', petSchema);

export default Pet;

