import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Pet from './models/Pet.js';
import Application from './models/Application.js';
import connectDB from './config/db.js';

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    phone: '1234567890',
    address: '123 Admin Street',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'user123',
    role: 'user',
    phone: '9876543210',
    address: '456 User Avenue',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'user123',
    role: 'user',
    phone: '5551234567',
    address: '789 Adopter Lane',
  },
];

const pets = [
  {
    name: 'Max',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: 3,
    gender: 'Male',
    size: 'Large',
    color: 'Golden',
    description: 'Friendly and energetic golden retriever. Great with kids and other pets.',
    medicalHistory: 'Fully vaccinated, neutered',
    vaccinated: true,
    neutered: true,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400',
  },
  {
    name: 'Luna',
    species: 'Cat',
    breed: 'Persian',
    age: 2,
    gender: 'Female',
    size: 'Small',
    color: 'White',
    description: 'Calm and affectionate Persian cat. Loves to cuddle and play.',
    medicalHistory: 'Fully vaccinated',
    vaccinated: true,
    neutered: false,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=400',
  },
  {
    name: 'Buddy',
    species: 'Dog',
    breed: 'Labrador',
    age: 5,
    gender: 'Male',
    size: 'Large',
    color: 'Black',
    description: 'Loyal and well-trained Labrador. Perfect family dog.',
    medicalHistory: 'Fully vaccinated, neutered, hip dysplasia treated',
    vaccinated: true,
    neutered: true,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
  },
  {
    name: 'Whiskers',
    species: 'Cat',
    breed: 'Siamese',
    age: 1,
    gender: 'Male',
    size: 'Small',
    color: 'Cream and Brown',
    description: 'Playful and vocal Siamese kitten. Very social and loves attention.',
    medicalHistory: 'Fully vaccinated',
    vaccinated: true,
    neutered: false,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400',
  },
  {
    name: 'Bella',
    species: 'Dog',
    breed: 'Beagle',
    age: 4,
    gender: 'Female',
    size: 'Medium',
    color: 'Tricolor',
    description: 'Sweet and gentle Beagle. Good with children and other dogs.',
    medicalHistory: 'Fully vaccinated, spayed',
    vaccinated: true,
    neutered: true,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=400',
  },
  {
    name: 'Charlie',
    species: 'Dog',
    breed: 'German Shepherd',
    age: 6,
    gender: 'Male',
    size: 'Large',
    color: 'Black and Tan',
    description: 'Intelligent and protective German Shepherd. Needs experienced owner.',
    medicalHistory: 'Fully vaccinated, neutered',
    vaccinated: true,
    neutered: true,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400',
  },
  {
    name: 'Mittens',
    species: 'Cat',
    breed: 'Tabby',
    age: 3,
    gender: 'Female',
    size: 'Small',
    color: 'Orange',
    description: 'Independent but loving tabby cat. Low maintenance.',
    medicalHistory: 'Fully vaccinated, spayed',
    vaccinated: true,
    neutered: true,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
  },
  {
    name: 'Rocky',
    species: 'Dog',
    breed: 'Bulldog',
    age: 2,
    gender: 'Male',
    size: 'Medium',
    color: 'Brindle',
    description: 'Calm and friendly Bulldog. Great apartment dog.',
    medicalHistory: 'Fully vaccinated, neutered',
    vaccinated: true,
    neutered: true,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400',
  },
  {
    name: 'Tweety',
    species: 'Bird',
    breed: 'Canary',
    age: 1,
    gender: 'Male',
    size: 'Small',
    color: 'Yellow',
    description: 'Beautiful singing canary. Brings joy with its melodious songs.',
    medicalHistory: 'Healthy, regular vet checkups',
    vaccinated: false,
    neutered: false,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400',
  },
  {
    name: 'Snowball',
    species: 'Rabbit',
    breed: 'Holland Lop',
    age: 1,
    gender: 'Female',
    size: 'Small',
    color: 'White',
    description: 'Adorable and gentle rabbit. Perfect for families with children.',
    medicalHistory: 'Healthy, spayed',
    vaccinated: false,
    neutered: true,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400',
  },
  {
    name: 'Daisy',
    species: 'Dog',
    breed: 'Poodle',
    age: 4,
    gender: 'Female',
    size: 'Medium',
    color: 'White',
    description: 'Elegant and intelligent Poodle. Hypoallergenic coat.',
    medicalHistory: 'Fully vaccinated, spayed',
    vaccinated: true,
    neutered: true,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1616080682039-eb1c7bc39f8c?w=400',
  },
  {
    name: 'Shadow',
    species: 'Cat',
    breed: 'Black Cat',
    age: 5,
    gender: 'Male',
    size: 'Medium',
    color: 'Black',
    description: 'Mysterious and affectionate black cat. Brings good luck!',
    medicalHistory: 'Fully vaccinated, neutered',
    vaccinated: true,
    neutered: true,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=400',
  },
];

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Pet.deleteMany();
    await Application.deleteMany();

    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log('Users imported!');

    // Insert pets
    await Pet.insertMany(pets);
    console.log('Pets imported!');

    console.log('Data Import Success!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Pet.deleteMany();
    await Application.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}

