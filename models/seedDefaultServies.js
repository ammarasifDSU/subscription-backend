import { Service } from "./service.js";

const defaultServices = [
  {
    name: "Service 1",
    description: "This is service 1.",
    merchant_id: "64c6ceece4e60e2c75fa28d5",
  },
  {
    name: "Service 2",
    description: "This is service 2.",
    merchant_id: "64c6ceece4e60e2c75fa28d6",
  },
  {
    name: "Service 3",
    description: "This is service 3.",
    merchant_id: "64c6ceece4e60e2c75fa28d5",
  },
  {
    name: "Service 4",
    description: "This is service 4.",
    merchant_id: "64c6ceece4e60e2c75fa28d6",
  },
];

const seedDefaultServices = async () => {
  try {
    // Check if the services collection is empty
    const count = await Service.countDocuments();

    if (count === 0) {
      // Insert the default services into the collection
      await Service.insertMany(defaultServices);
    }
  } catch (error) {
    console.error("Error seeding default services:", error);
  }
};

export { seedDefaultServices };
