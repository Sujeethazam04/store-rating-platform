const pool = require("../config/db");

// GET MY STORE


const getMyStore = async (req, res) => {
    try {
        const ownerId = req.user.id;

        const result = await pool.query(
            `
            SELECT
                s.id,
                s.name,
                s.email,
                s.address,
                s.owner_id,
                COALESCE(
                    ROUND(AVG(r.rating), 2),
                    0
                ) AS "overallRating",
                COUNT(r.id) AS "totalRatings"
            FROM stores s
            LEFT JOIN ratings r
                ON s.id = r.store_id
            WHERE s.owner_id = $1
            GROUP BY
                s.id,
                s.name,
                s.email,
                s.address,
                s.owner_id
            `,
            [ownerId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No store assigned to this owner"
            });
        }

        res.status(200).json({
            success: true,
            store: result.rows[0]
        });

    } catch (error) {
        console.error(
            "Get my store error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while fetching store details"
        });
    }
};



// GET MY STORE RATINGS

const getMyStoreRatings = async (req, res) => {
    try {
        const ownerId = req.user.id;

        const result = await pool.query(
            `
            SELECT
                r.id,
                r.rating,
                r.created_at,
                r.updated_at,

                u.id AS user_id,
                u.name AS user_name,
                u.email AS user_email,

                s.id AS store_id,
                s.name AS store_name

            FROM ratings r

            INNER JOIN stores s
                ON r.store_id = s.id

            INNER JOIN users u
                ON r.user_id = u.id

            WHERE s.owner_id = $1

            ORDER BY r.created_at DESC
            `,
            [ownerId]
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            ratings: result.rows
        });

    } catch (error) {
        console.error(
            "Get my store ratings error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while fetching store ratings"
        });
    }
};



// EXPORTS

module.exports = {
    getMyStore,
    getMyStoreRatings
};