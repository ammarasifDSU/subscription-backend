import { Merchant } from "./merchant.js";

const defaultMerchant = [
  {
    name: "Merchant 1",
  },
  {
    name: "Merchant 2",
  },
];

const seedDefaultMerchants = async () => {
  try {
    // Check if the services collection is empty
    const count = await Merchant.countDocuments();

    if (count === 0) {
      // Insert the default services into the collection
      await Merchant.insertMany(defaultMerchant);
    }
  } catch (error) {
    console.error("Error seeding default merchant:", error);
  }
};

export { seedDefaultMerchants };
