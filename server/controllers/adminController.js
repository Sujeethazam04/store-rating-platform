const bcrypt = require("bcrypt");

const pool = require("../config/db");



// ADMIN DASHBOARD STATS


const getDashboardStats = async (req, res) => {
    try {
        const usersResult = await pool.query(
            "SELECT COUNT(*) FROM users"
        );

        const storesResult = await pool.query(
            "SELECT COUNT(*) FROM stores"
        );

        const ratingsResult = await pool.query(
            "SELECT COUNT(*) FROM ratings"
        );

        const totalUsers = Number(
            usersResult.rows[0].count
        );

        const totalStores = Number(
            storesResult.rows[0].count
        );

        const totalRatings = Number(
            ratingsResult.rows[0].count
        );

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalStores,
                totalRatings
            }
        });

    } catch (error) {
        console.error(
            "Get dashboard stats error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while fetching dashboard statistics"
        });
    }
};



// GET ALL USERS

const getAllUsers = async (req, res) => {
    try {
        const {
            name,
            email,
            address,
            role,
            sortBy = "created_at",
            order = "desc"
        } = req.query;

        let query = `
            SELECT
                id,
                name,
                email,
                address,
                role,
                created_at,
                updated_at
            FROM users
            WHERE 1 = 1
        `;

        const values = [];
        let parameterIndex = 1;

        if (name) {
            query += ` AND name ILIKE $${parameterIndex}`;
            values.push(`%${name}%`);
            parameterIndex++;
        }

        if (email) {
            query += ` AND email ILIKE $${parameterIndex}`;
            values.push(`%${email}%`);
            parameterIndex++;
        }

        if (address) {
            query += ` AND address ILIKE $${parameterIndex}`;
            values.push(`%${address}%`);
            parameterIndex++;
        }

        if (role) {
            query += ` AND role = $${parameterIndex}`;
            values.push(role);
            parameterIndex++;
        }

        const allowedSortColumns = [
            "id",
            "name",
            "email",
            "address",
            "role",
            "created_at"
        ];

        const safeSortBy =
            allowedSortColumns.includes(sortBy)
                ? sortBy
                : "created_at";

        const safeOrder =
            order.toLowerCase() === "asc"
                ? "ASC"
                : "DESC";

        query += `
            ORDER BY ${safeSortBy} ${safeOrder}
        `;

        const result = await pool.query(
            query,
            values
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            users: result.rows
        });

    } catch (error) {
        console.error(
            "Get all users error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while fetching users"
        });
    }
};


// ======================================================
// CREATE USER
// ======================================================

const createUser = async (req, res) => {
    try {
        const {
            name,
            email,
            address,
            password,
            role
        } = req.body;

        const allowedRoles = [
            "ADMIN",
            "USER",
            "STORE_OWNER"
        ];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role"
            });
        }

        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const result = await pool.query(
            `INSERT INTO users
            (
                name,
                email,
                password,
                address,
                role
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING
                id,
                name,
                email,
                address,
                role,
                created_at`,
            [
                name,
                email,
                hashedPassword,
                address,
                role
            ]
        );

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: result.rows[0]
        });

    } catch (error) {
        console.error(
            "Create user error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while creating user"
        });
    }
};


// GET USER BY ID

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT
                id,
                name,
                email,
                address,
                role,
                created_at,
                updated_at
             FROM users
             WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user: result.rows[0]
        });

    } catch (error) {
        console.error(
            "Get user by ID error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while fetching user details"
        });
    }
};


// CREATE STORE


const createStore = async (req, res) => {
    try {
        const {
            name,
            email,
            address,
            owner_id
        } = req.body;

        const ownerResult = await pool.query(
            `SELECT
                id,
                name,
                email,
                role
             FROM users
             WHERE id = $1`,
            [owner_id]
        );

        if (ownerResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Store owner not found"
            });
        }

        const owner = ownerResult.rows[0];

        if (owner.role !== "STORE_OWNER") {
            return res.status(400).json({
                success: false,
                message:
                    "Selected user is not a store owner"
            });
        }

        const existingStore = await pool.query(
            `SELECT id
             FROM stores
             WHERE email = $1`,
            [email]
        );

        if (existingStore.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message:
                    "Store email already exists"
            });
        }

        const result = await pool.query(
            `INSERT INTO stores
            (
                name,
                email,
                address,
                owner_id
            )
            VALUES ($1, $2, $3, $4)
            RETURNING
                id,
                name,
                email,
                address,
                owner_id,
                created_at`,
            [
                name,
                email,
                address,
                owner_id
            ]
        );

        res.status(201).json({
            success: true,
            message: "Store created successfully",
            store: result.rows[0]
        });

    } catch (error) {
        console.error(
            "Create store error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while creating store"
        });
    }
};


// GET ALL STORES
//

const getAllStores = async (req, res) => {
    try {
        const {
            name,
            email,
            address,
            sortBy = "name",
            order = "asc"
        } = req.query;

        let query = `
            SELECT
                s.id,
                s.name,
                s.email,
                s.address,
                s.owner_id,
                COALESCE(
                    ROUND(AVG(r.rating), 2),
                    0
                ) AS rating
            FROM stores s
            LEFT JOIN ratings r
                ON s.id = r.store_id
            WHERE 1 = 1
        `;

        const values = [];
        let parameterIndex = 1;

        if (name) {
            query += `
                AND s.name ILIKE $${parameterIndex}
            `;

            values.push(`%${name}%`);
            parameterIndex++;
        }

        if (email) {
            query += `
                AND s.email ILIKE $${parameterIndex}
            `;

            values.push(`%${email}%`);
            parameterIndex++;
        }

        if (address) {
            query += `
                AND s.address ILIKE $${parameterIndex}
            `;

            values.push(`%${address}%`);
            parameterIndex++;
        }

        query += `
            GROUP BY
                s.id,
                s.name,
                s.email,
                s.address,
                s.owner_id
        `;

        const allowedSortColumns = {
            id: "s.id",
            name: "s.name",
            email: "s.email",
            address: "s.address",
            rating: "rating"
        };

        const safeSortColumn =
            allowedSortColumns[sortBy]
                || allowedSortColumns.name;

        const safeOrder =
            order.toLowerCase() === "desc"
                ? "DESC"
                : "ASC";

        query += `
            ORDER BY
                ${safeSortColumn}
                ${safeOrder}
        `;

        const result = await pool.query(
            query,
            values
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            stores: result.rows
        });

    } catch (error) {
        console.error(
            "Get all stores error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while fetching stores"
        });
    }
};

// UPDATE STORE

const updateStore = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            email,
            address,
            owner_id
        } = req.body;

        // Check store
        const storeResult = await pool.query(
            `SELECT id
             FROM stores
             WHERE id = $1`,
            [id]
        );

        if (storeResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Store not found"
            });
        }

        // Check owner
        const ownerResult = await pool.query(
            `SELECT id
             FROM users
             WHERE id = $1
             AND role = 'STORE_OWNER'`,
            [owner_id]
        );

        if (ownerResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Store owner not found"
            });
        }

        // Check duplicate email
        const duplicateEmail = await pool.query(
            `SELECT id
             FROM stores
             WHERE email = $1
             AND id != $2`,
            [email, id]
        );

        if (duplicateEmail.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Store email already exists"
            });
        }

        // Update store
        const result = await pool.query(
            `UPDATE stores
             SET
                name = $1,
                email = $2,
                address = $3,
                owner_id = $4
             WHERE id = $5
             RETURNING
                id,
                name,
                email,
                address,
                owner_id`,
            [
                name,
                email,
                address,
                owner_id,
                id
            ]
        );

        res.status(200).json({
            success: true,
            message: "Store updated successfully",
            store: result.rows[0]
        });

    } catch (error) {
        console.error(
            "Update store error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while updating store"
        });
    }
};


//
// DELETE STORE

const deleteStore = async (req, res) => {
    try {
        const { id } = req.params;

        // Check store
        const storeResult = await pool.query(
            `SELECT id
             FROM stores
             WHERE id = $1`,
            [id]
        );

        if (storeResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Store not found"
            });
        }

        // Delete store
        await pool.query(
            `DELETE FROM stores
             WHERE id = $1`,
            [id]
        );

        res.status(200).json({
            success: true,
            message: "Store deleted successfully"
        });

    } catch (error) {
        console.error(
            "Delete store error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while deleting store"
        });
    }
};

// UPDATE USER


const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            email,
            address,
            role,
            password
        } = req.body;

        // ----------------------------------------------
        // ALLOWED ROLES
        // ----------------------------------------------

        const allowedRoles = [
            "ADMIN",
            "USER",
            "STORE_OWNER"
        ];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role"
            });
        }


        // CHECK USER

        const userResult = await pool.query(
            `SELECT id, email, role
             FROM users
             WHERE id = $1`,
            [id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        // ----------------------------------------------
        // CHECK DUPLICATE EMAIL
        // ----------------------------------------------

        const duplicateEmail = await pool.query(
            `SELECT id
             FROM users
             WHERE email = $1
             AND id != $2`,
            [email, id]
        );

        if (duplicateEmail.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }


        // UPDATE WITH PASSWORD

        if (password && password.trim()) {

            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );

            const result = await pool.query(
                `UPDATE users
                 SET
                    name = $1,
                    email = $2,
                    address = $3,
                    role = $4,
                    password = $5,
                    updated_at = CURRENT_TIMESTAMP
                 WHERE id = $6
                 RETURNING
                    id,
                    name,
                    email,
                    address,
                    role,
                    created_at,
                    updated_at`,
                [
                    name,
                    email,
                    address,
                    role,
                    hashedPassword,
                    id
                ]
            );

            return res.status(200).json({
                success: true,
                message: "User updated successfully",
                user: result.rows[0]
            });
        }


        // UPDATE WITHOUT PASSWORD

        const result = await pool.query(
            `UPDATE users
             SET
                name = $1,
                email = $2,
                address = $3,
                role = $4,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = $5
             RETURNING
                id,
                name,
                email,
                address,
                role,
                created_at,
                updated_at`,
            [
                name,
                email,
                address,
                role,
                id
            ]
        );

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: result.rows[0]
        });

    } catch (error) {
        console.error(
            "Update user error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while updating user"
        });
    }
};


//
// DELETE USER

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;


        // CHECK USER

        const userResult = await pool.query(
            `SELECT
                id,
                role
             FROM users
             WHERE id = $1`,
            [id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }



        // DELETE USER

        await pool.query(
            `DELETE FROM users
             WHERE id = $1`,
            [id]
        );


        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        console.error(
            "Delete user error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while deleting user"
        });
    }
};

// EXPORTS

module.exports = {
    getDashboardStats,
    getAllUsers,
    createUser,
    getUserById,
    createStore,
    getAllStores,
    updateStore,
    deleteStore,
    updateUser,
    deleteUser
};