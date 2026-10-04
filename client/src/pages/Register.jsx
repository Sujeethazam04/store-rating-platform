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
    UserRound,
    Sparkles
} from "lucide-react";
import api from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "USER"
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.password ||
            !formData.confirmPassword
        ) {
            setError("Please fill in all required fields.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);

        try {
            await api.post("/auth/register", {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });

            setSuccess(
                "Account created successfully. Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1200);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to create account. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="register-page">

            {/* Background */}
            <div className="register-grid" />

            <div className="register-glow register-glow-one" />
            <div className="register-glow register-glow-two" />
            <div className="register-glow register-glow-three" />

            {/* Navbar */}
            <header className="register-navbar">

                <Link to="/login" className="register-brand">
                    <div className="register-brand-icon">
                        <Star size={19} fill="currentColor" />
                    </div>

                    <span>RateSpace</span>
                </Link>

                <Link
                    to="/login"
                    className="register-login-link"
                >
                    Already have an account?
                    <strong>Sign in</strong>
                </Link>

            </header>

            {/* Main */}
            <section className="register-main">

                {/* Left Hero */}
                <div className="register-hero">

                    <div className="register-badge">
                        <Sparkles size={15} />
                        <span>Join the rating community</span>
                    </div>

                    <h1>
                        Your experience
                        <span>matters.</span>
                    </h1>

                    <p className="register-hero-description">
                        Create your RateSpace account and start discovering
                        stores, sharing ratings, and helping others make
                        better decisions.
                    </p>

                    <div className="register-feature-list">

                        <div className="register-feature">
                            <div className="register-feature-icon">
                                <Store size={18} />
                            </div>

                            <div>
                                <strong>Discover stores</strong>
                                <span>
                                    Explore stores and their ratings.
                                </span>
                            </div>
                        </div>

                        <div className="register-feature">
                            <div className="register-feature-icon">
                                <Star
                                    size={18}
                                    fill="currentColor"
                                />
                            </div>

                            <div>
                                <strong>Share your rating</strong>
                                <span>
                                    Give honest 1–5 star ratings.
                                </span>
                            </div>
                        </div>

                        <div className="register-feature">
                            <div className="register-feature-icon">
                                <UserRound size={18} />
                            </div>

                            <div>
                                <strong>Build your profile</strong>
                                <span>
                                    Keep your store experiences organized.
                                </span>
                            </div>
                        </div>

                    </div>

                </div>

                {/* Register Card */}
                <div className="register-card-wrapper">

                    <div className="register-card">

                        {/* Card Header */}
                        <div className="register-card-header">

                            <div className="register-icon-box">
                                <UserRound size={21} />
                            </div>

                            <div>
                                <h2>Create account</h2>

                                <p>
                                    Get started with RateSpace.
                                </p>
                            </div>

                        </div>

                        {/* Error */}
                        {error && (
                            <div className="register-message register-error">
                                {error}
                            </div>
                        )}

                        {/* Success */}
                        {success && (
                            <div className="register-message register-success">
                                {success}
                            </div>
                        )}

                        {/* Form */}
                        <form
                            className="register-form"
                            onSubmit={handleSubmit}
                        >

                            {/* Name */}
                            <div className="register-field">

                                <label htmlFor="name">
                                    Full name
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    autoComplete="name"
                                    required
                                />

                            </div>

                            {/* Email */}
                            <div className="register-field">

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

                            {/* Role */}
                            <div className="register-field">

                                <label>
                                    Account type
                                </label>

                                <div className="role-options">

                                    <label
                                        className={`role-option ${
                                            formData.role === "USER"
                                                ? "active"
                                                : ""
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="role"
                                            value="USER"
                                            checked={
                                                formData.role === "USER"
                                            }
                                            onChange={handleChange}
                                        />

                                        <div className="role-option-icon">
                                            <UserRound size={17} />
                                        </div>

                                        <div className="role-option-text">
                                            <strong>Normal User</strong>
                                            <span>
                                                Discover & rate stores
                                            </span>
                                        </div>

                                    </label>

                                    <label
                                        className={`role-option ${
                                            formData.role === "STORE_OWNER"
                                                ? "active"
                                                : ""
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="role"
                                            value="STORE_OWNER"
                                            checked={
                                                formData.role ===
                                                "STORE_OWNER"
                                            }
                                            onChange={handleChange}
                                        />

                                        <div className="role-option-icon">
                                            <Store size={17} />
                                        </div>

                                        <div className="role-option-text">
                                            <strong>Store Owner</strong>
                                            <span>
                                                Manage your store ratings
                                            </span>
                                        </div>

                                    </label>

                                </div>

                            </div>

                            {/* Password */}
                            <div className="register-field">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <div className="register-password">

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
                                        placeholder="Create a password"
                                        autoComplete="new-password"
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

                            {/* Confirm Password */}
                            <div className="register-field">

                                <label htmlFor="confirmPassword">
                                    Confirm password
                                </label>

                                <div className="register-password">

                                    <input
                                        id="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="confirmPassword"
                                        value={
                                            formData.confirmPassword
                                        }
                                        onChange={handleChange}
                                        placeholder="Confirm your password"
                                        autoComplete="new-password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        aria-label={
                                            showConfirmPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>

                                </div>

                            </div>

                            {/* Submit */}
                            <button
                                className="register-submit"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="register-spinner" />
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        Create my account
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>

                        </form>

                        {/* Security */}
                        <div className="register-security">

                            <div>
                                <LockKeyhole size={15} />
                            </div>

                            <p>
                                Your information is protected with
                                secure authentication.
                            </p>

                        </div>

                        {/* Login */}
                        <div className="register-bottom">

                            <span>
                                Already have an account?
                            </span>

                            <Link to="/login">
                                Sign in
                                <ArrowRight size={14} />
                            </Link>

                        </div>

                    </div>

                    <p className="register-copyright">
                        © 2026 RateSpace · Store Rating Platform
                    </p>

                </div>

            </section>

        </main>
    );
}

export default Register;