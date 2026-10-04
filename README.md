# RateSpace - Store Rating Platform

A full-stack store rating platform built using React, Express.js, PostgreSQL, and JWT authentication.

The application supports three different roles:

- System Administrator
- Normal User
- Store Owner

Each role has its own dashboard and permissions.

---

## 🚀 Tech Stack

### Frontend

- React
- React Router
- Axios
- Lucide React
- CSS
- Vite

### Backend

- Node.js
- Express.js
- JWT Authentication
- bcrypt
- Express Validator
- CORS

### Database

- PostgreSQL

---

## 👥 User Roles

### 1. System Administrator

The administrator can:

- View dashboard statistics
- Manage users
- Create users
- Edit users
- Delete users
- View user details
- Manage stores
- Create stores
- Edit stores
- Delete stores
- Assign store owners
- Search and filter users
- Search stores

---

### 2. Normal User

Normal users can:

- Register and login
- View available stores
- Search stores
- Sort stores
- View store ratings
- Submit a rating from 1 to 5
- Update their existing rating
- View their dashboard
- Logout securely

---

### 3. Store Owner

Store owners can:

- Login to their dashboard
- View their own store
- View overall store rating
- View total ratings
- View rating distribution
- View customer ratings
- Search customer ratings
- Filter ratings
- View recent ratings
- Refresh rating data
- Logout securely

---

# 🔐 Demo Login Credentials

The following demo accounts can be used to test the different roles of the application.

### 👤 Normal User

```text
Email:    sujeettest@gmail.com
Password: NewPass#456
Role:     USER

### 👤 Store Owner
Email:    storeowner@test.com
Password: StoreOwner@123
Role:     STORE_OWNER

### 👤 Admin
Email:    admin@storerating.com
Password: AdminPass#123
Role:     ADMIN


📁 Project Structure

store-rating-platform/
│
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard/
│   │   │   │   ├── AdminStores/
│   │   │   │   ├── AdminUsers/
│   │   │   │   └── AdminUserDetails/
│   │   │   │
│   │   │   ├── owner/
│   │   │   │   ├── OwnerDashboard/
│   │   │   │   └── OwnerRatings/
│   │   │   │
│   │   │   ├── user/
│   │   │   │   ├── UserDashboard/
│   │   │   │   └── UserStores/
│   │   │   │
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   ├── services/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── validators/
│   ├── index.js
│   └── package.json
│
├── .gitignore
└── README.md