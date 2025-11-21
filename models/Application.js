import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    message: {
      type: String,
      required: [true, 'Please provide a message'],
      trim: true,
    },
    experience: {
      type: String,
      trim: true,
    },
    livingSpace: {
      type: String,
      enum: ['Apartment', 'House', 'Farm', 'Other'],
      required: true,
    },
    hasOtherPets: {
      type: Boolean,
      default: false,
    },
    adminNotes: {
      type: String,
      trim: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewedDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications
applicationSchema.index({ pet: 1, user: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);

export default Application;

