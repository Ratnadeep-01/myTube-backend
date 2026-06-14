# Videotube Backend

Simple backend for a Videotube-like application (user registration, auth, profile, uploads).

**Quick Start**

- **Install dependencies:**

```bash
npm install
```

- **Create a `.env` file** with required environment variables (see below).

- **Run in development:**

```bash
npm run dev
```

The server entrypoint is [src/index.js](src/index.js#L1) which loads the Express app in [src/app.js](src/app.js#L1).

**Environment Variables**

- **`PORT`**: optional, default 8000
- **`MONGODB_URI`**: MongoDB connection URI (without the DB name)
- **`DB_NAME`**: optional DB name (defaults to `videotube`)
- **`ACCESS_TOKEN_SECRET`**, **`REFRESH_TOKEN_SECRET`**: JWT secrets
- **`ACCESS_TOKEN_EXPIRY`**, **`REFRESH_TOKEN_EXPIRY`**: token expiry values (e.g. `15m`, `7d`)
- **`CLOUDINARY_CLOUD_NAME`**, **`CLOUDINARY_API_KEY`**, **`CLOUDINARY_API_SECRET`**: Cloudinary credentials for image uploads
- **`CORS_ORIGIN`**: allowed origin for CORS

**Available Scripts**

- `npm run dev` — start development server with `nodemon` (entry: `src/index.js`)

**API (Users)**

Base path: `/api/v1/users`

- `POST /register` — register a new user (multipart form-data). Fields: `username`, `email`, `password`, `fullName` + files `avatar` (required) and `coverImage` (optional). See [src/routes/user.routes.js](src/routes/user.routes.js#L1).
- `POST /login` — login with `username` or `email` and `password`. Returns cookies: `accessToken`, `refreshToken`.
- `POST /logout` — protected; clears tokens (requires auth).
- `GET /refresh-token` — exchange refresh token for new access token.
- `POST /change-password` — protected; change current password.
- `GET /current-user` — protected; get current user profile.
- `PATCH /update-profile` — protected; update profile fields.
- `PATCH /update-avatar` — protected; multipart form, single file field `avatar`.
- `PATCH /update-cover-image` — protected; multipart form, single file field `coverImage`.
- `GET /c/:username` — protected; get user channel/profile by username.
- `GET /history` — protected; get watch history.

Key implementation files:

- [src/models/user.model.js](src/models/user.model.js#L1) — Mongoose `User` schema, password hashing, token helpers.
- [src/controllers/user.controllers.js](src/controllers/user.controllers.js#L1) — handlers for registration, login, tokens, profile.
- [src/utils/cloudinary.js](src/utils/cloudinary.js#L1) — Cloudinary upload helper (removes temp files after upload).
- [src/middlewares/multer.middleware.js](src/middlewares/multer.middleware.js#L1) — multer setup; temporary uploads saved under `public/temp`.
- [src/db/index.js](src/db/index.js#L1) — MongoDB connection helper.

**Notes & Tips**

- In development, cookies are set `secure: true` in code; for local HTTP testing you may need to set `secure: false` in cookie options inside [src/controllers/user.controllers.js](src/controllers/user.controllers.js#L1).
- Multer stores uploaded files under `public/temp` and `cloudinary` uploads remove the local file on success.
- The global error handler in [src/app.js](src/app.js#L1) returns errors as a JSON `ApiResponse`/`ApiError` shape.

**Testing the API**

Use Postman or curl to test endpoints. Example: login

```bash
curl -X POST http://localhost:8000/api/v1/users/login \
	-H "Content-Type: application/json" \
	-d '{"username":"alice","password":"secret"}'
```

**License & Author**

Author: Ratnadeep Kumar
