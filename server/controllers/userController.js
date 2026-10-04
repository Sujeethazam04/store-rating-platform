const pool = require("../config/db");


// GET STORES FOR NORMAL USER

const getUserStores = async (req, res) => {
    try {
        const {
            name,
            address,
            sortBy = "name",
            order = "asc"
        } = req.query;

        const userId = req.user.id;

        let query = `
            SELECT
                s.id,
                s.name,
                s.address,

                COALESCE(
                    ROUND(AVG(all_ratings.rating), 2),
                    0
                ) AS "overallRating",

                user_rating.rating AS "userRating"

            FROM stores s

            LEFT JOIN ratings all_ratings
                ON s.id = all_ratings.store_id

            LEFT JOIN ratings user_rating
                ON s.id = user_rating.store_id
                AND user_rating.user_id = $1

            WHERE 1 = 1
        `;

        const values = [userId];
        let parameterIndex = 2;


        // ==================================================
        // SEARCH BY STORE NAME
        // ==================================================

        if (name) {
            query += `
                AND s.name ILIKE $${parameterIndex}
            `;

            values.push(`%${name}%`);
            parameterIndex++;
        }



        // SEARCH BY STORE ADDRESS

        if (address) {
            query += `
                AND s.address ILIKE $${parameterIndex}
            `;

            values.push(`%${address}%`);
            parameterIndex++;
        }


        // GROUP BY


        query += `
            GROUP BY
                s.id,
                s.name,
                s.address,
                user_rating.rating
        `;



        // SORTING

        const allowedSortColumns = {
            name: "s.name",
            address: "s.address",
            overallRating: `"overallRating"`
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



        // DATABASE QUERY

        const result = await pool.query(
            query,
            values
        );



        // RESPONSE

        res.status(200).json({
            success: true,
            count: result.rows.length,
            stores: result.rows
        });

    } catch (error) {
        console.error(
            "Get user stores error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while fetching stores"
        });
    }
};


module.exports = {
    getUserStores
};