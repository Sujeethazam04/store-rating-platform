import { useEffect, useMemo, useState } from "react";
import {
    BarChart3,
    LogOut,
    MapPin,
    RefreshCw,
    Star,
    Store,
    Users,
    TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

function OwnerDashboard() {
    const navigate = useNavigate();

    const [store, setStore] = useState(null);
    const [ratings, setRatings] = useState([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const fetchDashboardData = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const [storeResponse, ratingsResponse] =
                await Promise.all([
                    api.get("/owner/store"),
                    api.get("/owner/ratings")
                ]);

            setStore(storeResponse.data.store);
            setRatings(ratingsResponse.data.ratings || []);
        } catch (error) {
            console.error(
                "Owner dashboard error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load dashboard data."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const ratingBreakdown = useMemo(() => {
        return [5, 4, 3, 2, 1].map((rating) => {
            const count = ratings.filter(
                (item) =>
                    Number(item.rating) === rating
            ).length;

            const percentage =
                ratings.length > 0
                    ? Math.round(
                          (count / ratings.length) * 100
                      )
                    : 0;

            return {
                rating,
                count,
                percentage
            };
        });
    }, [ratings]);

    const recentRatings = useMemo(() => {
        return ratings.slice(0, 5);
    }, [ratings]);

    const averageRating = Number(
        store?.overallRating || 0
    ).toFixed(1);

    const totalRatings = Number(
        store?.totalRatings || 0
    );

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", {
            replace: true
        });
    };

    const renderStars = (rating, size = 16) => {
        return (
            <div className="owner-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={size}
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
            <main className="owner-page">
                <div className="owner-grid" />

                <div className="owner-loading-screen">
                    <div className="owner-spinner" />
                    <p>Loading your dashboard...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="owner-page">
            <div className="owner-grid" />

            <div className="owner-glow owner-glow-one" />
            <div className="owner-glow owner-glow-two" />

            {/* HEADER */}
            <header className="owner-header">
                <div className="owner-brand">
                    <div className="owner-brand-icon">
                        <Star
                            size={18}
                            fill="currentColor"
                        />
                    </div>

                    <div>
                        <strong>RateSpace</strong>
                        <span>Owner workspace</span>
                    </div>
                </div>

                <div className="owner-header-actions">
                    <button
                        type="button"
                        className="owner-refresh-button"
                        onClick={() =>
                            fetchDashboardData(true)
                        }
                        disabled={refreshing}
                    >
                        <RefreshCw
                            size={16}
                            className={
                                refreshing
                                    ? "owner-refresh-spin"
                                    : ""
                            }
                        />

                        <span>
                            {refreshing
                                ? "Refreshing..."
                                : "Refresh"}
                        </span>
                    </button>

                    <button
                        type="button"
                        className="owner-logout-button"
                        onClick={handleLogout}
                    >
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </div>
            </header>

            <section className="owner-container">

                {/* HERO */}
                <div className="owner-hero">
                    <div>
                        <div className="owner-badge">
                            <BarChart3 size={14} />
                            <span>Store analytics</span>
                        </div>

                        <h1>
                            Your store,
                            <span>your reputation.</span>
                        </h1>

                        <p>
                            Track customer feedback,
                            understand your ratings, and
                            monitor how your store is performing.
                        </p>
                    </div>

                    <div className="owner-store-mini-card">
                        <div className="owner-store-mini-icon">
                            <Store size={20} />
                        </div>

                        <div>
                            <span>Your store</span>
                            <strong>
                                {store?.name || "My Store"}
                            </strong>
                        </div>
                    </div>
                </div>

                {/* ERROR */}
                {error && (
                    <div className="owner-error">
                        {error}
                    </div>
                )}

                {/* STAT CARDS */}
                <div className="owner-stats-grid">

                    <div className="owner-stat-card">
                        <div className="owner-stat-icon purple">
                            <Star
                                size={20}
                                fill="currentColor"
                            />
                        </div>

                        <div className="owner-stat-content">
                            <span>Overall rating</span>

                            <strong>
                                {averageRating}
                            </strong>

                            <small>
                                out of 5.0
                            </small>
                        </div>

                        <div className="owner-stat-decoration">
                            ★
                        </div>
                    </div>

                    <div className="owner-stat-card">
                        <div className="owner-stat-icon blue">
                            <Users size={20} />
                        </div>

                        <div className="owner-stat-content">
                            <span>Total ratings</span>

                            <strong>
                                {totalRatings}
                            </strong>

                            <small>
                                customer responses
                            </small>
                        </div>
                    </div>

                    <div className="owner-stat-card">
                        <div className="owner-stat-icon green">
                            <TrendingUp size={20} />
                        </div>

                        <div className="owner-stat-content">
                            <span>5-star ratings</span>

                            <strong>
                                {
                                    ratingBreakdown.find(
                                        (item) =>
                                            item.rating === 5
                                    )?.count || 0
                                }
                            </strong>

                            <small>
                                positive experiences
                            </small>
                        </div>
                    </div>

                </div>

                {/* MAIN GRID */}
                <div className="owner-dashboard-grid">

                    {/* STORE PROFILE */}
                    <section className="owner-panel owner-profile-panel">

                        <div className="owner-panel-header">
                            <div>
                                <span>STORE PROFILE</span>
                                <h2>Store information</h2>
                            </div>

                            <div className="owner-panel-icon">
                                <Store size={18} />
                            </div>
                        </div>

                        <div className="owner-profile-main">
                            <div className="owner-profile-store-icon">
                                <Store size={28} />
                            </div>

                            <div>
                                <h3>
                                    {store?.name}
                                </h3>

                                <p>
                                    {store?.email ||
                                        "Store contact email"}
                                </p>
                            </div>
                        </div>

                        <div className="owner-info-list">

                            <div className="owner-info-item">
                                <div>
                                    <MapPin size={17} />
                                </div>

                                <span>
                                    {store?.address ||
                                        "Address not available"}
                                </span>
                            </div>

                            <div className="owner-info-item">
                                <div>
                                    <Star
                                        size={17}
                                        fill="currentColor"
                                    />
                                </div>

                                <span>
                                    {averageRating} average
                                    rating from{" "}
                                    {totalRatings} customer
                                    {totalRatings !== 1
                                        ? "s"
                                        : ""}
                                </span>
                            </div>

                        </div>

                    </section>


                    {/* RATING BREAKDOWN */}
                    <section className="owner-panel">

                        <div className="owner-panel-header">
                            <div>
                                <span>RATING ANALYTICS</span>
                                <h2>Rating breakdown</h2>
                            </div>

                            <div className="owner-panel-icon">
                                <BarChart3 size={18} />
                            </div>
                        </div>

                        <div className="rating-breakdown">

                            {ratingBreakdown.map(
                                (item) => (
                                    <div
                                        className="rating-breakdown-row"
                                        key={item.rating}
                                    >
                                        <div className="rating-label">
                                            <span>
                                                {item.rating}
                                            </span>

                                            <Star
                                                size={13}
                                                fill="currentColor"
                                            />
                                        </div>

                                        <div className="rating-bar">
                                            <div
                                                style={{
                                                    width: `${item.percentage}%`
                                                }}
                                            />
                                        </div>

                                        <strong>
                                            {item.count}
                                        </strong>
                                    </div>
                                )
                            )}

                        </div>

                        {ratings.length === 0 && (
                            <div className="rating-no-data">
                                No ratings received yet.
                            </div>
                        )}

                    </section>

                </div>


                {/* RECENT RATINGS */}
                <section className="owner-panel owner-recent-panel">

                    <div className="owner-panel-header">
                        <div>
                            <span>CUSTOMER FEEDBACK</span>
                            <h2>Recent ratings</h2>
                        </div>

                        <div className="owner-rating-count">
                            {totalRatings} total
                        </div>
                    </div>

                    {recentRatings.length === 0 ? (
                        <div className="owner-no-ratings">
                            <div>
                                <Star size={23} />
                            </div>

                            <h3>No ratings yet</h3>

                            <p>
                                Customer ratings will appear
                                here once someone rates your
                                store.
                            </p>
                        </div>
                    ) : (
                        <div className="owner-ratings-list">

                            {recentRatings.map(
                                (rating) => (
                                    <div
                                        className="owner-rating-row"
                                        key={rating.id}
                                    >

                                        <div className="owner-rating-avatar">
                                            {(
                                                rating.user_name ||
                                                "U"
                                            )
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div className="owner-rating-user">
                                            <strong>
                                                {rating.user_name ||
                                                    "Anonymous User"}
                                            </strong>

                                            <span>
                                                {rating.user_email ||
                                                    "Customer"}
                                            </span>
                                        </div>

                                        <div className="owner-rating-value">
                                            {renderStars(
                                                rating.rating,
                                                15
                                            )}

                                            <strong>
                                                {rating.rating}/5
                                            </strong>
                                        </div>

                                        <div className="owner-rating-date">
                                            {rating.created_at
                                                ? new Date(
                                                      rating.created_at
                                                  ).toLocaleDateString(
                                                      "en-IN",
                                                      {
                                                          day: "2-digit",
                                                          month: "short",
                                                          year: "numeric"
                                                      }
                                                  )
                                                : "Recently"}
                                        </div>

                                    </div>
                                )
                            )}

                        </div>
                    )}

                </section>

            </section>
        </main>
    );
}

export default OwnerDashboard;