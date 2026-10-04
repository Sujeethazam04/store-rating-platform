import {
    BrowserRouter,
    Navigate,
    Route,
    Routes
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./components/ProtectedRoute";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminStores from "./pages/admin/AdminStores";
import AdminUserDetails from "./pages/admin/AdminUserDetails";

import UserDashboard from "./pages/user/UserDashboard/UserDashboard";
import UserStores from "./pages/user/UserStores";

import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerRatings from "./pages/owner/OwnerRatings";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* PUBLIC ROUTES */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* USER ROUTES */}

                <Route
                    element={
                        <ProtectedRoute
                            allowedRoles={["USER"]}
                        />
                    }
                >

                    <Route
                        path="/user-dashboard"
                        element={<UserDashboard />}
                    />

                    <Route
                        path="/stores"
                        element={<UserStores />}
                    />

                </Route>


                {/* STORE OWNER ROUTES */}

                <Route
                    element={
                        <ProtectedRoute
                            allowedRoles={["STORE_OWNER"]}
                        />
                    }
                >

                    <Route
                        path="/owner-dashboard"
                        element={<OwnerDashboard />}
                    />

                    <Route
                        path="/owner-ratings"
                        element={<OwnerRatings />}
                    />

                </Route>


                {/* ADMIN ROUTES */}

                <Route
                    element={
                        <ProtectedRoute
                            allowedRoles={["ADMIN"]}
                        />
                    }
                >

                    <Route
                        path="/admin-dashboard"
                        element={<AdminDashboard />}
                    />

                    <Route
                        path="/admin-users"
                        element={<AdminUsers />}
                    />

                    <Route
                        path="/admin-users/:id"
                        element={<AdminUserDetails />}
                    />

                    <Route
                        path="/admin-stores"
                        element={<AdminStores />}
                    />

                </Route>


                {/* FALLBACK */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;