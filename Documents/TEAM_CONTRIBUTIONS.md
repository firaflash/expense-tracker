# Team contributions

## Contribution table

Replace the labels with real names and concrete file references.

| Member | Frontend | Backend | Database | Docs | Presentation |
|---|---|---|---|---|---|
| Member 1 | Auth screens/navigation | Auth route integration | User model review | README | Problem and demo |
| Member 2 | Home and transaction screens | Transaction controllers/routes | Transaction schema | Architecture | Request lifecycle |
| Member 3 | Budgets/categories/wallet UI | Wallet/category routes | Wallet/category schemas | Technical decisions | Database and security |
| Member 4 | Analytics, charts and theme | Error handling/integration | Data-flow checks | FAQ and demo script | Teamwork and AI |

These are a starting allocation, not a claim about individual work. Edit each row to match the actual contribution.

## AI Usage Disclosure

The team used Copilot/AI as an allowed assistant for explaining APIs, suggesting patterns, drafting documentation and proposing debugging steps. Suggestions were treated as drafts: humans read the repository, selected what fit, corrected assumptions, ran the app, checked request flows, and reviewed security and usability.

Human input was decisive in:

- choosing the expense-tracking problem and feature scope;
- choosing Expo/React Native, Zustand, Express, MongoDB and JWT;
- designing the user journey, models and route boundaries;
- testing registration, login, CRUD and dashboard behavior;
- debugging device-to-server networking and environment variables;
- reviewing generated code and rejecting claims that did not match the repository;
- dividing work, merging changes and preparing the presentation.

The honest summary is: AI accelerated research and drafting, while the group supplied requirements, decisions, verification and accountability.

## Everyone knows everything checklist

1. What problem does MoniVo solve?
2. Why is the client React Native/Expo rather than browser-only React?
3. What does MERN mean, and which parts are in this repository?
4. What happens after the user presses Login?
5. What is Express middleware?
6. Which middleware is active and which is commented out?
7. How does `protect` identify the user?
8. Where is the JWT stored?
9. What is the difference between hashing and encryption?
10. What fields does a transaction contain?
11. How are users prevented from reading another user’s transactions?
12. What does Mongoose add over the MongoDB driver?
13. Why use Zustand instead of Context or Redux?
14. Why use Axios instead of raw `fetch`?
15. How are totals and category summaries calculated?
16. What styling system does the app use?
17. What happens when a route is not found?
18. Which environment variables are required?
19. What would you do if MongoDB is unavailable?
20. What did AI generate, and what did humans verify?
