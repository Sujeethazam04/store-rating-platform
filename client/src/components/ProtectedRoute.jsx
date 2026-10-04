import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute({ allowedRoles }) {
    const location = useLocation();

    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    let user;

    try {
        user = JSON.parse(storedUser);
    } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        return <Navigate to="/login" replace />;
    }

    if (
        allowedRoles &&
        !allowedRoles.includes(user.role)
    ) {
        if (user.role === "ADMIN") {
            return (
                <Navigate
                    to="/admin-dashboard"
                    replace
                />
            );
        }

        if (user.role === "STORE_OWNER") {
            return (
                <Navigate
                    to="/owner-dashboard"
                    replace
                />
            );
        }

        return (
            <Navigate
                to="/stores"
                replace
            />
        );
    }

    return <Outlet />;
}

export default ProtectedRoute;