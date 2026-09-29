require("dotenv").config();

const bcrypt = require("bcrypt");

const connectDB = require("../src/config/db");
const User = require("../src/models/user.model");

const createAdmin = async () => {
    try {
        await connectDB();

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        const adminName = process.env.ADMIN_NAME;

        if (!adminEmail || !adminPassword || !adminName) {
            throw new Error(
                "ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD are required in .env"
            );
        }

        const existingAdmin = await User.findOne({
            role: "admin",
        });

        if (existingAdmin) {
            console.log("Admin account already exists");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(
            adminPassword,
            10
        );

        await User.create({
            name: adminName,
            email: adminEmail.toLowerCase().trim(),
            password: hashedPassword,
            role: "admin",
        });

        console.log("Admin account created successfully");

        process.exit(0);
    } catch (error) {
        console.error("Failed to create admin:", error.message);
        process.exit(1);
    }
};

createAdmin();