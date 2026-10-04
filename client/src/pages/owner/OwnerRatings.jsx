import { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    RefreshCw,
    Search,
    Star,
    Users,
    X
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

function OwnerRatings() {
    const navigate = useNavigate();

    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [ratingFilter, setRatingFilter] = useState("ALL");

    const fetchRatings = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const response = await api.get("/owner/ratings");

            setRatings(response.data.ratings || []);
        } catch (error) {
            console.error(
                "Owner ratings error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load ratings."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchRatings();
    }, []);

    const filteredRatings = useMemo(() => {
        return ratings.filter((item) => {
            const customerName =
                item.user_name?.toLowerCase() || "";

            const customerEmail =
                item.user_email?.toLowerCase() || "";

            const searchValue =
                search.toLowerCase().trim();

            const matchesSearch =
                !searchValue ||
                customerName.includes(searchValue) ||
                customerEmail.includes(searchValue);

            const matchesRating =
                ratingFilter === "ALL" ||
                Number(item.rating) ===
                    Number(ratingFilter);

            return (
                matchesSearch &&
                matchesRating
            );
        });
    }, [ratings, search, ratingFilter]);

    const averageRating = useMemo(() => {
        if (ratings.length === 0) {
            return "0.0";
        }

        const total = ratings.reduce(
            (sum, item) =>
                sum + Number(item.rating || 0),
            0
        );

        return (total / ratings.length).toFixed(1);
    }, [ratings]);

    const fiveStarCount = useMemo(() => {
        return ratings.filter(
            (item) => Number(item.rating) === 5
        ).length;
    }, [ratings]);

    const clearFilters = () => {
        setSearch("");
        setRatingFilter("ALL");
    };

    const renderStars = (rating) => {
        return (
            <div className="owner-ratings-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={15}
                        fill={
                            star <= Number(rating)
                                ? "currentColor"
                                : "none"
                        }
                    />
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <main className="owner-ratings-page">
                <div className="owner-ratings-grid" />

                <div className="owner-ratings-loading">
                    <div className="owner-ratings-spinner" />
                    <p>Loading customer ratings...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="owner-ratings-page">

            <div className="owner-ratings-grid" />
            <div className="owner-ratings-glow one" />
            <div className="owner-ratings-glow two" />

            {/* HEADER */}
            <header className="owner-ratings-header">

                <div className="owner-ratings-brand">
                    <button
                        type="button"
                        className="owner-ratings-back"
                        onClick={() =>
                            navigate("/owner-dashboard")
                        }
                    >
                        <ArrowLeft size={17} />
                    </button>

                    <div>
                        <strong>RateSpace</strong>
                        <span>Customer feedback</span>
                    </div>
                </div>

                <button
                    type="button"
                    className="owner-ratings-refresh"
                    onClick={() =>
                        fetchRatings(true)
                    }
                    disabled={refreshing}
                >
                    <RefreshCw
                        size={16}
                        className={
                            refreshing
                                ? "owner-ratings-refresh-spin"
                                : ""
                        }
                    />

                    <span>
                        {refreshing
                            ? "Refreshing..."
                            : "Refresh"}
                    </span>
                </button>

            </header>

            <section className="owner-ratings-container">

                {/* HERO */}
                <div className="owner-ratings-hero">

                    <div>
                        <div className="owner-ratings-badge">
                            <Users size={14} />
                            <span>Customer feedback</span>
                        </div>

                        <h1>
                            Know what your
                            <span>customers think.</span>
                        </h1>

                        <p>
                            Review every rating your store has
                            received and understand your
                            customers' experience.
                        </p>
                    </div>

                </div>

                {/* ERROR */}
                {error && (
                    <div className="owner-ratings-error">
                        {error}
                    </div>
                )}

                {/* SUMMARY */}
                <div className="owner-ratings-summary">

                    <div className="owner-ratings-summary-card">

                        <div className="owner-ratings-summary-icon purple">
                            <Star
                                size={19}
                                fill="currentColor"
                            />
                        </div>

                        <div>
                            <span>Average rating</span>
                            <strong>
                                {averageRating}
                            </strong>
                        </div>

                    </div>

                    <div className="owner-ratings-summary-card">

                        <div className="owner-ratings-summary-icon blue">
                            <Users size={19} />
                        </div>

                        <div>
                            <span>Total reviews</span>
                            <strong>
                                {ratings.length}
                            </strong>
                        </div>

                    </div>

                    <div className="owner-ratings-summary-card">

                        <div className="owner-ratings-summary-icon green">
                            <Star
                                size={19}
                                fill="currentColor"
                            />
                        </div>

                        <div>
                            <span>5-star ratings</span>
                            <strong>
                                {fiveStarCount}
                            </strong>
                        </div>

                    </div>

                </div>

                {/* FILTER CARD */}
                <div className="owner-ratings-filter-card">

                    <div className="owner-ratings-search">
                        <Search size={17} />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search customer by name or email..."
                        />
                    </div>

                    <select
                        value={ratingFilter}
                        onChange={(e) =>
                            setRatingFilter(e.target.value)
                        }
                    >
                        <option value="ALL">
                            All ratings
                        </option>

                        <option value="5">
                            5 stars
                        </option>

                        <option value="4">
                            4 stars
                        </option>

                        <option value="3">
                            3 stars
                        </option>

                        <option value="2">
                            2 stars
                        </option>

                        <option value="1">
                            1 star
                        </option>
                    </select>

                    {(search || ratingFilter !== "ALL") && (
                        <button
                            type="button"
                            className="owner-ratings-clear"
                            onClick={clearFilters}
                        >
                            <X size={15} />
                            Clear
                        </button>
                    )}

                </div>

                {/* TABLE */}
                <section className="owner-ratings-panel">

                    <div className="owner-ratings-panel-header">

                        <div>
                            <span>RATINGS</span>

                            <h2>
                                Customer reviews
                            </h2>
                        </div>

                        <p>
                            {filteredRatings.length} of{" "}
                            {ratings.length}
                        </p>

                    </div>

                    {filteredRatings.length === 0 ? (
                        <div className="owner-ratings-empty">

                            <div className="owner-ratings-empty-icon">
                                <Search size={22} />
                            </div>

                            <h3>
                                No ratings found
                            </h3>

                            <p>
                                Try changing your search or
                                rating filter.
                            </p>

                            {(search ||
                                ratingFilter !== "ALL") && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                >
                                    Clear filters
                                </button>
                            )}

                        </div>
                    ) : (
                        <div className="owner-ratings-table-wrapper">

                            <table className="owner-ratings-table">

                                <thead>
                                    <tr>
                                        <th>Customer</th>
                                        <th>Rating</th>
                                        <th>Date</th>
                                        <th>Updated</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {filteredRatings.map(
                                        (item) => (
                                            <tr key={item.id}>

                                                <td>
                                                    <div className="owner-customer-cell">

                                                        <div className="owner-customer-avatar">
                                                            {(
                                                                item.user_name ||
                                                                "U"
                                                            )
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>

                                                        <div>
                                                            <strong>
                                                                {item.user_name ||
                                                                    "Unknown customer"}
                                                            </strong>

                                                            <span>
                                                                {item.user_email ||
                                                                    "No email available"}
                                                            </span>
                                                        </div>

                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="owner-rating-cell">

                                                        {renderStars(
                                                            item.rating
                                                        )}

                                                        <strong>
                                                            {item.rating}/5
                                                        </strong>

                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="owner-date-cell">
                                                        <CalendarDays
                                                            size={14}
                                                        />

                                                        <span>
                                                            {item.created_at
                                                                ? new Date(
                                                                      item.created_at
                                                                  ).toLocaleDateString(
                                                                      "en-IN",
                                                                      {
                                                                          day: "2-digit",
                                                                          month: "short",
                                                                          year: "numeric"
                                                                      }
                                                                  )
                                                                : "—"}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td>
                                                    <span
                                                        className={
                                                            item.updated_at &&
                                                            item.created_at !==
                                                                item.updated_at
                                                                ? "owner-updated-badge"
                                                                : "owner-not-updated"
                                                        }
                                                    >
                                                        {item.updated_at &&
                                                        item.created_at !==
                                                            item.updated_at
                                                            ? "Updated"
                                                            : "Original"}
                                                    </span>
                                                </td>

                                            </tr>
                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>
                    )}

                </section>

            </section>

        </main>
    );
}

export default OwnerRatings;