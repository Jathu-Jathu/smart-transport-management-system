const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const User = require("../models/User");
const Bus = require("../models/Bus");
const Route = require("../models/Route");
const Driver = require("../models/Driver");
const Conductor = require("../models/Conductor");
const Schedule = require("../models/Schedule");
const Passenger = require("../models/Passenger");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected for seeding");
};

const importData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Bus.deleteMany();
    await Route.deleteMany();
    await Driver.deleteMany();
    await Conductor.deleteMany();
    await Schedule.deleteMany();
    await Passenger.deleteMany();

    const users = await User.create([
      {
        name: "Admin",
        email: "admin@rudra.com",
        password: "123456",
        role: "admin",
        phone: "0771111111",
      },
      {
        name: "Kamal Perera",
        email: "driver@rudra.com",
        password: "123456",
        role: "driver",
        phone: "0772222222",
      },
      {
        name: "Sunil Fernando",
        email: "conductor@rudra.com",
        password: "123456",
        role: "conductor",
        phone: "0773333333",
      },
      {
        name: "Passenger Demo",
        email: "passenger@rudra.com",
        password: "123456",
        role: "passenger",
        phone: "0774444444",
      },
    ]);

    const buses = await Bus.create([
      {
        busNumber: "RDX-001",
        busName: "Rudra Elite",
        busType: "Luxury",
        totalSeats: 40,
        capacity: 40,
        registrationNumber: "NB-2345",
        fuelType: "Diesel",
        maintenanceStatus: "Available",
        insuranceExpiry: "2026-06-20",
        licenseRenewalDate: "2026-07-15",
      },
      {
        busNumber: "RDX-002",
        busName: "Rudra Crown",
        busType: "AC",
        totalSeats: 40,
        capacity: 40,
        registrationNumber: "NB-6789",
        fuelType: "Diesel",
        maintenanceStatus: "Available",
        insuranceExpiry: "2026-08-10",
        licenseRenewalDate: "2026-08-25",
      },
      {
        busNumber: "RDX-003",
        busName: "Rudra Nightline",
        busType: "Sleeper",
        totalSeats: 32,
        capacity: 32,
        registrationNumber: "NC-1122",
        fuelType: "Diesel",
        maintenanceStatus: "Under Maintenance",
        insuranceExpiry: "2026-06-05",
        licenseRenewalDate: "2026-06-12",
      },
    ]);

    const routes = await Route.create([
      {
        routeCode: "COL-KAN",
        startLocation: "Colombo",
        endLocation: "Kandy",
        stops: ["Kadawatha", "Warakapola", "Kegalle", "Peradeniya"],
        totalDistanceKm: 120,
        estimatedTravelTime: "4h 30m",
        routeStatus: "Active",
        centerLatitude: 7.2906,
        centerLongitude: 80.6337,
        allowedRadiusKm: 60,
      },
      {
        routeCode: "COL-GAL",
        startLocation: "Colombo",
        endLocation: "Galle",
        stops: ["Panadura", "Kalutara", "Bentota", "Hikkaduwa"],
        totalDistanceKm: 125,
        estimatedTravelTime: "3h 15m",
        routeStatus: "Active",
        centerLatitude: 6.0535,
        centerLongitude: 80.221,
        allowedRadiusKm: 60,
      },
      {
        routeCode: "COL-JAF",
        startLocation: "Colombo",
        endLocation: "Jaffna",
        stops: ["Kurunegala", "Anuradhapura", "Vavuniya", "Kilinochchi"],
        totalDistanceKm: 400,
        estimatedTravelTime: "8h 30m",
        routeStatus: "Active",
        centerLatitude: 8.3114,
        centerLongitude: 80.4037,
        allowedRadiusKm: 120,
      },
    ]);

    const drivers = await Driver.create([
      {
        name: "Kamal Perera",
        licenseNumber: "D-LIC-001",
        contact: "0772222222",
        experienceYears: 8,
        emergencyContact: "0712222222",
        availability: "Available",
        licenseExpiry: "2026-06-18",
      },
      {
        name: "Nimal Silva",
        licenseNumber: "D-LIC-002",
        contact: "0775555555",
        experienceYears: 6,
        emergencyContact: "0715555555",
        availability: "Available",
        licenseExpiry: "2026-09-20",
      },
    ]);

    const conductors = await Conductor.create([
      {
        name: "Sunil Fernando",
        contact: "0773333333",
        emergencyContact: "0713333333",
        availability: "Available",
        shiftTiming: "Morning",
      },
      {
        name: "Ruwan Kumara",
        contact: "0776666666",
        emergencyContact: "0716666666",
        availability: "Available",
        shiftTiming: "Night",
      },
    ]);

    const passengers = await Passenger.create([
      {
        name: "Passenger Demo",
        contact: "0774444444",
        email: "passenger@rudra.com",
      },
      {
        name: "Ashen Perera",
        contact: "0777777777",
        email: "ashen@gmail.com",
      },
      {
        name: "Nethmi Silva",
        contact: "0778888888",
        email: "nethmi@gmail.com",
      },
    ]);

    await Schedule.create([
      {
        bus: buses[0]._id,
        route: routes[0]._id,
        driver: drivers[0]._id,
        conductor: conductors[0]._id,
        departureTime: "06:00",
        arrivalTime: "10:30",
        pickupTime: "05:45",
        dropTime: "10:45",
        date: "2026-05-27",
        status: "Scheduled",
      },
      {
        bus: buses[1]._id,
        route: routes[1]._id,
        driver: drivers[1]._id,
        conductor: conductors[1]._id,
        departureTime: "08:00",
        arrivalTime: "11:15",
        pickupTime: "07:45",
        dropTime: "11:30",
        date: "2026-05-27",
        status: "Scheduled",
      },
    ]);

    console.log("Seed data imported successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Bus.deleteMany();
    await Route.deleteMany();
    await Driver.deleteMany();
    await Conductor.deleteMany();
    await Schedule.deleteMany();
    await Passenger.deleteMany();

    console.log("Seed data destroyed successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}