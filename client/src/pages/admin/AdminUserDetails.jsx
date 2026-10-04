import React, { useEffect, useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    Mail,
    MapPin,
    Shield,
    UserRound,
    Hash
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";

function AdminUserDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchUser();
    }, [id]);

    const fetchUser = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/admin/users/${id}`
            );

            console.log(
                "USER DETAILS RESPONSE:",
                response.data
            );

            const userData =
                response.data?.user ||
                response.data?.data ||
                null;

            setUser(userData);

        } catch (error) {
            console.error(
                "Fetch user error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load user details."
            );

        } finally {
            setLoading(false);
        }
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case "ADMIN":
                return "Administrator";

            case "STORE_OWNER":
                return "Store Owner";

            case "USER":
                return "Normal User";

            default:
                return role || "Unknown";
        }
    };

    const getRoleClass = (role) => {
        switch (role) {
            case "ADMIN":
                return "admin";

            case "STORE_OWNER":
                return "store-owner";

            default:
                return "user";
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "Not available";
        }

        return new Date(date).toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    };

    if (loading) {
        return (
            <div className="admin-page">

                <div className="admin-empty-state">
                    Loading user details...
                </div>

            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-page">

                <div className="admin-page-header">

                    <div>
                        <div className="admin-eyebrow">
                            ADMINISTRATION
                        </div>

                        <h1 className="admin-page-title">
                            User Details
                        </h1>
                    </div>

                    <button
                        className="admin-secondary-btn"
                        onClick={() =>
                            navigate("/admin-users")
                        }
                    >
                        <ArrowLeft size={18} />
                        Back to Users
                    </button>

                </div>

                <div className="admin-empty-state">
                    {error}
                </div>

            </div>
        );
    }

    if (!user) {
        return (
            <div className="admin-page">

                <div className="admin-page-header">

                    <div>
                        <div className="admin-eyebrow">
                            ADMINISTRATION
                        </div>

                        <h1 className="admin-page-title">
                            User Details
                        </h1>
                    </div>

                    <button
                        className="admin-secondary-btn"
                        onClick={() =>
                            navigate("/admin-users")
                        }
                    >
                        <ArrowLeft size={18} />
                        Back to Users
                    </button>

                </div>

                <div className="admin-empty-state">
                    User not found.
                </div>

            </div>
        );
    }

    return (
        <div className="admin-page">

            {/* =========================================
                HEADER
            ========================================= */}

            <div className="admin-page-header">

                <div>
                    <div className="admin-eyebrow">
                        ADMINISTRATION
                    </div>

                    <h1 className="admin-page-title">
                        User Details
                    </h1>

                    <p className="admin-page-subtitle">
                        Complete information about this user.
                    </p>
                </div>

                <button
                    className="admin-secondary-btn"
                    onClick={() =>
                        navigate("/admin-users")
                    }
                >
                    <ArrowLeft size={18} />
                    Back to Users
                </button>

            </div>


            {/* =========================================
                PROFILE HEADER
            ========================================= */}

            <div className="admin-user-profile-card">

                <div className="admin-user-profile-left">

                    <div className="admin-user-profile-avatar">
                        <UserRound size={36} />
                    </div>

                    <div>

                        <h2 className="admin-user-profile-name">
                            {user.name}
                        </h2>

                        <div className="admin-user-profile-email">
                            <Mail size={16} />
                            {user.email}
                        </div>

                    </div>

                </div>

                <span
                    className={`admin-role-badge ${getRoleClass(
                        user.role
                    )}`}
                >
                    {getRoleLabel(user.role)}
                </span>

            </div>


            {/* =========================================
                USER INFORMATION
            ========================================= */}

            <div className="admin-table-card admin-user-details-card">

                <div className="admin-user-details-title">
                    <UserRound size={20} />
                    Personal Information
                </div>

                <div className="admin-user-details-grid">

                    {/* NAME */}

                    <div className="admin-user-detail-item">

                        <div className="admin-user-detail-icon">
                            <UserRound size={20} />
                        </div>

                        <div>
                            <span>Full Name</span>

                            <strong>
                                {user.name || "Not available"}
                            </strong>
                        </div>

                    </div>


                    {/* EMAIL */}

                    <div className="admin-user-detail-item">

                        <div className="admin-user-detail-icon">
                            <Mail size={20} />
                        </div>

                        <div>
                            <span>Email Address</span>

                            <strong>
                                {user.email || "Not available"}
                            </strong>
                        </div>

                    </div>


                    {/* ADDRESS */}

                    <div className="admin-user-detail-item">

                        <div className="admin-user-detail-icon">
                            <MapPin size={20} />
                        </div>

                        <div>
                            <span>Address</span>

                            <strong>
                                {user.address ||
                                    "Not provided"}
                            </strong>
                        </div>

                    </div>


                    {/* ROLE */}

                    <div className="admin-user-detail-item">

                        <div className="admin-user-detail-icon">
                            <Shield size={20} />
                        </div>

                        <div>
                            <span>Role</span>

                            <strong>
                                {getRoleLabel(user.role)}
                            </strong>
                        </div>

                    </div>


                    {/* USER ID */}

                    <div className="admin-user-detail-item">

                        <div className="admin-user-detail-icon">
                            <Hash size={20} />
                        </div>

                        <div>
                            <span>User ID</span>

                            <strong>
                                #{user.id}
                            </strong>
                        </div>

                    </div>


                    {/* CREATED DATE */}

                    <div className="admin-user-detail-item">

                        <div className="admin-user-detail-icon">
                            <CalendarDays size={20} />
                        </div>

                        <div>
                            <span>Account Created</span>

                            <strong>
                                {formatDate(
                                    user.created_at
                                )}
                            </strong>
                        </div>

                    </div>


                    {/* UPDATED DATE */}

                    <div className="admin-user-detail-item">

                        <div className="admin-user-detail-icon">
                            <CalendarDays size={20} />
                        </div>

                        <div>
                            <span>Last Updated</span>

                            <strong>
                                {formatDate(
                                    user.updated_at
                                )}
                            </strong>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AdminUserDetails;