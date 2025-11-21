import Application from '../models/Application.js';
import Pet from '../models/Pet.js';

// @desc    Create a new adoption application
// @route   POST /api/applications
// @access  Private
export const createApplication = async (req, res) => {
  try {
    const { petId, message, experience, livingSpace, hasOtherPets } = req.body;

    // Check if pet exists and is available
    const pet = await Pet.findById(petId);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    if (pet.status !== 'Available') {
      return res.status(400).json({ message: 'Pet is not available for adoption' });
    }

    // Check if user already applied for this pet
    const existingApplication = await Application.findOne({
      pet: petId,
      user: req.user._id,
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this pet' });
    }

    // Create application
    const application = await Application.create({
      pet: petId,
      user: req.user._id,
      message,
      experience,
      livingSpace,
      hasOtherPets,
    });

    // Update pet status to Pending
    pet.status = 'Pending';
    await pet.save();

    const populatedApplication = await Application.findById(application._id)
      .populate('pet', 'name species breed image')
      .populate('user', 'name email phone');

    res.status(201).json(populatedApplication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user's applications
// @route   GET /api/applications/my-applications
// @access  Private
export const getMyApplications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { user: req.user._id };

    const total = await Application.countDocuments(query);
    const applications = await Application.find(query)
      .populate('pet', 'name species breed image status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      applications,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all applications (Admin)
// @route   GET /api/applications
// @access  Private/Admin
export const getAllApplications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    const total = await Application.countDocuments(query);
    const applications = await Application.find(query)
      .populate('pet', 'name species breed image')
      .populate('user', 'name email phone address')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      applications,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('pet')
      .populate('user', 'name email phone address')
      .populate('reviewedBy', 'name');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user is owner or admin
    if (
      application.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status (Approve/Reject)
// @route   PUT /api/applications/:id/status
// @access  Private/Admin
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findById(req.params.id).populate('pet');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.status !== 'Pending') {
      return res.status(400).json({ message: 'Application already processed' });
    }

    // Update application
    application.status = status;
    application.adminNotes = adminNotes;
    application.reviewedBy = req.user._id;
    application.reviewedDate = Date.now();

    await application.save();

    // Update pet status
    const pet = application.pet;

    if (status === 'Approved') {
      pet.status = 'Adopted';
      pet.adoptedBy = application.user;
      pet.adoptedDate = Date.now();
      await pet.save();

      // Reject all other pending applications for this pet
      await Application.updateMany(
        {
          pet: pet._id,
          _id: { $ne: application._id },
          status: 'Pending',
        },
        {
          status: 'Rejected',
          adminNotes: 'Pet has been adopted by another applicant',
          reviewedBy: req.user._id,
          reviewedDate: Date.now(),
        }
      );
    } else if (status === 'Rejected') {
      // Check if there are other pending applications
      const pendingCount = await Application.countDocuments({
        pet: pet._id,
        status: 'Pending',
      });

      // If no pending applications, set pet back to Available
      if (pendingCount === 0) {
        pet.status = 'Available';
        await pet.save();
      }
    }

    const updatedApplication = await Application.findById(application._id)
      .populate('pet', 'name species breed image')
      .populate('user', 'name email phone')
      .populate('reviewedBy', 'name');

    res.json(updatedApplication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private
export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user is owner or admin
    if (
      application.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Only allow deletion if status is Pending
    if (application.status !== 'Pending') {
      return res.status(400).json({ message: 'Cannot delete processed application' });
    }

    await application.deleteOne();

    // Check if there are other pending applications for this pet
    const pendingCount = await Application.countDocuments({
      pet: application.pet,
      status: 'Pending',
    });

    // If no pending applications, set pet back to Available
    if (pendingCount === 0) {
      await Pet.findByIdAndUpdate(application.pet, { status: 'Available' });
    }

    res.json({ message: 'Application deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get application statistics
// @route   GET /api/applications/stats/overview
// @access  Private/Admin
export const getApplicationStats = async (req, res) => {
  try {
    const total = await Application.countDocuments();
    const pending = await Application.countDocuments({ status: 'Pending' });
    const approved = await Application.countDocuments({ status: 'Approved' });
    const rejected = await Application.countDocuments({ status: 'Rejected' });

    res.json({
      total,
      pending,
      approved,
      rejected,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

