import { useEffect, useState } from "react";
import {
    ArrowDownAZ,
    ArrowUpAZ,
    MapPin,
    Search,
    Star,
    Store,
    X
} from "lucide-react";

import api from "../../services/api";
import "./UserStores.css";

function UserStores() {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [nameSearch, setNameSearch] = useState("");
    const [addressSearch, setAddressSearch] = useState("");

    const [sortBy, setSortBy] = useState("name");
    const [order, setOrder] = useState("asc");

    const [ratingLoading, setRatingLoading] = useState(null);
    const [message, setMessage] = useState("");

    const fetchStores = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/user/stores", {
                params: {
                    name: nameSearch || undefined,
                    address: addressSearch || undefined,
                    sortBy,
                    order
                }
            });

            setStores(response.data.stores || []);
        } catch (error) {
            console.error("Fetch stores error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to load stores."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStores();
    }, [sortBy, order]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchStores();
    };

    const clearFilters = () => {
        setNameSearch("");
        setAddressSearch("");
        setSortBy("name");
        setOrder("asc");

        setTimeout(() => {
            fetchStores();
        }, 0);
    };

    const handleRating = async (storeId, rating) => {
        try {
            setRatingLoading(`${storeId}-${rating}`);
            setMessage("");
            setError("");

            const store = stores.find(
                (item) => item.id === storeId
            );

            if (!store) return;

            if (store.userRating) {
                await api.put(
                    `/ratings/${storeId}`,
                    { rating }
                );
            } else {
                await api.post(
                    "/ratings",
                    {
                        store_id: storeId,
                        rating
                    }
                );
            }

            setMessage(
                store.userRating
                    ? "Your rating has been updated."
                    : "Your rating has been submitted."
            );

            await fetchStores();
        } catch (error) {
            console.error("Rating error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to save your rating."
            );
        } finally {
            setRatingLoading(null);
        }
    };

    const renderStars = (rating) => {
        const numericRating = Number(rating) || 0;

        return (
            <div className="store-rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={16}
                        fill={
                            star <= Math.round(numericRating)
                                ? "currentColor"
                                : "none"
                        }
                    />
                ))}
            </div>
        );
    };

    return (
        <main className="stores-page">

            {/* Background */}
            <div className="stores-grid" />
            <div className="stores-glow stores-glow-one" />
            <div className="stores-glow stores-glow-two" />

            {/* Header */}
            <header className="stores-header">
                <div className="stores-brand">
                    <div className="stores-brand-icon">
                        <Star size={18} fill="currentColor" />
                    </div>

                    <div>
                        <strong>RateSpace</strong>
                        <span>Store discovery</span>
                    </div>
                </div>

                <div className="stores-header-user">
                    <div className="stores-user-avatar">
                        U
                    </div>

                    <span>Normal User</span>
                </div>
            </header>

            {/* Main content */}
            <section className="stores-container">

                {/* Hero */}
                <div className="stores-hero">

                    <div>
                        <div className="stores-badge">
                            <Store size={14} />
                            <span>Discover & rate</span>
                        </div>

                        <h1>
                            Find stores.
                            <span>Share your experience.</span>
                        </h1>

                        <p>
                            Explore stores, check community ratings,
                            and share your own experience with the
                            RateSpace community.
                        </p>
                    </div>

                    <div className="stores-hero-stat">
                        <Star
                            size={18}
                            fill="currentColor"
                        />

                        <div>
                            <strong>{stores.length}</strong>
                            <span>Stores available</span>
                        </div>
                    </div>

                </div>

                {/* Search / filters */}
                <form
                    className="stores-filter-card"
                    onSubmit={handleSearch}
                >

                    <div className="stores-search-group">

                        <div className="stores-search-field">
                            <Search size={18} />

                            <input
                                type="text"
                                value={nameSearch}
                                onChange={(e) =>
                                    setNameSearch(e.target.value)
                                }
                                placeholder="Search by store name..."
                            />
                        </div>

                        <div className="stores-search-field">
                            <MapPin size={18} />

                            <input
                                type="text"
                                value={addressSearch}
                                onChange={(e) =>
                                    setAddressSearch(e.target.value)
                                }
                                placeholder="Search by address..."
                            />
                        </div>

                    </div>

                    <div className="stores-filter-actions">

                        <select
                            value={sortBy}
                            onChange={(e) =>
                                setSortBy(e.target.value)
                            }
                        >
                            <option value="name">
                                Sort by name
                            </option>

                            <option value="overallRating">
                                Sort by rating
                            </option>

                            <option value="address">
                                Sort by address
                            </option>
                        </select>

                        <button
                            type="button"
                            className="sort-order-button"
                            onClick={() =>
                                setOrder(
                                    order === "asc"
                                        ? "desc"
                                        : "asc"
                                )
                            }
                            title={
                                order === "asc"
                                    ? "Ascending"
                                    : "Descending"
                            }
                        >
                            {order === "asc" ? (
                                <ArrowDownAZ size={17} />
                            ) : (
                                <ArrowUpAZ size={17} />
                            )}
                        </button>

                        <button
                            type="submit"
                            className="search-button"
                        >
                            <Search size={17} />
                            Search
                        </button>

                        <button
                            type="button"
                            className="clear-button"
                            onClick={clearFilters}
                        >
                            <X size={16} />
                            Clear
                        </button>

                    </div>

                </form>

                {/* Messages */}
                {message && (
                    <div className="stores-success-message">
                        <Star
                            size={16}
                            fill="currentColor"
                        />
                        {message}
                    </div>
                )}

                {error && (
                    <div className="stores-error-message">
                        {error}
                    </div>
                )}

                {/* Store list */}
                <div className="stores-section-header">
                    <div>
                        <span>STORE DIRECTORY</span>
                        <h2>Available stores</h2>
                    </div>

                    <p>
                        {stores.length} result
                        {stores.length !== 1 ? "s" : ""}
                    </p>
                </div>

                {loading ? (
                    <div className="stores-loading">
                        <div className="stores-spinner" />
                        <p>Loading stores...</p>
                    </div>
                ) : stores.length === 0 ? (
                    <div className="stores-empty">
                        <div className="stores-empty-icon">
                            <Store size={25} />
                        </div>

                        <h3>No stores found</h3>

                        <p>
                            Try changing your search or clearing
                            the filters.
                        </p>

                        <button
                            type="button"
                            onClick={clearFilters}
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="stores-list">

                        {stores.map((store) => (
                            <article
                                className="store-card"
                                key={store.id}
                            >

                                <div className="store-card-main">

                                    <div className="store-icon">
                                        <Store size={22} />
                                    </div>

                                    <div className="store-info">

                                        <div className="store-title-row">
                                            <h3>
                                                {store.name}
                                            </h3>

                                            {store.userRating && (
                                                <span className="rated-badge">
                                                    Rated
                                                </span>
                                            )}
                                        </div>

                                        <div className="store-address">
                                            <MapPin size={14} />
                                            <span>
                                                {store.address}
                                            </span>
                                        </div>

                                    </div>

                                    <div className="store-overall-rating">

                                        <div className="overall-rating-number">
                                            <strong>
                                                {Number(
                                                    store.overallRating
                                                ).toFixed(1)}
                                            </strong>

                                            <Star
                                                size={18}
                                                fill="currentColor"
                                            />
                                        </div>

                                        <span>
                                            Community rating
                                        </span>

                                    </div>

                                </div>

                                <div className="store-card-divider" />

                                <div className="store-card-bottom">

                                    <div className="community-rating">
                                        <span>
                                            Overall experience
                                        </span>

                                        {renderStars(
                                            store.overallRating
                                        )}
                                    </div>

                                    <div className="your-rating">

                                        <div>
                                            <span>
                                                {store.userRating
                                                    ? "Your rating"
                                                    : "Rate this store"}
                                            </span>

                                            <small>
                                                {store.userRating
                                                    ? `${store.userRating}/5`
                                                    : "1–5 stars"}
                                            </small>
                                        </div>

                                        <div className="rating-selector">
                                            {[1, 2, 3, 4, 5].map(
                                                (star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        disabled={
                                                            ratingLoading !==
                                                                null
                                                        }
                                                        className={
                                                            Number(
                                                                store.userRating
                                                            ) >= star
                                                                ? "selected"
                                                                : ""
                                                        }
                                                        onClick={() =>
                                                            handleRating(
                                                                store.id,
                                                                star
                                                            )
                                                        }
                                                        aria-label={`Rate ${star} out of 5`}
                                                    >
                                                        <Star
                                                            size={18}
                                                            fill={
                                                                Number(
                                                                    store.userRating
                                                                ) >= star
                                                                    ? "currentColor"
                                                                    : "none"
                                                            }
                                                        />
                                                    </button>
                                                )
                                            )}
                                        </div>

                                    </div>

                                </div>

                            </article>
                        ))}

                    </div>
                )}

            </section>

        </main>
    );
}

export default UserStores;