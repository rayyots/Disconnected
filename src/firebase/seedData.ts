
import { db } from "./config";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";

// Seed 10 users
const seedUsers = async () => {
  try {
    const users = [
      {
        id: "user_1",
        name: "Omar Rayyan",
        email: "OmarRayyan@gmail.com",
        phoneNumber: "+15551234567",
        avatar: "",
        rating: 4.94,
        memberSince: "2025",
        verifiedUser: true,
        dataBalance: 500,
        dataUsed: 0
      },
      {
        id: "user_2",
        name: "Sara Ahmed",
        email: "sara.ahmed@example.com",
        phoneNumber: "+15551234568",
        avatar: "",
        rating: 4.8,
        memberSince: "2024",
        verifiedUser: true,
        dataBalance: 500,
        dataUsed: 15
      },
      {
        id: "user_3",
        name: "Mohammed Ali",
        email: "mohammed.ali@example.com",
        phoneNumber: "+15551234569",
        avatar: "",
        rating: 4.7,
        memberSince: "2023",
        verifiedUser: true,
        dataBalance: 500,
        dataUsed: 75
      },
      {
        id: "user_4",
        name: "Fatma Hassan",
        email: "fatma.hassan@example.com",
        phoneNumber: "+15551234570",
        avatar: "",
        rating: 4.9,
        memberSince: "2024",
        verifiedUser: true,
        dataBalance: 500,
        dataUsed: 120
      },
      {
        id: "user_5",
        name: "Ahmed Mahmoud",
        email: "ahmed.mahmoud@example.com",
        phoneNumber: "+15551234571",
        avatar: "",
        rating: 4.6,
        memberSince: "2023",
        verifiedUser: true,
        dataBalance: 500,
        dataUsed: 200
      },
      {
        id: "user_6",
        name: "Nour Emad",
        email: "nour.emad@example.com",
        phoneNumber: "+15551234572",
        avatar: "",
        rating: 4.5,
        memberSince: "2024",
        verifiedUser: true,
        dataBalance: 500,
        dataUsed: 250
      },
      {
        id: "user_7",
        name: "Youssef Ibrahim",
        email: "youssef.ibrahim@example.com",
        phoneNumber: "+15551234573",
        avatar: "",
        rating: 4.8,
        memberSince: "2023",
        verifiedUser: true,
        dataBalance: 500,
        dataUsed: 100
      },
      {
        id: "user_8",
        name: "Laila Samir",
        email: "laila.samir@example.com",
        phoneNumber: "+15551234574",
        avatar: "",
        rating: 4.7,
        memberSince: "2024",
        verifiedUser: true,
        dataBalance: 500,
        dataUsed: 180
      },
      {
        id: "user_9",
        name: "Karim Adel",
        email: "karim.adel@example.com",
        phoneNumber: "+15551234575",
        avatar: "",
        rating: 4.9,
        memberSince: "2023",
        verifiedUser: true,
        dataBalance: 500,
        dataUsed: 150
      },
      {
        id: "user_10",
        name: "Mariam Tamer",
        email: "mariam.tamer@example.com",
        phoneNumber: "+15551234576",
        avatar: "",
        rating: 4.8,
        memberSince: "2024",
        verifiedUser: true,
        dataBalance: 500,
        dataUsed: 220
      }
    ];
    
    const usersCollection = collection(db, "users");
    
    for (const user of users) {
      await setDoc(doc(usersCollection, user.id), {
        ...user,
        createdAt: new Date()
      });
    }
    
    console.log("Users seeded successfully");
    return true;
  } catch (error) {
    console.error("Error seeding users", error);
    return false;
  }
};

// Seed 5 drivers
const seedDrivers = async () => {
  try {
    const drivers = [
      {
        id: "driver_1",
        name: "James Wilson",
        phoneNumber: "+15557891234",
        avatar: "",
        rating: 4.8,
        carModel: "Toyota Camry",
        licensePlate: "ABC 123",
        currentLocation: {
          lat: 30.0444,
          lng: 31.2357
        },
        available: true,
        status: "available"
      },
      {
        id: "driver_2",
        name: "Michael Brown",
        phoneNumber: "+15557891235",
        avatar: "",
        rating: 4.9,
        carModel: "Honda Accord",
        licensePlate: "DEF 456",
        currentLocation: {
          lat: 30.0500,
          lng: 31.2400
        },
        available: true,
        status: "available"
      },
      {
        id: "driver_3",
        name: "David Johnson",
        phoneNumber: "+15557891236",
        avatar: "",
        rating: 4.7,
        carModel: "Hyundai Sonata",
        licensePlate: "GHI 789",
        currentLocation: {
          lat: 30.0550,
          lng: 31.2450
        },
        available: true,
        status: "available"
      },
      {
        id: "driver_4",
        name: "Robert Smith",
        phoneNumber: "+15557891237",
        avatar: "",
        rating: 4.6,
        carModel: "Chevrolet Malibu",
        licensePlate: "JKL 012",
        currentLocation: {
          lat: 30.0600,
          lng: 31.2500
        },
        available: true,
        status: "available"
      },
      {
        id: "driver_5",
        name: "Christopher Davis",
        phoneNumber: "+15557891238",
        avatar: "",
        rating: 4.9,
        carModel: "Nissan Altima",
        licensePlate: "MNO 345",
        currentLocation: {
          lat: 30.0650,
          lng: 31.2550
        },
        available: true,
        status: "available"
      }
    ];
    
    const driversCollection = collection(db, "drivers");
    
    for (const driver of drivers) {
      await setDoc(doc(driversCollection, driver.id), {
        ...driver,
        createdAt: new Date()
      });
    }
    
    console.log("Drivers seeded successfully");
    return true;
  } catch (error) {
    console.error("Error seeding drivers", error);
    return false;
  }
};

// Check if data needs to be seeded
export const checkAndSeedData = async () => {
  try {
    // Check if users exist
    const usersSnapshot = await getDocs(collection(db, "users"));
    if (usersSnapshot.empty) {
      await seedUsers();
    }
    
    // Check if drivers exist
    const driversSnapshot = await getDocs(collection(db, "drivers"));
    if (driversSnapshot.empty) {
      await seedDrivers();
    }
    
    return true;
  } catch (error) {
    console.error("Error checking and seeding data", error);
    return false;
  }
};
