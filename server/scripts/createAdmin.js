const bcrypt = require("bcrypt");
require("dotenv").config();

const pool = require("../config/db");

const createAdmin = async () => {
    try {
        const name = "System Administrator Test";
        const email = "admin@storerating.com";
        const password = "AdminPass#123";
        const address = "Bhopal, Madhya Pradesh, India";
        const role = "ADMIN";

        // Check if admin already exists
        const existingAdmin = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingAdmin.rows.length > 0) {
            console.log("Admin already exists.");
            process.exit(0);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        // Create admin
        const result = await pool.query(
            `INSERT INTO users
            (name, email, password, address, role)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, name, email, address, role`,
            [
                name,
                email,
                hashedPassword,
                address,
                role
            ]
        );

        console.log("Admin created successfully:");
        console.log(result.rows[0]);

        console.log("\nAdmin Login Credentials:");
        console.log("Email:", email);
        console.log("Password:", password);

        process.exit(0);

    } catch (error) {
        console.error("Error creating admin:", error);
        process.exit(1);
    }
};

createAdmin();