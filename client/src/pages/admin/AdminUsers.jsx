import React, { useEffect, useState } from "react";
import {
    Plus,
    RefreshCw,
    Search,
    Eye,
    X,
    Edit3,
    Trash2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import "../../assets/admin.css";

function AdminUsers() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [role, setRole] = useState("");

    // CREATE MODAL
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);

    // EDIT MODAL
    const [showEditModal, setShowEditModal] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);

    // DELETE
    const [deletingId, setDeletingId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        password: "",
        role: "USER"
    });

    const [formError, setFormError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // ======================================================
    // FETCH USERS
    // ======================================================

    const fetchUsers = async () => {
        try {
            setLoading(true);

            const params = {};

            if (search.trim()) {
                params.name = search.trim();
            }

            if (role) {
                params.role = role;
            }

            const response = await api.get(
                "/admin/users",
                {
                    params
                }
            );

            setUsers(response.data?.users || []);
        } catch (error) {
            console.error(
                "Fetch users error:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [search, role]);

    // ======================================================
    // FORM INPUT
    // ======================================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setFormError("");
        setSuccessMessage("");
    };

    // ======================================================
    // OPEN CREATE MODAL
    // ======================================================

    const openCreateModal = () => {
        setFormData({
            name: "",
            email: "",
            address: "",
            password: "",
            role: "USER"
        });

        setFormError("");
        setSuccessMessage("");

        setShowModal(true);
    };

    // ======================================================
    // CLOSE CREATE MODAL
    // ======================================================

    const closeCreateModal = () => {
        if (creating) {
            return;
        }

        setShowModal(false);
        setFormError("");
        setSuccessMessage("");
    };

    // ======================================================
    // CREATE USER
    // ======================================================

    const handleCreateUser = async (event) => {
        event.preventDefault();

        try {
            setCreating(true);
            setFormError("");
            setSuccessMessage("");

            if (!formData.name.trim()) {
                setFormError("Name is required.");
                return;
            }

            if (!formData.email.trim()) {
                setFormError("Email is required.");
                return;
            }

            if (!formData.address.trim()) {
                setFormError("Address is required.");
                return;
            }

            if (!formData.password) {
                setFormError("Password is required.");
                return;
            }

            if (formData.password.length < 6) {
                setFormError(
                    "Password must be at least 6 characters."
                );
                return;
            }

            const response = await api.post(
                "/admin/users",
                {
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    address: formData.address.trim(),
                    password: formData.password,
                    role: formData.role
                }
            );

            setSuccessMessage(
                response.data?.message ||
                    "User created successfully."
            );

            setFormData({
                name: "",
                email: "",
                address: "",
                password: "",
                role: "USER"
            });

            await fetchUsers();

            setTimeout(() => {
                setShowModal(false);
                setSuccessMessage("");
            }, 1000);
        } catch (error) {
            console.error(
                "Create user error:",
                error
            );

            setFormError(
                error.response?.data?.message ||
                    "Failed to create user."
            );
        } finally {
            setCreating(false);
        }
    };

    // ======================================================
    // OPEN EDIT MODAL
    // ======================================================

    const openEditModal = (user) => {
        setEditingUserId(user.id);

        setFormData({
            name: user.name || "",
            email: user.email || "",
            address: user.address || "",
            password: "",
            role: user.role || "USER"
        });

        setFormError("");
        setSuccessMessage("");

        setShowEditModal(true);
    };

    // ======================================================
    // CLOSE EDIT MODAL
    // ======================================================

    const closeEditModal = () => {
        if (editing) {
            return;
        }

        setShowEditModal(false);
        setEditingUserId(null);
        setFormError("");
        setSuccessMessage("");
    };

    // ======================================================
    // UPDATE USER
    // ======================================================

    const handleUpdateUser = async (event) => {
        event.preventDefault();

        try {
            setEditing(true);
            setFormError("");
            setSuccessMessage("");

            if (!formData.name.trim()) {
                setFormError("Name is required.");
                return;
            }

            if (!formData.email.trim()) {
                setFormError("Email is required.");
                return;
            }

            if (!formData.address.trim()) {
                setFormError("Address is required.");
                return;
            }

            if (
                formData.password &&
                formData.password.length < 6
            ) {
                setFormError(
                    "Password must be at least 6 characters."
                );
                return;
            }

            const updateData = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                address: formData.address.trim(),
                role: formData.role
            };

            if (formData.password.trim()) {
                updateData.password =
                    formData.password;
            }

            const response = await api.put(
                `/admin/users/${editingUserId}`,
                updateData
            );

            setSuccessMessage(
                response.data?.message ||
                    "User updated successfully."
            );

            await fetchUsers();

            setTimeout(() => {
                setShowEditModal(false);
                setEditingUserId(null);
                setSuccessMessage("");
            }, 1000);
        } catch (error) {
            console.error(
                "Update user error:",
                error
            );

            setFormError(
                error.response?.data?.message ||
                    "Failed to update user."
            );
        } finally {
            setEditing(false);
        }
    };

    // ======================================================
    // DELETE USER
    // ======================================================

    const handleDeleteUser = async (user) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${user.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(user.id);

            const response = await api.delete(
                `/admin/users/${user.id}`
            );

            setSuccessMessage(
                response.data?.message ||
                    "User deleted successfully."
            );

            await fetchUsers();

            setTimeout(() => {
                setSuccessMessage("");
            }, 2000);
        } catch (error) {
            console.error(
                "Delete user error:",
                error
            );

            setFormError(
                error.response?.data?.message ||
                    "Failed to delete user."
            );

            setTimeout(() => {
                setFormError("");
            }, 2500);
        } finally {
            setDeletingId(null);
        }
    };

    // ======================================================
    // UI
    // ======================================================

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <p className="admin-eyebrow">
                        ADMIN MANAGEMENT
                    </p>

                    <h1 className="admin-page-title">
                        Users
                    </h1>

                    <p className="admin-page-subtitle">
                        Manage platform users and their roles.
                    </p>
                </div>

                <div className="admin-header-actions">
                    <button
                        className="admin-secondary-btn"
                        onClick={fetchUsers}
                        type="button"
                    >
                        <RefreshCw size={17} />
                        Refresh
                    </button>

                    <button
                        className="admin-primary-btn"
                        onClick={openCreateModal}
                        type="button"
                    >
                        <Plus size={17} />
                        Add User
                    </button>
                </div>
            </div>

            {/* ==================================================
                FILTERS
            ================================================== */}

            <div className="admin-filter-card">
                <div className="admin-search-box">
                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />
                </div>

                <select
                    className="admin-filter-select"
                    value={role}
                    onChange={(event) =>
                        setRole(event.target.value)
                    }
                >
                    <option value="">
                        All Roles
                    </option>

                    <option value="ADMIN">
                        Admin
                    </option>

                    <option value="USER">
                        User
                    </option>

                    <option value="STORE_OWNER">
                        Store Owner
                    </option>
                </select>
            </div>

            {/* ==================================================
                USERS TABLE
            ================================================== */}

            <div className="admin-table-card">
                <div className="admin-table-header">
                    <div>
                        <h2>
                            All Users
                        </h2>

                        <span>
                            {users.length} users found
                        </span>
                    </div>
                </div>

                {successMessage &&
                    !showModal &&
                    !showEditModal && (
                        <div className="admin-form-success">
                            {successMessage}
                        </div>
                    )}

                {formError &&
                    !showModal &&
                    !showEditModal && (
                        <div className="admin-form-error">
                            {formError}
                        </div>
                    )}

                {loading ? (
                    <div className="admin-empty-state">
                        Loading users...
                    </div>
                ) : users.length === 0 ? (
                    <div className="admin-empty-state">
                        No users found.
                    </div>
                ) : (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Address</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="admin-user-cell">
                                                <div className="admin-avatar">
                                                    {user.name
                                                        ?.charAt(0)
                                                        ?.toUpperCase()}
                                                </div>

                                                <div>
                                                    <strong>
                                                        {user.name}
                                                    </strong>

                                                    <small>
                                                        ID #{user.id}
                                                    </small>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            {user.email}
                                        </td>

                                        <td>
                                            {user.address || "—"}
                                        </td>

                                        <td>
                                            <span
                                                className={`admin-role-badge ${user.role
                                                    ?.toLowerCase()
                                                    .replace(
                                                        "_",
                                                        "-"
                                                    )}`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="admin-user-actions">
                                                <button
                                                    className="admin-icon-btn"
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin-users/${user.id}`
                                                        )
                                                    }
                                                    title="View user"
                                                >
                                                    <Eye size={17} />
                                                </button>

                                                <button
                                                    className="admin-icon-btn"
                                                    type="button"
                                                    onClick={() =>
                                                        openEditModal(
                                                            user
                                                        )
                                                    }
                                                    title="Edit user"
                                                >
                                                    <Edit3 size={17} />
                                                </button>

                                                <button
                                                    className="admin-icon-btn admin-delete-icon-btn"
                                                    type="button"
                                                    onClick={() =>
                                                        handleDeleteUser(
                                                            user
                                                        )
                                                    }
                                                    disabled={
                                                        deletingId ===
                                                        user.id
                                                    }
                                                    title="Delete user"
                                                >
                                                    <Trash2
                                                        size={17}
                                                    />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ==================================================
                CREATE USER MODAL
            ================================================== */}

            {showModal && (
                <div
                    className="admin-modal-overlay"
                    onMouseDown={closeCreateModal}
                >
                    <div
                        className="admin-modal"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="admin-modal-header">
                            <div>
                                <p className="admin-eyebrow">
                                    ADMIN MANAGEMENT
                                </p>

                                <h2>
                                    Add New User
                                </h2>

                                <p>
                                    Create a new platform account.
                                </p>
                            </div>

                            <button
                                className="admin-modal-close"
                                type="button"
                                onClick={closeCreateModal}
                                disabled={creating}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form
                            className="admin-user-form"
                            onSubmit={handleCreateUser}
                        >
                            <div className="admin-form-group">
                                <label>
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter email address"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>
                                    Address
                                </label>

                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter address"
                                    rows="3"
                                />
                            </div>

                            <div className="admin-form-row">
                                <div className="admin-form-group">
                                    <label>
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Minimum 6 characters"
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label>
                                        Role
                                    </label>

                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                    >
                                        <option value="USER">
                                            User
                                        </option>

                                        <option value="STORE_OWNER">
                                            Store Owner
                                        </option>

                                        <option value="ADMIN">
                                            Admin
                                        </option>
                                    </select>
                                </div>
                            </div>

                            {formError && (
                                <div className="admin-form-error">
                                    {formError}
                                </div>
                            )}

                            {successMessage && (
                                <div className="admin-form-success">
                                    {successMessage}
                                </div>
                            )}

                            <div className="admin-modal-actions">
                                <button
                                    type="button"
                                    className="admin-secondary-btn"
                                    onClick={closeCreateModal}
                                    disabled={creating}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="admin-primary-btn"
                                    disabled={creating}
                                >
                                    {creating
                                        ? "Creating..."
                                        : "Create User"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ==================================================
                EDIT USER MODAL
            ================================================== */}

            {showEditModal && (
                <div
                    className="admin-modal-overlay"
                    onMouseDown={closeEditModal}
                >
                    <div
                        className="admin-modal"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="admin-modal-header">
                            <div>
                                <p className="admin-eyebrow">
                                    ADMIN MANAGEMENT
                                </p>

                                <h2>
                                    Edit User
                                </h2>

                                <p>
                                    Update user account details.
                                </p>
                            </div>

                            <button
                                className="admin-modal-close"
                                type="button"
                                onClick={closeEditModal}
                                disabled={editing}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form
                            className="admin-user-form"
                            onSubmit={handleUpdateUser}
                        >
                            <div className="admin-form-group">
                                <label>
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter email address"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>
                                    Address
                                </label>

                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter address"
                                    rows="3"
                                />
                            </div>

                            <div className="admin-form-row">
                                <div className="admin-form-group">
                                    <label>
                                        New Password
                                    </label>

                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Leave blank to keep current"
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label>
                                        Role
                                    </label>

                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                    >
                                        <option value="USER">
                                            User
                                        </option>

                                        <option value="STORE_OWNER">
                                            Store Owner
                                        </option>

                                        <option value="ADMIN">
                                            Admin
                                        </option>
                                    </select>
                                </div>
                            </div>

                            {formError && (
                                <div className="admin-form-error">
                                    {formError}
                                </div>
                            )}

                            {successMessage && (
                                <div className="admin-form-success">
                                    {successMessage}
                                </div>
                            )}

                            <div className="admin-modal-actions">
                                <button
                                    type="button"
                                    className="admin-secondary-btn"
                                    onClick={closeEditModal}
                                    disabled={editing}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="admin-primary-btn"
                                    disabled={editing}
                                >
                                    {editing
                                        ? "Updating..."
                                        : "Update User"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminUsers;