# Frequently asked questions

## Stack choices

| # | Question | Strong answer |
|---:|---|---|
| 1 | Why this stack? | It gives component UI, a JavaScript/TypeScript API workflow, JSON end to end, a large npm ecosystem and a manageable learning curve. |
| 2 | Is this exactly a MERN web app? | The backend is Node/Express/MongoDB/Mongoose; the checked-in client is Expo React Native, so “MERN-style mobile client” is accurate. |
| 3 | Why React Native? | It provides reusable React components on mobile and Expo makes device testing and packaging faster. |

## Middleware

| # | Question | Strong answer |
|---:|---|---|
| 4 | What is middleware? | An ordered Express function that can inspect, reject, enrich or pass on a request with `next()`. |
| 5 | Which middleware do you use? | CORS, `express.json`, `express.urlencoded`, JWT `protect`, `notFound` and `errorHandler`; Morgan is commented out. |
| 6 | Why is error handling last? | It receives errors from routes and earlier middleware after they call `next(error)`. |

## CSS

| # | Question | Strong answer |
|---:|---|---|
| 7 | What CSS did you use? | Primarily React Native `StyleSheet`; NativeWind is installed for utility styling. We did not use Bootstrap or CSS Modules. |
| 8 | Why not plain CSS? | Native screens need platform-aware style objects, and `StyleSheet` is the native equivalent. |

## Languages

| # | Question | Strong answer |
|---:|---|---|
| 9 | What languages are used? | Backend JavaScript, frontend TypeScript/TSX, plus JSON for configuration and API data. |
| 10 | Why TypeScript only on the frontend? | Typed UI state and props give immediate value there; the backend currently uses modern JavaScript modules. |

## Database

| # | Question | Strong answer |
|---:|---|---|
| 11 | Why MongoDB? | Documents fit changing transaction records and Mongoose supplies schemas, validation and indexes. |
| 12 | What is Mongoose? | An ODM mapping JavaScript objects to MongoDB documents with schemas, validation, hooks and queries. |
| 13 | How is ownership enforced? | Protected controllers use `req.user._id` in queries and validate related wallet/category ownership. |

## Auth

| # | Question | Strong answer |
|---:|---|---|
| 14 | Explain login. | The server finds the user, compares the password with bcryptjs, signs a JWT with the user id and returns it. |
| 15 | Where is the token stored? | Expo SecureStore under `userToken`; Axios reads it and sends a Bearer header. |
| 16 | Is a JWT encrypted? | No. It is encoded and signed; the signature detects tampering and the password is separately hashed. |

## React concepts

| # | Question | Strong answer |
|---:|---|---|
| 17 | How is state managed? | Zustand stores shared auth, transaction, wallet, category, budget and theme state. |
| 18 | Why not Redux? | Zustand provides the needed shared state with less boilerplate for this project. |
| 19 | What is a component? | A reusable function receiving props, reading state and returning a UI description. |

## Express concepts

| # | Question | Strong answer |
|---:|---|---|
| 20 | What is a route? | A method/path mapping such as `GET /api/transaction` to a controller. |
| 21 | What does a controller do? | It validates input, applies business rules, calls models and chooses the response. |

## MongoDB/Mongoose

| # | Question | Strong answer |
|---:|---|---|
| 22 | Why ObjectId references? | They connect transactions to users, wallets and categories without duplicating whole documents. |
| 23 | Why indexes? | They speed common lookups such as user/date and user/category queries. |

## Deployment

| # | Question | Strong answer |
|---:|---|---|
| 24 | What changes in production? | Use hosted API/MongoDB, a strong secret, restricted CORS, HTTPS, safe error output and correct Expo environment variables. |

## Teamwork and AI

| # | Question | Strong answer |
|---:|---|---|
| 25 | How did you use AI? | AI helped with explanations, drafts and debugging ideas; humans chose architecture/features, adapted code, tested flows, reviewed security and can explain every presented part. |
