import { useEffect, useState } from "react";

import {
    BarChart3,
    LogOut,
    RefreshCw,
    ShieldCheck,
    Star,
    Store,
    Users
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import "./AdminDashboard.css";


const AdminDashboard = () => {
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        users: 0,
        stores: 0,
        ratings: 0
    });

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");


    // ======================================================
    // FETCH DASHBOARD STATS
    // ======================================================

    const fetchDashboardStats = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const response = await api.get("/admin/dashboard");

            const data = response.data?.data || {};

            setStats({
                users: Number(data.totalUsers || 0),
                stores: Number(data.totalStores || 0),
                ratings: Number(data.totalRatings || 0)
            });

        } catch (err) {
            console.error("Dashboard stats error:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load dashboard statistics."
            );

        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };


    // ======================================================
    // LOAD DASHBOARD
    // ======================================================

    useEffect(() => {
        fetchDashboardStats();
    }, []);


    // ======================================================
    // LOGOUT
    // ======================================================

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };


    // ======================================================
    // LOADING SCREEN
    // ======================================================

    if (loading) {
        return (
            <main className="admin-dashboard-page">

                <div className="admin-dashboard-loading">

                    <div className="admin-dashboard-spinner"></div>

                    <p>
                        Loading dashboard...
                    </p>

                </div>

            </main>
        );
    }


    return (
        <main className="admin-dashboard-page">

            {/* ==================================================
                HEADER
            ================================================== */}

            <header className="admin-dashboard-header">

                <div className="admin-dashboard-brand">

                    <div className="admin-dashboard-brand-icon">
                        <ShieldCheck size={24} />
                    </div>

                    <div>
                        <h1>
                            RateSpace Admin
                        </h1>

                        <p>
                            System Administration
                        </p>
                    </div>

                </div>


                <div className="admin-dashboard-header-actions">

                    <button
                        type="button"
                        className="admin-dashboard-refresh-button"
                        onClick={() => fetchDashboardStats(true)}
                        disabled={refreshing}
                    >

                        <RefreshCw
                            size={16}
                            className={
                                refreshing
                                    ? "admin-dashboard-refresh-spin"
                                    : ""
                            }
                        />

                        {refreshing
                            ? "Refreshing..."
                            : "Refresh"
                        }

                    </button>


                    <button
                        type="button"
                        className="admin-dashboard-logout-button"
                        onClick={handleLogout}
                    >

                        <LogOut size={16} />

                        Logout

                    </button>

                </div>

            </header>


            <div className="admin-dashboard-container">

                {/* ==================================================
                    HERO
                ================================================== */}

                <section className="admin-dashboard-hero">

                    <span className="admin-dashboard-badge">
                        Administrator Panel
                    </span>


                    <h2>
                        Welcome to your
                        <span>
                            {" "}Admin Dashboard
                        </span>
                    </h2>


                    <p>
                        Manage users, stores and ratings from one central
                        administration panel.
                    </p>


                    <div className="admin-dashboard-hero-card">

                        <div className="admin-dashboard-hero-card-icon">
                            <BarChart3 size={20} />
                        </div>


                        <div>

                            <strong>
                                Platform Overview
                            </strong>

                            <span>
                                Monitor your complete RateSpace platform.
                            </span>

                        </div>

                    </div>

                </section>


                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (
                    <div className="admin-dashboard-error">
                        {error}
                    </div>
                )}


                {/* ==================================================
                    STATISTICS
                ================================================== */}

                <section className="admin-dashboard-stats">

                    {/* USERS */}

                    <div className="admin-dashboard-stat-card">

                        <div className="admin-dashboard-stat-top">

                            <div className="admin-dashboard-stat-icon purple">
                                <Users size={22} />
                            </div>

                        </div>


                        <h3>
                            {stats.users}
                        </h3>


                        <p>
                            Total Users
                        </p>

                    </div>


                    {/* STORES */}

                    <div className="admin-dashboard-stat-card">

                        <div className="admin-dashboard-stat-top">

                            <div className="admin-dashboard-stat-icon blue">
                                <Store size={22} />
                            </div>

                        </div>


                        <h3>
                            {stats.stores}
                        </h3>


                        <p>
                            Total Stores
                        </p>

                    </div>


                    {/* RATINGS */}

                    <div className="admin-dashboard-stat-card">

                        <div className="admin-dashboard-stat-top">

                            <div className="admin-dashboard-stat-icon yellow">
                                <Star size={22} />
                            </div>

                        </div>


                        <h3>
                            {stats.ratings}
                        </h3>


                        <p>
                            Total Ratings
                        </p>

                    </div>

                </section>


                {/* ==================================================
                    MANAGEMENT
                ================================================== */}

                <section className="admin-dashboard-management">

                    <div className="admin-dashboard-section-heading">

                        <h2>
                            Management
                        </h2>

                        <p>
                            Manage the core resources of the platform.
                        </p>

                    </div>


                    <div className="admin-dashboard-management-grid">

                        {/* USERS */}

                        <div className="admin-dashboard-management-card">

                            <div className="admin-dashboard-management-icon purple">
                                <Users size={23} />
                            </div>


                            <div className="admin-dashboard-management-content">

                                <h3 className="admin-dashboard-management-title">
                                    Manage Users
                                </h3>


                                <p>
                                    Create, view and manage platform users.
                                </p>


                                <button
                                    type="button"
                                    className="admin-dashboard-management-link"
                                    onClick={() =>
                                        navigate("/admin-users")
                                    }
                                >
                                    Open User Management
                                    <span>→</span>
                                </button>

                            </div>

                        </div>


                        {/* STORES */}

                        <div className="admin-dashboard-management-card">

                            <div className="admin-dashboard-management-icon blue">
                                <Store size={23} />
                            </div>


                            <div className="admin-dashboard-management-content">

                                <h3 className="admin-dashboard-management-title">
                                    Manage Stores
                                </h3>


                                <p>
                                    Add and manage stores available on the
                                    platform.
                                </p>


                                <button
                                    type="button"
                                    className="admin-dashboard-management-link"
                                    onClick={() =>
                                        navigate("/admin-stores")
                                    }
                                >
                                    Open Store Management
                                    <span>→</span>
                                </button>

                            </div>

                        </div>

                    </div>

                </section>


                {/* ==================================================
                    PLATFORM SNAPSHOT
                ================================================== */}

                <section className="admin-dashboard-snapshot">

                    <div className="admin-dashboard-snapshot-heading">

                        <h2>
                            Platform Snapshot
                        </h2>

                        <p>
                            Current platform statistics.
                        </p>

                    </div>


                    <div className="admin-dashboard-snapshot-content">

                        {/* USERS */}

                        <div className="admin-dashboard-snapshot-item">

                            <div className="admin-dashboard-snapshot-icon">
                                <Users size={18} />
                            </div>


                            <div>

                                <strong>
                                    {stats.users}
                                </strong>

                                <span>
                                    Users
                                </span>

                            </div>

                        </div>


                        <div className="admin-dashboard-snapshot-divider"></div>


                        {/* STORES */}

                        <div className="admin-dashboard-snapshot-item">

                            <div className="admin-dashboard-snapshot-icon">
                                <Store size={18} />
                            </div>


                            <div>

                                <strong>
                                    {stats.stores}
                                </strong>

                                <span>
                                    Stores
                                </span>

                            </div>

                        </div>


                        <div className="admin-dashboard-snapshot-divider"></div>


                        {/* RATINGS */}

                        <div className="admin-dashboard-snapshot-item">

                            <div className="admin-dashboard-snapshot-icon">
                                <Star size={18} />
                            </div>


                            <div>

                                <strong>
                                    {stats.ratings}
                                </strong>

                                <span>
                                    Ratings
                                </span>

                            </div>

                        </div>

                    </div>

                </section>

            </div>

        </main>
    );
};


export default AdminDashboard;