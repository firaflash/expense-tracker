# Why this stack?

We chose a MERN-style stack because one main language, JavaScript/TypeScript, can represent the mobile interface, server logic and JSON data. React Native/Expo provides component reuse and fast iteration; Express keeps the API understandable; MongoDB matches flexible finance documents; and Node.js handles I/O-bound work efficiently. The implementation is mobile rather than browser-only React, but the backend choices remain the same.

## Comparison

| Stack | Strength | Why we did not choose it |
|---|---|---|
| MERN-style | JavaScript/TypeScript, React components, Express and MongoDB | Chosen because the team already works in this ecosystem. |
| LAMP | Mature PHP, Apache, MySQL and strong hosting options | Requires a different server language and relational workflow. |
| MEAN | Angular plus Node/Express/MongoDB | Angular is more opinionated and heavier for this small app. |
| PERN | React, Express, PostgreSQL and Node | PostgreSQL is excellent, but MongoDB was simpler for flexible documents and prototyping. |

## Reasons

- **One JSON language everywhere:** requests and responses are JSON, and JavaScript/TypeScript represents them directly on both sides.
- **npm ecosystem:** Expo, navigation, Axios, Zustand, Express, Mongoose, JWT and bcryptjs are available packages.
- **Component reuse:** buttons, inputs, cards and modals can be reused across screens.
- **Non-blocking I/O:** Node is suitable for waiting on HTTP and database operations without blocking every request.
- **Community and relevance:** React, Node, Express and MongoDB have large communities and real-world usage.
- **Learning value:** the project exposes UI, API, authentication, validation, database and deployment concerns.

## Direct questions

### Why React and not Angular/Vue?

React uses small composable components and fits the team’s JavaScript/TypeScript knowledge. React Native lets those concepts produce mobile interfaces, while React Navigation supplies navigation. Angular is a more opinionated full framework; Vue is also good, but React Native alignment and team familiarity made React lower risk.

### Why MongoDB and not PostgreSQL?

Transactions, wallets and categories are naturally represented as documents with references to a user. MongoDB lets the schema evolve while the project is designed, and Mongoose gives validation and indexes. PostgreSQL would be stronger when joins and strict relational constraints dominate; MongoDB reduced setup friction here.

### Why Express and not Fastify/Nest?

Express has a simple route-and-middleware model that is easy to teach and debug. Fastify can provide performance and Nest can provide enterprise structure, but neither is necessary for this small API. Express also has a large middleware ecosystem and is familiar to the team.
