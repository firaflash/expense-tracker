# Expense Tracker Backend

This folder contains the Express and MongoDB API used by the expense tracker frontend.

## Backend structure

```text
backend/
├── src/
│   ├── app.js                  Express app, CORS, middleware, and routes
│   ├── server.js               Loads environment variables, connects to MongoDB, and starts the server
│   ├── config/db.js            MongoDB connection
│   ├── controllers/            Request handlers, including authentication
│   ├── middleware/             Authentication and error-handling middleware
│   ├── models/                 Mongoose models, including User
│   └── routes/                 API route definitions
├── .env                       Local environment variables (do not commit secrets)
├── .env.example               Environment variable template
└── package.json                Dependencies and npm scripts
```

## Required environment variables

Create `backend/.env` if it does not already exist. The server code requires `MONGODB_URI` and `JWT_SECRET`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
```

The variable must be named `MONGODB_URI` because that is the name read by `src/config/db.js`.

## First-time installation

Open a terminal in the `backend` folder and run:

```bash
npm install
```

## Start the backend

1. Open Terminal 1 in the backend folder:

   ```bash
   cd "expense-tracker/backend"
   nodemon "src/server.js"
   ```

   `nodemon src/server.js` starts Nodemon and the API on port `5000`. The server must connect to MongoDB before it starts listening.
2. Check that the backend is running by opening:

   ```text
   http://localhost:5000/api/health
   ```

   A successful response contains `"status":"ok"`.

## Connect the frontend with ngrok

Keep the backend running in Terminal 1. Open a second terminal and run:

```bash
ngrok http 5000
```

Copy the HTTPS `Forwarding` URL from ngrok, for example:

```text
https://example-name.ngrok-free.dev
```

Open `frontend/utils/api.ts` and set `API_BASE_URL` to that URL with `/api` appended:

```ts
const API_BASE_URL = 'https://example-name.ngrok-free.dev/api';
```

Do not add a second `/api`. Do not use `localhost` when the frontend is running on a phone, because the phone treats `localhost` as the phone itself. The ngrok URL changes whenever ngrok restarts, so update `frontend/utils/api.ts` each time.

## Run the frontend

With the backend still running in Terminal 1 and ngrok running in Terminal 2, open a third terminal:

```bash
cd "expense-tracker/frontend"
npm install
npm start
```

Use the Expo output to open the app in an emulator or on a connected device.

## Useful API routes

```text
GET  /api/health
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

All public API URLs use the `/api` prefix.

## Troubleshooting

- If the server exits before listening, check `MONGODB_URI` and confirm that the MongoDB cluster is reachable.
- If the frontend cannot connect, confirm that the backend and ngrok terminals are still running and that the current ngrok URL is copied into `frontend/utils/api.ts`.
- If the URL works in a browser but requests fail in the app, verify that the URL ends with `/api` and uses `https://`.
