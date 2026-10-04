import React from "react";
import {
    LogOut,
    Store,
    Star,
    ArrowRight,
    ShieldCheck
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "./UserDashboard.css";

function UserDashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", {
            replace: true
        });
    };

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const userName =
        user.name ||
        user.full_name ||
        "Normal User";

    return (
        <main className="user-dashboard">

            {/* Background */}
            <div className="user-dashboard-grid" />
            <div className="user-dashboard-glow user-dashboard-glow-one" />
            <div className="user-dashboard-glow user-dashboard-glow-two" />

            {/* Header */}
            <header className="user-dashboard-header">

                <div className="user-dashboard-brand">

                    <div className="user-dashboard-brand-icon">
                        <Star
                            size={18}
                            fill="currentColor"
                        />
                    </div>

                    <div>
                        <strong>RateSpace</strong>
                        <span>User Dashboard</span>
                    </div>

                </div>

                <div className="user-dashboard-header-right">

                    <div className="user-dashboard-user">

                        <div className="user-dashboard-avatar">
                            {userName.charAt(0).toUpperCase()}
                        </div>

                        <div className="user-dashboard-user-info">
                            <strong>{userName}</strong>
                            <span>Normal User</span>
                        </div>

                    </div>

                    <button
                        className="user-dashboard-logout"
                        onClick={handleLogout}
                    >
                        <LogOut size={16} />
                        Logout
                    </button>

                </div>

            </header>

            {/* Main */}
            <section className="user-dashboard-container">

                {/* Hero */}
                <div className="user-dashboard-hero">

                    <div>

                        <div className="user-dashboard-badge">
                            <ShieldCheck size={14} />
                            <span>Welcome back</span>
                        </div>

                        <h1>
                            Discover stores.
                            <span>Rate your experience.</span>
                        </h1>

                        <p>
                            Explore stores, check community ratings,
                            and share your experience with other users.
                        </p>

                    </div>

                </div>

                {/* Cards */}
                <div className="user-dashboard-cards">

                    {/* Browse Stores */}
                    <article className="user-dashboard-card">

                        <div className="user-dashboard-card-icon">
                            <Store size={24} />
                        </div>

                        <div className="user-dashboard-card-content">

                            <span className="user-dashboard-card-label">
                                STORE DIRECTORY
                            </span>

                            <h2>
                                Browse Stores
                            </h2>

                            <p>
                                Search stores by name or address,
                                view ratings, and submit your own rating.
                            </p>

                            <button
                                className="user-dashboard-primary-button"
                                onClick={() => navigate("/stores")}
                            >
                                <span>
                                    Explore Stores
                                </span>

                                <ArrowRight size={17} />
                            </button>

                        </div>

                    </article>

                    {/* Rating */}
                    <article className="user-dashboard-card">

                        <div className="user-dashboard-card-icon rating-icon">
                            <Star
                                size={24}
                                fill="currentColor"
                            />
                        </div>

                        <div className="user-dashboard-card-content">

                            <span className="user-dashboard-card-label">
                                YOUR EXPERIENCE
                            </span>

                            <h2>
                                Rate Stores
                            </h2>

                            <p>
                                Give stores a rating from 1 to 5 stars
                                and update your rating whenever needed.
                            </p>

                            <button
                                className="user-dashboard-secondary-button"
                                onClick={() => navigate("/stores")}
                            >
                                <Star size={16} />
                                Start Rating
                            </button>

                        </div>

                    </article>

                </div>

                {/* Bottom info */}
                <div className="user-dashboard-info">

                    <div>
                        <strong>How it works</strong>

                        <span>
                            Find a store → Check its rating →
                            Share your experience
                        </span>
                    </div>

                    <Star
                        size={20}
                        fill="currentColor"
                    />

                </div>

            </section>

        </main>
    );
}

export default UserDashboard;