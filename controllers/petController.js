import Pet from '../models/Pet.js';

// @desc    Get all pets with search, filter, and pagination
// @route   GET /api/pets
// @access  Public
export const getPets = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};

    // Search by name or breed
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { breed: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // Filter by species
    if (req.query.species) {
      query.species = req.query.species;
    }

    // Filter by breed
    if (req.query.breed) {
      query.breed = { $regex: req.query.breed, $options: 'i' };
    }

    // Filter by age range
    if (req.query.minAge || req.query.maxAge) {
      query.age = {};
      if (req.query.minAge) query.age.$gte = parseInt(req.query.minAge);
      if (req.query.maxAge) query.age.$lte = parseInt(req.query.maxAge);
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    } else {
      // Default to available pets for public view
      query.status = 'Available';
    }

    // Filter by gender
    if (req.query.gender) {
      query.gender = req.query.gender;
    }

    // Filter by size
    if (req.query.size) {
      query.size = req.query.size;
    }

    const total = await Pet.countDocuments(query);
    const pets = await Pet.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      pets,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single pet by ID
// @route   GET /api/pets/:id
// @access  Public
export const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate(
      'adoptedBy',
      'name email'
    );

    if (pet) {
      res.json(pet);
    } else {
      res.status(404).json({ message: 'Pet not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new pet
// @route   POST /api/pets
// @access  Private/Admin
export const createPet = async (req, res) => {
  try {
    const pet = await Pet.create(req.body);
    res.status(201).json(pet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a pet
// @route   PUT /api/pets/:id
// @access  Private/Admin
export const updatePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (pet) {
      Object.assign(pet, req.body);
      const updatedPet = await pet.save();
      res.json(updatedPet);
    } else {
      res.status(404).json({ message: 'Pet not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a pet
// @route   DELETE /api/pets/:id
// @access  Private/Admin
export const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (pet) {
      await pet.deleteOne();
      res.json({ message: 'Pet removed' });
    } else {
      res.status(404).json({ message: 'Pet not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pet statistics
// @route   GET /api/pets/stats/overview
// @access  Private/Admin
export const getPetStats = async (req, res) => {
  try {
    const total = await Pet.countDocuments();
    const available = await Pet.countDocuments({ status: 'Available' });
    const pending = await Pet.countDocuments({ status: 'Pending' });
    const adopted = await Pet.countDocuments({ status: 'Adopted' });

    const bySpecies = await Pet.aggregate([
      {
        $group: {
          _id: '$species',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      total,
      available,
      pending,
      adopted,
      bySpecies,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

