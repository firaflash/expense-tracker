# Friday presentation script

## Suggested 8–10 minute flow

| Time | Section | Goal |
|---|---|---|
| 0:00–0:45 | Problem and pitch | Explain why manual expense tracking is difficult. |
| 0:45–1:45 | Features and users | Show the core user journey and screens. |
| 1:45–3:00 | Stack and architecture | Explain React Native/Expo, Express, MongoDB and request flow. |
| 3:00–6:30 | Live demo | Register, log in, create/edit/delete/filter a transaction, show dashboard. |
| 6:30–7:45 | Data and security | Explain Mongoose, hashing and JWT. |
| 7:45–8:45 | Teamwork and AI | State contributions and human decisions. |
| 8:45–10:00 | Questions | Use the answers below. |

## Slide-by-slide talking points

1. **Title:** “MoniVo is a personal finance tracker for recording transactions and understanding spending.”
2. **Problem:** “People need a quick way to know where money goes, not just a list of bank transactions.”
3. **Solution:** “The app combines transaction entry, wallets, categories, budgets and visual summaries.”
4. **User flow:** “The user registers, receives a JWT, and then protected requests load their own data.”
5. **Architecture:** “React Native calls Axios; Express applies middleware and routes; controllers use Mongoose to reach MongoDB.”
6. **Security:** “Passwords are hashed with bcryptjs. JWTs are signed on login and stored in Expo SecureStore.”
7. **Demo:** Follow [`DEMO_SCRIPT.md`](DEMO_SCRIPT.md), keeping screenshots ready.
8. **Team and AI:** “AI accelerated explanation and debugging, but humans selected features, checked code, tested flows and made trade-offs.”
9. **Close:** “The modular design lets screens, store, API routes, controllers and models evolve independently.”

## WHO SAYS WHAT

| Member | Owns in presentation | Must also know |
|---|---|---|
| Member 1 | Problem, screens and navigation | API request lifecycle and auth |
| Member 2 | Express routes, middleware and controllers | Frontend state and models |
| Member 3 | MongoDB/Mongoose models and validation | UI flow and JWT storage |
| Member 4 | Analytics, styling and demo | Backend errors, deployment and teamwork |

Replace the labels with real names. Every person should rehearse every answer.

## Six critical questions

### 1. Why did you choose the MERN stack?

We chose a JavaScript-centered stack so the same core language and JSON data shape can be understood across client and server. React Native gives us reusable component-based UI, while Node.js and Express provide a lightweight REST API. MongoDB stores transaction-shaped documents naturally, and Mongoose adds validation and relationships. In this repository the client is Expo React Native rather than browser React, so the accurate description is a MERN-style JavaScript stack with a mobile client.

### 2. What CSS did you use?

This is a React Native application, so most styling uses React Native’s built-in `StyleSheet.create`, not browser CSS files. NativeWind is also installed and `global.css` is its entry point for utility styling. We chose this combination because `StyleSheet` is predictable and platform-aware, while NativeWind makes repeated utility styles concise. We should not claim Bootstrap or CSS Modules because neither is in the package manifest.

### 3. What programming languages are used, and where?

The backend uses modern JavaScript with ES modules in `.js` files. The frontend uses TypeScript and TSX for typed components and screens. JSON is used for API payloads and configuration, while HTML/CSS are indirect platform concepts rather than the main authoring model of this mobile app. MongoDB documents are represented as JavaScript/TypeScript objects and Mongoose schemas.

### 4. What middleware did you use, and what is middleware?

Middleware is a function in the Express request pipeline that can inspect or change a request, send a response, or call `next()` to continue. We use CORS, `express.json()`, `express.urlencoded()`, the JWT `protect` middleware, a not-found handler and a final error handler. The Axios request interceptor is client-side middleware-like logic that adds the bearer token before a request leaves the app. Morgan is not active; its code is commented out.

### 5. What was your individual contribution, and what did the group do together?

Each member should name concrete files or features from `TEAM_CONTRIBUTIONS.md`, then explain one backend and one frontend decision they understand. The group jointly agreed on the user journey, data model, API boundaries, visual priorities and demo flow. We reviewed one another’s work, tested the complete flow and combined the documentation. Contributions are individual; architecture and final quality are shared.

### 6. The instructor accepts AI use, but wants your group input.

We used Copilot/AI as an assistant for scaffolding, explanations, debugging ideas and documentation drafts. Humans supplied the requirements, chose the architecture and dependencies, adapted suggestions to the existing code, tested behavior and reviewed security and UX trade-offs. AI did not decide what the app should do or replace our understanding. We can explain every feature we present and identify where the code was verified.
