import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    ArrowRight,
    Eye,
    EyeOff,
    LockKeyhole,
    ShieldCheck,
    Star,
    Store,
    Users,
    Sparkles,
    TrendingUp
} from "lucide-react";

import api from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post(
                "/auth/login",
                formData
            );

            const { token, user } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            // Role based redirect
            if (user.role === "ADMIN") {
                navigate("/admin-dashboard", {
                    replace: true
                });
            } else if (user.role === "STORE_OWNER") {
                navigate("/owner-dashboard", {
                    replace: true
                });
            } else if (user.role === "USER") {
                navigate("/user-dashboard", {
                    replace: true
                });
            } else {
                setError("Invalid user role.");
            }

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to login. Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="login-page">

            {/* Background */}
            <div className="login-grid" />

            <div className="login-glow login-glow-one" />
            <div className="login-glow login-glow-two" />
            <div className="login-glow login-glow-three" />

            {/* Navbar */}
            <header className="login-navbar">

                <Link
                    to="/login"
                    className="login-brand"
                >
                    <div className="login-brand-icon">
                        <Star
                            size={19}
                            fill="currentColor"
                        />
                    </div>

                    <span>RateSpace</span>
                </Link>

            </header>

            {/* Main */}
            <section className="login-main">

                {/* Hero Section */}
                <div className="login-hero">

                    <div className="hero-badge">
                        <Sparkles size={15} />

                        <span>
                            Smart store discovery
                        </span>
                    </div>

                    <h1>
                        Every rating tells
                        <span>a story.</span>
                    </h1>

                    <p className="hero-description">
                        Discover trusted stores, share honest
                        experiences, and make smarter choices
                        with a community built around real
                        customer feedback.
                    </p>

                    {/* Floating Rating Card */}
                    <div className="floating-rating-card">

                        <div className="floating-icon">
                            <Star
                                size={20}
                                fill="currentColor"
                            />
                        </div>

                        <div className="floating-rating-content">

                            <span>
                                Community rating
                            </span>

                            <div className="rating-value">

                                <strong>
                                    4.8
                                </strong>

                                <div className="mini-stars">

                                    <Star
                                        size={11}
                                        fill="currentColor"
                                    />

                                    <Star
                                        size={11}
                                        fill="currentColor"
                                    />

                                    <Star
                                        size={11}
                                        fill="currentColor"
                                    />

                                    <Star
                                        size={11}
                                        fill="currentColor"
                                    />

                                    <Star
                                        size={11}
                                        fill="currentColor"
                                    />

                                </div>

                            </div>

                        </div>

                        <TrendingUp
                            className="trend-icon"
                            size={18}
                        />

                    </div>

                    {/* Hero Stats */}
                    <div className="hero-stats">

                        <div className="hero-stat">

                            <div className="hero-stat-icon">
                                <Store size={17} />
                            </div>

                            <div>
                                <strong>
                                    1,200+
                                </strong>

                                <span>
                                    Stores
                                </span>
                            </div>

                        </div>

                        <div className="hero-stat">

                            <div className="hero-stat-icon">
                                <Users size={17} />
                            </div>

                            <div>
                                <strong>
                                    8.5K+
                                </strong>

                                <span>
                                    Reviews
                                </span>
                            </div>

                        </div>

                        <div className="hero-stat">

                            <div className="hero-stat-icon">
                                <ShieldCheck size={17} />
                            </div>

                            <div>
                                <strong>
                                    Trusted
                                </strong>

                                <span>
                                    Community
                                </span>
                            </div>

                        </div>

                    </div>

                </div>

                {/* Login Section */}
                <div className="login-card-wrapper">

                    <div className="login-card">

                        {/* Login Header */}
                        <div className="login-card-top">

                            <div className="login-icon-box">
                                <LockKeyhole size={21} />
                            </div>

                            <div>

                                <h2>
                                    Welcome back
                                </h2>

                                <p>
                                    Sign in to continue to RateSpace.
                                </p>

                            </div>

                        </div>

                        {/* Error */}
                        {error && (
                            <div className="login-error">
                                <span>
                                    {error}
                                </span>
                            </div>
                        )}

                        {/* Login Form */}
                        <form
                            className="login-form"
                            onSubmit={handleSubmit}
                        >

                            {/* Email */}
                            <div className="login-field">

                                <label htmlFor="email">
                                    Email address
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    required
                                />

                            </div>

                            {/* Password */}
                            <div className="login-field">

                                <div className="field-label-row">

                                    <label htmlFor="password">
                                        Password
                                    </label>

                                    <span>
                                        Secure login
                                    </span>

                                </div>

                                <div className="login-password">

                                    <input
                                        id="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>

                                </div>

                            </div>

                            {/* Submit */}
                            <button
                                className="login-submit"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="login-spinner" />

                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign in to your account

                                        <ArrowRight
                                            size={18}
                                        />
                                    </>
                                )}
                            </button>

                        </form>

                        {/* Trust Divider */}
                        <div className="login-or">

                            <span />

                            <p>
                                Trusted experience
                            </p>

                            <span />

                        </div>

                        {/* Security Message */}
                        <div className="login-trust">

                            <div>
                                <ShieldCheck size={16} />
                            </div>

                            <p>
                                Your account and personal information
                                are protected with secure authentication.
                            </p>

                        </div>

                        {/* Register */}
                        <div className="login-register">

                            <span>
                                New to RateSpace?
                            </span>

                            <Link to="/register">
                                Create your free account

                                <ArrowRight
                                    size={15}
                                />
                            </Link>

                        </div>

                    </div>

                    <p className="login-copyright">
                        © 2026 RateSpace · Store Rating Platform
                    </p>

                </div>

            </section>

        </main>
    );
}

export default Login;