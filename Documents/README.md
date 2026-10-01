# Expense Tracker (MoniVo)

> A mobile expense and income tracker for recording transactions, organizing spending, managing wallets and budgets, and understanding financial habits.

**Stack:** ![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB?logo=react) ![Expo](https://img.shields.io/badge/Expo-57-000020?logo=expo) ![Node.js](https://img.shields.io/badge/Node.js-ESM-339933?logo=node.js) ![Express](https://img.shields.io/badge/Express-5-000000?logo=express) ![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?logo=mongodb) ![TypeScript](https://img.shields.io/badge/TypeScript-frontend-3178C6?logo=typescript)

> [ASSUMPTION] The assignment describes a MERN web application. The checked-in implementation is a React Native/Expo mobile client with the same Node.js, Express, MongoDB and Mongoose backend. This README uses “MERN-style” for the shared JavaScript stack and does not claim that the client is browser-only React.

## Screenshots

Place presentation screenshots in `screenshots/`:

```text
screenshots/
├── login.png
├── home-dashboard.png
├── add-transaction.png
└── analytics.png
```

## Features

- Registration, login, logout and persistent JWT authentication.
- Add, view, edit and delete income or expense transactions.
- Categories with names, icons, colors and expense/income types.
- Wallets for cash, bank or other accounts, including currency and default-wallet state.
- Budgets per category.
- Dashboard with balance, income, expense, recent-transaction and chart summaries.
- Analytics screen with spending charts and category summaries.
- Transaction date, type, status, category and wallet data.
- Light/dark theme switching and native mobile navigation.
- Secure token storage through Expo SecureStore.

## Technology stack

| Layer | Technology | Why we chose it |
|---|---|---|
| Mobile UI | React Native + Expo | Reusable JavaScript/TypeScript UI for Android, iOS and web preview. |
| Frontend language | TypeScript, TSX | Types catch incorrect data shapes while TSX keeps UI and logic together. |
| Navigation | React Navigation | Standard stack and bottom-tab navigation for mobile. |
| Client state | Zustand | Small global store for auth, transactions, wallets, budgets and theme. |
| HTTP client | Axios | One configured client and a JWT request interceptor. |
| Backend runtime | Node.js | JavaScript server runtime with asynchronous I/O. |
| API framework | Express 5 | Clear routing and middleware model for a REST API. |
| Database | MongoDB | Document storage fits evolving finance records. |
| ODM | Mongoose | Schemas, validation, relationships and MongoDB queries. |
| Authentication | JWT + bcryptjs | Stateless signed tokens and one-way password hashing. |
| Styling | React Native StyleSheet + NativeWind | Platform-native styles plus utility classes where used. |

## Repository structure

```text
expense-tracker/
├── backend/
│   ├── src/
│   │   ├── app.js                 # Express app, middleware and route mounting
│   │   ├── server.js              # Database connection and HTTP startup
│   │   ├── config/db.js           # Mongoose connection
│   │   ├── controllers/           # Auth and CRUD request handlers
│   │   ├── middleware/            # JWT protection and error handlers
│   │   ├── models/                # User, Transaction, Wallet, Category, Budget
│   │   └── routes/                # REST endpoint definitions
│   ├── .env.example               # Backend environment variable names
│   └── package.json
├── frontend/
│   ├── app/                       # Auth and application screens
│   ├── components/                # Reusable UI, charts, buttons and modals
│   ├── constants/                 # Theme and default data
│   ├── store/useMoniVoStore.ts    # Zustand state and actions
│   ├── types/                     # TypeScript data types
│   ├── utils/api.ts               # Axios instance and JWT interceptor
│   ├── global.css                 # NativeWind entry point
│   └── package.json
├── screenshots/                   # [ASSUMPTION] presentation images
└── *.md                           # Project and presentation documentation
```

## Installation and run

### Prerequisites

- Node.js 18+ and npm.
- A MongoDB database, local or Atlas.
- Expo Go or an Android/iOS emulator.

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The API listens on `http://localhost:5000` by default. The current connector reads `MONGODB_URI`; set that variable in `.env`. [ASSUMPTION] Rename `MONGO_URI` in the example file to `MONGODB_URI`, because the source currently reads the latter.

```dotenv
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/expense_tracker
JWT_SECRET=<long-random-secret>
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Frontend

```bash
cd frontend
npm install
npm start
```

Set the Expo public API URL in `frontend/.env`. A phone normally cannot reach the computer through `localhost`, so use a LAN address or ngrok URL:

```dotenv
EXPO_PUBLIC_API_URL=http://<computer-ip>:5000/api
```

For a tunnel, run `ngrok http 5000` and set the forwarding URL ending in `/api`.

## API endpoints

Protected routes require `Authorization: Bearer <JWT>`.

| Method | Route | Description | Auth |
|---|---|---|---|
| GET | `/api/health` | Health check | No |
| POST | `/api/auth/register` | Create user and return token | No |
| POST | `/api/auth/login` | Validate credentials and return token | No |
| GET | `/api/auth/me` | Return authenticated user | Yes |
| GET/POST | `/api/transaction` | List or create transactions | Yes |
| GET/PUT/DELETE | `/api/transaction/:id` | Read, update or delete one transaction | Yes |
| GET/POST | `/api/wallet` | List or create wallets | Yes |
| GET/PUT/DELETE | `/api/wallet/:id` | Read, update or delete one wallet | Yes |
| GET/POST | `/api/categories` | List or create categories | Yes |
| GET/PUT/DELETE | `/api/categories/:id` | Read, update or delete one category | Yes |

## Data models

| Model | Fields |
|---|---|
| User | `_id: ObjectId`, `name: String`, `email: String` unique, `password: String` hashed, timestamps |
| Transaction | `_id: ObjectId`, `user/wallet/category: ObjectId`, `amount: Number`, `type: DEBIT/CREDIT`, `note: String`, `date: Date`, `status: PENDING/CLEARED/CANCELLED`, timestamps |
| Wallet | `_id: ObjectId`, `user: ObjectId`, `name: String`, `icon: String`, `currency: String`, `isDefault: Boolean`, timestamps |
| Category | `_id: ObjectId`, `user: ObjectId`, `name: String`, `icon: String`, `color: String`, `type: EXPENSE/INCOME/BOTH`, timestamps |
| Budget | [ASSUMPTION] Present in the backend model directory; verify its exact fields before presenting them. |

## Scripts

| Directory | Command | Purpose |
|---|---|---|
| `backend` | `npm run dev` | Start API with Nodemon |
| `backend` | `npm start` | Start API with Node |
| `frontend` | `npm start` | Start Expo development server |
| `frontend` | `npm run android` | Open Android target |
| `frontend` | `npm run ios` | Open iOS target |
| `frontend` | `npm run web` | Open Expo web preview |
| root | `npm run dev`, `start`, `build` | [ASSUMPTION] Common presentation commands; no root `package.json` is checked in. |

## License and team credits

This is a student course project. [ASSUMPTION] No license file is included; backend package metadata currently says `ISC`.

**Team:** FLASH DEVS. Add final names and individual contributions in [`TEAM_CONTRIBUTIONS.md`](TEAM_CONTRIBUTIONS.md).
