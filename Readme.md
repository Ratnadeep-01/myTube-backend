# myTube-backend

Backend API for a lightweight video-sharing platform (myTube). This project provides user authentication, media uploads, channels, playlists, likes, comments, subscriptions, and basic dashboard endpoints — all wired to MongoDB and Cloudinary for media storage.

**Project goal:** provide a modular, production-ready Express backend that powers a simple YouTube-like application and exposes RESTful endpoints for a frontend client.

**Quick links:** server entry: [src/index.js](src/index.js#L1), app setup: [src/app.js](src/app.js#L1)

## Key Features
- **User authentication:** registration, login, logout, refresh tokens, password change, profile updates.
- **Media uploads:** multipart uploads with `multer` and Cloudinary integration for avatars, cover images, and video thumbnails.
- **Video management:** create, update, fetch, and list videos with pagination and basic metadata.
- **Interactions:** likes, comments, playlists, and subscriptions.
- **Dashboard & analytics:** endpoints for user-specific dashboards and basic aggregates.
- **Validation & error handling:** request validation (Zod), centralized error responses (`ApiError`/`ApiResponse`).

## Tech Stack
- **Language:** JavaScript (ES Modules)
- **Runtime & framework:** Node.js, Express 5
- **Database:** MongoDB (Mongoose)
- **Authentication:** JSON Web Tokens (`jsonwebtoken`), cookies
- **File uploads & storage:** `multer` (local temp storage) + `cloudinary` for persistent media
- **Validation:** `zod`
- **Utilities & libs:** `bcrypt`, `cors`, `cookie-parser`, `dotenv`, `mongoose-aggregate-paginate-v2`
- **Dev tools:** `nodemon`, `prettier`

## Prerequisites
- Node.js 18+ installed
- npm (bundled with Node) or yarn
- A running MongoDB instance (Atlas or local)
- (Optional) Cloudinary account for image/video storage

## Installation & Setup
1. Clone the repository

```bash
git clone <your-repo-url>
cd myTube-backend
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the project root with the required variables (example below):

```env
# Server
PORT=8000

# MongoDB
MONGODB_URI=mongodb://localhost:27017
DB_NAME=videotube

# JWT
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
CORS_ORIGIN=http://localhost:3000
```

4. (Optional) Create `public/temp` directory for Multer temporary uploads if not already present.

## How to Run
- Development (auto-reload):

```bash
npm run dev
```

- Production (example):

```bash
node src/index.js
# or use a process manager like pm2
```

The API will start on the `PORT` from your `.env` (default `8000`).

## Project Structure
Top-level layout with important files and folders:

```
.
├─ package.json
├─ Readme.md
├─ src/
│  ├─ index.js                # server bootstrap (entrypoint)
│  ├─ app.js                  # express app + middleware
│  ├─ controllers/
│  │  ├─ user.controllers.js
│  │  ├─ video.controller.js
│  │  └─ ...
│  ├─ routes/
│  │  └─ (user, video, comment, like, playlist, subscription, dashboard routes)
│  ├─ models/                 # Mongoose models
│  ├─ middlewares/            # auth, multer, validation
│  └─ utils/                  # ApiResponse, ApiError, cloudinary helper
├─ public/
│  └─ temp/                   # multer temp storage
└─ db/
   └─ index.js                # mongodb connection helper
```

## Key Files
- App bootstrap: [src/index.js](src/index.js#L1)
- Express app & middleware: [src/app.js](src/app.js#L1)
- Database helper: [db/index.js](db/index.js#L1)
- User flows: [src/controllers/user.controllers.js](src/controllers/user.controllers.js#L1)
- Upload helper: [src/utils/cloudinary.js](src/utils/cloudinary.js#L1)

## Environment & Development Notes
- Multer writes temporary files to `public/temp`; Cloudinary helper deletes temp files after upload.
- For local testing with HTTP (not HTTPS), ensure cookie options `secure` are set appropriately in `user.controllers`.
- Validation uses `zod` schemas located near route handlers (see `validators/`).

## Contributing
- Fork the repo, create a feature branch, and submit a PR. Keep changes focused and add tests where applicable.

## Author
- Ratnadeep Kumar

---
If you'd like, I can also:
- add a sample `.env.example` file
- generate API endpoint documentation (OpenAPI/Swagger)
- add Postman collection examples

Let me know which you'd prefer next.
