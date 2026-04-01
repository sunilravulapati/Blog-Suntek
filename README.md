# BlogApp

A full-stack blogging platform built with the MERN stack. Users can read articles and leave comments, authors can write and manage their own content, and admins can moderate users and articles across the platform.

---

## Tech Stack

**Frontend** — React 19, React Router v7, Zustand, Axios, React Hook Form, Tailwind CSS, React Hot Toast

**Backend** — Node.js, Express.js, MongoDB, Mongoose, JWT (via HTTP-only cookies), Multer (profile image uploads), Bcrypt

---

## Features

### All Users
- Browse all published articles
- View individual articles with full content and comments

### Users (`role: USER`)
- Register and log in
- Read articles and post comments
- Personalized feed dashboard

### Authors (`role: AUTHOR`)
- Write, edit, and delete articles
- Restore deleted articles
- View all their own articles with active/deleted status

### Admins (`role: ADMIN`)
- View all users and their status
- Block / unblock users
- Activate / deactivate articles
- Dedicated admin console (separate navbar, no global header)

---

## Component Architecture

```
Root Component
├── Header (hidden for ADMIN)
├── Footer
│
├── /                → Home
├── /register        → Register
├── /login           → Login
│                         │
│              ┌──────────┼──────────┐
│          role=user  role=author  role=admin
│              │          │          │
│        UserDashboard  AuthorDashboard  AdminDashboard
│              │          │               │         │
│           Articles   WriteArticle    UsersList  ArticlesList
│              │       AuthorArticles
│              └────────────┘
│                     │
│               ArticleByID ──navigate──▶ EditArticle
```

---

## Project Structure

```
blogapp/
├── client/                        # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── AuthorDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AddArticle.jsx
│   │   │   ├── ArticleById.jsx
│   │   │   └── EditArticle.jsx
│   │   ├── store/
│   │   │   └── authStore.js       # Zustand global state
│   │   ├── styles/
│   │   │   └── common.js          # Shared Tailwind class tokens
│   │   └── main.jsx
│
└── server/                        # Express backend
    ├── APIs/
    │   ├── commonApi.js           # /common-api  (login, logout, check-auth)
    │   ├── userApi.js             # /user-api     (register, articles, comments)
    │   ├── authorApi.js           # /author-api   (register, CRUD articles)
    │   └── adminApi.js            # /admin-api    (block/unblock, activate/deactivate)
    ├── middleware/
    │   ├── verifyToken.js
    │   └── adminCheck.js
    ├── models/
    │   ├── UserModel.js
    │   └── ArticleModel.js
    ├── services/
    │   └── authService.js
    └── index.js
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/blogapp.git
cd blogapp
```

### 2. Set up the server

```bash
cd server
npm install
```

Create a `.env` file in `/server`:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/blogapp
JWT_SECRET=your_jwt_secret_here
```

Start the server:

```bash
npm start
```

### 3. Set up the client

```bash
cd ../client
npm install
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## API Overview

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/common-api/login` | Login (user / author) | ✗ |
| `GET` | `/common-api/logout` | Logout | ✓ |
| `GET` | `/common-api/check-auth` | Verify session | ✓ |
| `POST` | `/user-api/users` | Register as user | ✗ |
| `GET` | `/user-api/users` | Get all articles (user feed) | ✓ |
| `PUT` | `/user-api/users` | Add a comment | ✓ |
| `POST` | `/author-api/users` | Register as author | ✗ |
| `GET` | `/author-api/article` | Get author's articles | ✓ |
| `POST` | `/author-api/articles` | Create article | ✓ |
| `PUT` | `/author-api/articles/:id` | Edit article | ✓ |
| `PATCH` | `/author-api/articles/:id/status` | Toggle active/deleted | ✓ |
| `POST` | `/admin-api/authenticate` | Admin login | ✗ |
| `GET` | `/admin-api/articles/:adminId` | Get all articles | ✓ Admin |
| `GET` | `/admin-api/users/:adminId` | Get all users | ✓ Admin |
| `PUT` | `/admin-api/block/:uid/adminId/:adminId` | Block user | ✓ Admin |
| `PUT` | `/admin-api/unblock/:uid/adminId/:adminId` | Unblock user | ✓ Admin |

---

## Authentication

Auth is handled via **JWT stored in HTTP-only cookies** — no tokens are exposed to JavaScript. On each protected request the `verifyToken` middleware validates the cookie. The `adminCheck` middleware additionally enforces that the caller has `role: ADMIN`.

Role-based routing on the frontend is handled in the Zustand `authStore` — the login action automatically selects the correct API endpoint based on the role passed from the Login form.

---

## Data Models

### User
```js
{
  firstName: String,
  lastName:  String,
  email:     String (unique),
  password:  String (hashed),
  profileImageURL: String,
  role:      "USER" | "AUTHOR" | "ADMIN",
  isActive:  Boolean (default: true)
}
```

### Article
```js
{
  author:          ObjectId → User,
  title:           String,
  category:        String,
  content:         String,
  comments: [{
    user:    ObjectId → User,
    comment: String
  }],
  isArticleActive: Boolean (default: true)
}
```
---
###Video Demo: https://drive.google.com/file/d/1jf2EGYk4T1wFeGuU3p0Zwv3TSXMVkFLS/view?usp=sharing
###Live Link: https://blog-suntek.vercel.app/
