const pool = require("../config/db");



// SUBMIT RATING

const createRating = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            store_id,
            rating
        } = req.body;


        // CHECK STORE

        const storeResult = await pool.query(
            `SELECT id
             FROM stores
             WHERE id = $1`,
            [store_id]
        );

        if (storeResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Store not found"
            });
        }


        //
        // CHECK EXISTING RATING

        const existingRating = await pool.query(
            `SELECT id
             FROM ratings
             WHERE user_id = $1
             AND store_id = $2`,
            [
                userId,
                store_id
            ]
        );

        if (existingRating.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message:
                    "You have already rated this store"
            });
        }


        // CREATE RATING

        const result = await pool.query(
            `INSERT INTO ratings
            (
                user_id,
                store_id,
                rating
            )
            VALUES ($1, $2, $3)
            RETURNING
                id,
                user_id,
                store_id,
                rating,
                created_at,
                updated_at`,
            [
                userId,
                store_id,
                rating
            ]
        );


        res.status(201).json({
            success: true,
            message: "Rating submitted successfully",
            rating: result.rows[0]
        });

    } catch (error) {
        console.error(
            "Create rating error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while submitting rating"
        });
    }
};


// UPDATE RATING
//

const updateRating = async (req, res) => {
    try {
        const userId = req.user.id;

        const { storeId } = req.params;

        const { rating } = req.body;


        // CHECK STORE

        const storeResult = await pool.query(
            `SELECT id
             FROM stores
             WHERE id = $1`,
            [storeId]
        );

        if (storeResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Store not found"
            });
        }



        // CHECK USER RATING

        const existingRating = await pool.query(
            `SELECT id
             FROM ratings
             WHERE user_id = $1
             AND store_id = $2`,
            [
                userId,
                storeId
            ]
        );

        if (existingRating.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "You have not rated this store yet"
            });
        }


        // UPDATE RATING

        const result = await pool.query(
            `UPDATE ratings
             SET
                rating = $1,
                updated_at = CURRENT_TIMESTAMP
             WHERE user_id = $2
             AND store_id = $3
             RETURNING
                id,
                user_id,
                store_id,
                rating,
                created_at,
                updated_at`,
            [
                rating,
                userId,
                storeId
            ]
        );


        res.status(200).json({
            success: true,
            message: "Rating updated successfully",
            rating: result.rows[0]
        });

    } catch (error) {
        console.error(
            "Update rating error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while updating rating"
        });
    }
};


module.exports = {
    createRating,
    updateRating
};

