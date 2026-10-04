import { useEffect, useMemo, useState } from "react";

import {
    ArrowLeft,
    Edit3,
    MapPin,
    Plus,
    RefreshCw,
    Search,
    ShieldCheck,
    Store,
    Trash2,
    X
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import api from "../../services/api";

import "./AdminStores.css";

// ======================================================
// ADMIN STORES
// ======================================================

const AdminStores = () => {
    const navigate = useNavigate();

    // ==================================================
    // STATES
    // ==================================================

    const [stores, setStores] = useState([]);

    const [owners, setOwners] = useState([]);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [saving, setSaving] = useState(false);

    const [deleting, setDeleting] = useState(false);

    const [error, setError] = useState("");

    const [successMessage, setSuccessMessage] = useState("");

    const [search, setSearch] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [isEditMode, setIsEditMode] = useState(false);

    const [editingStoreId, setEditingStoreId] = useState(null);

    const [formError, setFormError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        owner_id: ""
    });


    // ==================================================
    // FETCH STORES
    // ==================================================

    const fetchStores = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const response = await api.get(
                "/admin/stores"
            );

            setStores(
                response.data?.stores || []
            );

        } catch (err) {
            console.error(
                "Fetch stores error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load stores"
            );

        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };


    // ==================================================
    // FETCH STORE OWNERS
    // ==================================================

    const fetchOwners = async () => {
        try {
            const response = await api.get(
                "/admin/users",
                {
                    params: {
                        role: "STORE_OWNER"
                    }
                }
            );

            setOwners(
                response.data?.users || []
            );

        } catch (err) {
            console.error(
                "Fetch store owners error:",
                err
            );

            setOwners([]);
        }
    };


    // ==================================================
    // INITIAL LOAD
    // ==================================================

    useEffect(() => {
        fetchStores();
        fetchOwners();
    }, []);


    // ==================================================
    // FILTER STORES
    // ==================================================

    const filteredStores = useMemo(() => {
        const query = search
            .trim()
            .toLowerCase();

        if (!query) {
            return stores;
        }

        return stores.filter((store) => {
            return (
                store.name
                    ?.toLowerCase()
                    .includes(query) ||

                store.email
                    ?.toLowerCase()
                    .includes(query) ||

                store.address
                    ?.toLowerCase()
                    .includes(query) ||

                store.owner_name
                    ?.toLowerCase()
                    .includes(query)
            );
        });

    }, [stores, search]);


    // ==================================================
    // CLEAR SEARCH
    // ==================================================

    const clearSearch = () => {
        setSearch("");
    };


    // ==================================================
    // GET RATING
    // ==================================================

    const getRating = (store) => {
        return Number(
            store.overallRating ??
            store.rating ??
            0
        );
    };


    // ==================================================
    // GET OWNER NAME
    // ==================================================

    const getOwnerName = (store) => {
        return (
            store.owner_name ||
            store.ownerName ||
            owners.find(
                (owner) =>
                    Number(owner.id) ===
                    Number(store.owner_id)
            )?.name ||
            "Not assigned"
        );
    };


    // ==================================================
    // RESET FORM
    // ==================================================

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            address: "",
            owner_id: ""
        });

        setFormError("");
        setEditingStoreId(null);
        setIsEditMode(false);
    };


    // ==================================================
    // OPEN CREATE MODAL
    // ==================================================

    const openCreateModal = () => {
        resetForm();

        setSuccessMessage("");

        setShowModal(true);
    };


    // ==================================================
    // OPEN EDIT MODAL
    // ==================================================

    const openEditModal = (store) => {
        setFormData({
            name: store.name || "",
            email: store.email || "",
            address: store.address || "",
            owner_id: store.owner_id
                ? String(store.owner_id)
                : ""
        });

        setEditingStoreId(store.id);

        setIsEditMode(true);

        setFormError("");

        setSuccessMessage("");

        setShowModal(true);
    };


    // ==================================================
    // CLOSE MODAL
    // ==================================================

    const closeModal = () => {
        if (saving) {
            return;
        }

        setShowModal(false);

        resetForm();
    };


    // ==================================================
    // HANDLE FORM CHANGE
    // ==================================================

    const handleFormChange = (event) => {
        const {
            name,
            value
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setFormError("");
    };


    // ==================================================
    // VALIDATE FORM
    // ==================================================

    const validateForm = () => {
        if (!formData.name.trim()) {
            setFormError(
                "Store name is required."
            );

            return false;
        }

        if (!formData.email.trim()) {
            setFormError(
                "Store email is required."
            );

            return false;
        }

        if (!formData.address.trim()) {
            setFormError(
                "Store address is required."
            );

            return false;
        }

        if (!formData.owner_id) {
            setFormError(
                "Please select a store owner."
            );

            return false;
        }

        return true;
    };


    // ==================================================
    // CREATE / UPDATE STORE
    // ==================================================

    const handleSubmitStore = async (event) => {
        event.preventDefault();

        setFormError("");

        setSuccessMessage("");

        if (!validateForm()) {
            return;
        }

        try {
            setSaving(true);

            const payload = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                address: formData.address.trim(),
                owner_id: Number(
                    formData.owner_id
                )
            };


            // ==========================================
            // UPDATE
            // ==========================================

            if (isEditMode) {
                const response = await api.put(
                    `/admin/stores/${editingStoreId}`,
                    payload
                );

                if (response.data?.success) {
                    setSuccessMessage(
                        "Store updated successfully."
                    );

                    setShowModal(false);

                    resetForm();

                    await fetchStores(true);
                } else {
                    setFormError(
                        response.data?.message ||
                        "Unable to update store."
                    );
                }

                return;
            }


            // ==========================================
            // CREATE
            // ==========================================

            const response = await api.post(
                "/admin/stores",
                payload
            );

            if (response.data?.success) {
                setSuccessMessage(
                    "Store created successfully."
                );

                setShowModal(false);

                resetForm();

                await fetchStores(true);
            } else {
                setFormError(
                    response.data?.message ||
                    "Unable to create store."
                );
            }

        } catch (err) {
            console.error(
                "Save store error:",
                err
            );

            setFormError(
                err.response?.data?.message ||
                (
                    isEditMode
                        ? "Unable to update store."
                        : "Unable to create store."
                )
            );

        } finally {
            setSaving(false);
        }
    };


    // ==================================================
    // DELETE STORE
    // ==================================================

    const handleDeleteStore = async (store) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${store.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);

            setError("");

            setSuccessMessage("");

            const response = await api.delete(
                `/admin/stores/${store.id}`
            );

            if (response.data?.success) {
                setSuccessMessage(
                    "Store deleted successfully."
                );

                await fetchStores(true);
            } else {
                setError(
                    response.data?.message ||
                    "Unable to delete store."
                );
            }

        } catch (err) {
            console.error(
                "Delete store error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to delete store."
            );

        } finally {
            setDeleting(false);
        }
    };


    // ==================================================
    // LOADING SCREEN
    // ==================================================

    if (loading) {
        return (
            <div className="admin-stores-page">

                <div className="admin-stores-glow one" />

                <div className="admin-stores-glow two" />

                <div className="admin-stores-loading">

                    <div className="admin-stores-spinner" />

                    <p>
                        Loading stores...
                    </p>

                </div>

            </div>
        );
    }


    // ==================================================
    // UI
    // ==================================================

    return (
        <div className="admin-stores-page">

            {/* BACKGROUND */}

            <div className="admin-stores-grid" />

            <div className="admin-stores-glow one" />

            <div className="admin-stores-glow two" />


            {/* ==========================================
                HEADER
            ========================================== */}

            <header className="admin-stores-header">

                <div className="admin-stores-brand">

                    <button
                        type="button"
                        className="admin-stores-back"
                        onClick={() =>
                            navigate(
                                "/admin-dashboard"
                            )
                        }
                    >
                        <ArrowLeft size={18} />

                        <span>
                            Back
                        </span>
                    </button>


                    <div className="admin-stores-brand-icon">
                        <Store size={22} />
                    </div>


                    <div>
                        <h1>
                            RateSpace
                        </h1>

                        <p>
                            Admin Store Management
                        </p>
                    </div>

                </div>


                <div className="admin-stores-header-actions">

                    <button
                        type="button"
                        className="admin-stores-refresh"
                        onClick={() =>
                            fetchStores(true)
                        }
                        disabled={refreshing}
                    >
                        <RefreshCw
                            size={17}
                            className={
                                refreshing
                                    ? "admin-stores-refresh-spin"
                                    : ""
                            }
                        />

                        <span>
                            Refresh
                        </span>
                    </button>


                    <button
                        type="button"
                        className="admin-stores-add"
                        onClick={
                            openCreateModal
                        }
                    >
                        <Plus size={18} />

                        <span>
                            Add Store
                        </span>
                    </button>

                </div>

            </header>


            {/* ==========================================
                MAIN
            ========================================== */}

            <main className="admin-stores-container">


                {/* HERO */}

                <section className="admin-stores-hero">

                    <div>

                        <div className="admin-stores-badge">

                            <ShieldCheck size={15} />

                            <span>
                                Store Administration
                            </span>

                        </div>


                        <h2>
                            Manage Stores
                        </h2>


                        <p>
                            Create, update and manage
                            all registered stores
                            from one place.
                        </p>

                    </div>


                    <div className="admin-stores-count-card">

                        <Store size={20} />

                        <div>

                            <strong>
                                {stores.length}
                            </strong>

                            <span>
                                Total Stores
                            </span>

                        </div>

                    </div>

                </section>


                {/* SUCCESS */}

                {successMessage && (
                    <div className="admin-stores-success">
                        {successMessage}
                    </div>
                )}


                {/* ERROR */}

                {error && (
                    <div className="admin-stores-error">
                        {error}
                    </div>
                )}


                {/* SEARCH */}

                <section className="admin-stores-filter-card">

                    <div className="admin-stores-search">

                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search by store name, email, address..."
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                        />

                    </div>


                    {search && (
                        <button
                            type="button"
                            className="admin-stores-clear"
                            onClick={
                                clearSearch
                            }
                        >
                            <X size={16} />

                            Clear
                        </button>
                    )}

                </section>


                {/* STORE TABLE */}

                <section className="admin-stores-panel">

                    <div className="admin-stores-panel-header">

                        <div>
                            <h3>
                                Registered Stores
                            </h3>

                            <p>
                                {filteredStores.length}{" "}
                                store
                                {filteredStores.length !==
                                1
                                    ? "s"
                                    : ""}{" "}
                                found
                            </p>
                        </div>

                    </div>


                    {filteredStores.length === 0 ? (

                        <div className="admin-stores-empty">

                            <div className="admin-stores-empty-icon">
                                <Store size={26} />
                            </div>

                            <h3>
                                No stores found
                            </h3>

                            <p>
                                Try changing your
                                search or create a
                                new store.
                            </p>

                        </div>

                    ) : (

                        <div className="admin-stores-table-wrapper">

                            <table className="admin-stores-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Store
                                        </th>

                                        <th>
                                            Email
                                        </th>

                                        <th>
                                            Address
                                        </th>

                                        <th>
                                            Owner
                                        </th>

                                        <th>
                                            Rating
                                        </th>

                                        <th>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredStores.map(
                                        (store) => {

                                            const rating =
                                                getRating(
                                                    store
                                                );

                                            return (
                                                <tr
                                                    key={
                                                        store.id
                                                    }
                                                >

                                                    <td>

                                                        <div className="admin-store-cell">

                                                            <div className="admin-store-avatar">
                                                                <Store
                                                                    size={
                                                                        18
                                                                    }
                                                                />
                                                            </div>

                                                            <div>
                                                                <strong>
                                                                    {
                                                                        store.name
                                                                    }
                                                                </strong>

                                                                <span>
                                                                    Store #
                                                                    {
                                                                        store.id
                                                                    }
                                                                </span>
                                                            </div>

                                                        </div>

                                                    </td>


                                                    <td>
                                                        <span className="admin-store-email">
                                                            {
                                                                store.email
                                                            }
                                                        </span>
                                                    </td>


                                                    <td>

                                                        <div className="admin-store-address">

                                                            <MapPin
                                                                size={
                                                                    15
                                                                }
                                                            />

                                                            <span>
                                                                {
                                                                    store.address
                                                                }
                                                            </span>

                                                        </div>

                                                    </td>


                                                    <td>

                                                        <span
                                                            className={
                                                                getOwnerName(
                                                                    store
                                                                ) ===
                                                                "Not assigned"
                                                                    ? "admin-store-owner"
                                                                    : "admin-store-owner assigned"
                                                            }
                                                        >
                                                            {
                                                                getOwnerName(
                                                                    store
                                                                )
                                                            }
                                                        </span>

                                                    </td>


                                                    <td>

                                                        <div className="admin-store-rating">

                                                            <span>
                                                                ★
                                                            </span>

                                                            <strong>
                                                                {
                                                                    rating.toFixed(
                                                                        1
                                                                    )
                                                                }
                                                            </strong>

                                                        </div>

                                                    </td>


                                                    {/* ACTIONS */}

                                                    <td>

                                                        <div className="admin-store-actions">

                                                            <button
                                                                type="button"
                                                                className="admin-store-edit-btn"
                                                                onClick={() =>
                                                                    openEditModal(
                                                                        store
                                                                    )
                                                                }
                                                                disabled={
                                                                    deleting
                                                                }
                                                                title="Edit store"
                                                            >
                                                                <Edit3
                                                                    size={
                                                                        16
                                                                    }
                                                                />

                                                                <span>
                                                                    Edit
                                                                </span>

                                                            </button>


                                                            <button
                                                                type="button"
                                                                className="admin-store-delete-btn"
                                                                onClick={() =>
                                                                    handleDeleteStore(
                                                                        store
                                                                    )
                                                                }
                                                                disabled={
                                                                    deleting
                                                                }
                                                                title="Delete store"
                                                            >
                                                                <Trash2
                                                                    size={
                                                                        16
                                                                    }
                                                                />

                                                                <span>
                                                                    Delete
                                                                </span>

                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>
                                            );
                                        }
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>

            </main>


            {/* ==========================================
                CREATE / EDIT STORE MODAL
            ========================================== */}

            {showModal && (

                <div
                    className="admin-store-modal-overlay"
                    onMouseDown={closeModal}
                >

                    <div
                        className="admin-store-modal"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >

                        {/* MODAL HEADER */}

                        <div className="admin-store-modal-header">

                            <div>

                                <span className="admin-store-modal-eyebrow">
                                    {isEditMode
                                        ? "EDIT STORE"
                                        : "NEW STORE"}
                                </span>

                                <h2>
                                    {isEditMode
                                        ? "Edit Store"
                                        : "Add Store"}
                                </h2>

                                <p>
                                    {isEditMode
                                        ? "Update store information and owner."
                                        : "Create a new store and assign its owner."}
                                </p>

                            </div>


                            <button
                                type="button"
                                className="admin-store-modal-close"
                                onClick={
                                    closeModal
                                }
                                disabled={saving}
                            >
                                <X size={19} />
                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={
                                handleSubmitStore
                            }
                            className="admin-store-form"
                        >

                            {/* STORE NAME */}

                            <div className="admin-store-form-group">

                                <label htmlFor="store-name">
                                    Store Name
                                </label>

                                <input
                                    id="store-name"
                                    type="text"
                                    name="name"
                                    placeholder="Enter store name"
                                    value={
                                        formData.name
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    disabled={saving}
                                />

                            </div>


                            {/* EMAIL */}

                            <div className="admin-store-form-group">

                                <label htmlFor="store-email">
                                    Store Email
                                </label>

                                <input
                                    id="store-email"
                                    type="email"
                                    name="email"
                                    placeholder="store@example.com"
                                    value={
                                        formData.email
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    disabled={saving}
                                />

                            </div>


                            {/* ADDRESS */}

                            <div className="admin-store-form-group">

                                <label htmlFor="store-address">
                                    Store Address
                                </label>

                                <textarea
                                    id="store-address"
                                    name="address"
                                    rows="3"
                                    placeholder="Enter complete store address"
                                    value={
                                        formData.address
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    disabled={saving}
                                />

                            </div>


                            {/* OWNER */}

                            <div className="admin-store-form-group">

                                <label htmlFor="store-owner">
                                    Store Owner
                                </label>

                                <select
                                    id="store-owner"
                                    name="owner_id"
                                    value={
                                        formData.owner_id
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    disabled={saving}
                                >

                                    <option value="">
                                        Select store owner
                                    </option>

                                    {owners.map(
                                        (owner) => (
                                            <option
                                                key={
                                                    owner.id
                                                }
                                                value={
                                                    owner.id
                                                }
                                            >
                                                {
                                                    owner.name
                                                }{" "}
                                                —{" "}
                                                {
                                                    owner.email
                                                }
                                            </option>
                                        )
                                    )}

                                </select>


                                {owners.length === 0 && (
                                    <small className="admin-store-owner-warning">
                                        No STORE_OWNER
                                        users found.
                                        Create a store
                                        owner from
                                        Admin Users
                                        first.
                                    </small>
                                )}

                            </div>


                            {/* ERROR */}

                            {formError && (
                                <div className="admin-store-form-error">
                                    {formError}
                                </div>
                            )}


                            {/* ACTIONS */}

                            <div className="admin-store-modal-actions">

                                <button
                                    type="button"
                                    className="admin-store-cancel"
                                    onClick={
                                        closeModal
                                    }
                                    disabled={saving}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="admin-store-submit"
                                    disabled={saving}
                                >

                                    {saving ? (
                                        <>
                                            <RefreshCw
                                                size={16}
                                                className="admin-stores-refresh-spin"
                                            />

                                            {isEditMode
                                                ? "Updating..."
                                                : "Creating..."}
                                        </>
                                    ) : (
                                        <>
                                            {isEditMode ? (
                                                <>
                                                    <Edit3
                                                        size={
                                                            17
                                                        }
                                                    />

                                                    Update Store
                                                </>
                                            ) : (
                                                <>
                                                    <Plus
                                                        size={
                                                            17
                                                        }
                                                    />

                                                    Create Store
                                                </>
                                            )}
                                        </>
                                    )}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
};


export default AdminStores;