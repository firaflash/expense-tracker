# Technical decisions

## CSS and styling

The client is React Native, so the primary styling approach is **React Native `StyleSheet`**, not browser CSS, Bootstrap or CSS Modules. Components call `StyleSheet.create`, and theme-aware components create styles from current colors. **NativeWind** is installed for utility-class styling, with `frontend/global.css` as its entry point. This gives us platform-aware layout while keeping repeated utility styling concise.

## Language inventory

| Language/format | Where used | Purpose |
|---|---|---|
| JavaScript ES6+ | `backend/src/**/*.js` | Express server, routes, controllers and models |
| TypeScript | `frontend/**/*.ts` | Typed state, API utilities and data types |
| JSX/TSX | `frontend/**/*.tsx` | Declarative React Native components and screens |
| HTML5 concepts | Expo web target | Platform output on web; no hand-authored templates |
| CSS3 concepts | NativeWind/global styling and web output | Styling vocabulary; native screens primarily use `StyleSheet` |
| JSON | API payloads, package manifests and configuration | Interchange and configuration format |

## Backend dependencies

| Package | Purpose |
|---|---|
| `axios` | HTTP client dependency available for server-side requests. |
| `bcrypt` | Native password-hashing package installed in the backend. |
| `bcryptjs` | Password hashing and comparison used by `User.js`. |
| `cors` | Express CORS middleware. |
| `dotenv` | Loads environment variables from `.env`. |
| `express` | HTTP server, routing and middleware framework. |
| `jsonwebtoken` | Signs and verifies JWT access tokens. |
| `mongodb` | MongoDB driver dependency used by the Mongoose stack. |
| `mongoose` | ODM for schemas, validation, indexes and queries. |
| `nodemon` | Restarts the development server when files change. |

## Frontend dependencies

| Package | Purpose |
|---|---|
| `@expo-google-fonts/inter` | Inter font family. |
| `@react-navigation/bottom-tabs` | Bottom-tab navigation. |
| `@react-navigation/native` | Navigation primitives. |
| `@react-navigation/native-stack` | Native stack navigation. |
| `@react-navigation/stack` | Stack navigation. |
| `axios` | API requests and JWT request interceptor. |
| `babel-preset-expo` | Babel transforms for Expo. |
| `expo` | Mobile runtime and tooling. |
| `expo-blur` | Blur effects. |
| `expo-font` | Custom font loading. |
| `expo-linear-gradient` | Gradient backgrounds and cards. |
| `expo-secure-store` | Encrypted device JWT storage. |
| `expo-status-bar` | Status-bar configuration. |
| `lucide-react-native` | Icon components. |
| `nativewind` | Tailwind-style utilities for React Native. |
| `react` | Component and hook library. |
| `react-native` | Native UI runtime. |
| `react-native-calendars` | Calendar/date selection UI. |
| `react-native-chart-kit` | Analytics charts. |
| `react-native-gesture-handler` | Gesture support. |
| `react-native-reanimated` | Animations. |
| `react-native-safe-area-context` | Device safe-area handling. |
| `react-native-screens` | Native navigation screen containers. |
| `react-native-svg` | SVG rendering for charts/icons. |
| `react-native-worklets` | Animation worklet infrastructure. |
| `zustand` | Global application state. |
| `@types/react` | React TypeScript declarations. |
| `tailwindcss` | Tailwind configuration for NativeWind. |
| `typescript` | Type checking and TypeScript support. |

## API decisions

| Decision | Choice | Reason |
|---|---|---|
| API style | REST | Resource-based routes map clearly to CRUD. |
| Authentication | JWT bearer tokens | Stateless API authentication works across mobile and server. |
| HTTP client | Axios | Central base URL, timeout and request interceptor. |
| Token storage | Expo SecureStore | Safer device storage than ordinary plaintext storage. |
| State | Zustand | Minimal global state API without Redux boilerplate. |

## Caveats to verify

- The connector reads `MONGODB_URI`, while `.env.example` shows `MONGO_URI`; use the variable read by code.
- The controller signs tokens with hard-coded `30d`; do not claim `JWT_EXPIRES_IN` controls expiry until code uses it.
- Morgan is commented out and is not active middleware.
