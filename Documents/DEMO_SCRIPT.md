# Live demo script

## Before the demo

1. Start MongoDB and the backend with `cd backend && npm run dev`.
2. Set `EXPO_PUBLIC_API_URL` to a reachable `/api` URL.
3. Start the client with `cd frontend && npm start`.
4. Keep a test email ready: `demo+friday@example.com`.
5. Keep this document and a dashboard screenshot open.

## Main flow

| Step | Exact action | Say this |
|---|---|---|
| 1. Register | Open the app, tap **Create account/Register**, type `Friday Demo`, `demo+friday@example.com`, `DemoPass123!`, then tap **Register**. | “Registration creates a user; the server hashes the password and returns a signed JWT.” |
| 2. Login | If returned to login, type the same email/password and tap **Login**. | “The token is saved in SecureStore, not displayed to the user.” |
| 3. Dashboard | Wait for Home. Point to balance, income, expense, recent transactions and chart. | “The dashboard is rendered from shared Zustand state.” |
| 4. Add expense | Tap **+** or **Add transaction**, choose **Expense/Debit**, enter `125`, choose **Food**, choose a wallet, enter `Friday lunch`, select today, then tap **Save/Add**. | “A transaction has amount, type, category, wallet, date and optional note.” |
| 5. Edit | Open `Friday lunch`, tap **Edit**, change amount to `150`, then tap **Save**. | “Edit changes only allowed fields for the same transaction.” |
| 6. Delete | Open the row, tap **Delete**, and confirm. | “Delete removes only the selected record.” |
| 7. Filter | Open Transactions and choose a category or period filter. | “Filtering makes history easier to inspect.” |
| 8. Analytics | Open Analytics, select a period if available, and point to charts/category totals. | “The chart turns transaction data into a quick explanation.” |
| 9. Close | Return Home and logout only if time allows. | “The complete journey is protected by the same authentication boundary.” |

> [ASSUMPTION] Labels can vary slightly by screen version. Rehearse on the presentation device and replace labels with the exact visible text.

## Fallback plan

| Problem | Immediate fallback |
|---|---|
| Phone cannot reach API | Use a LAN IP or ngrok URL, verify `/api/health`, then switch to screenshots. |
| MongoDB unavailable | Explain architecture with screenshots and show routes/models in the editor. |
| Login fails | Use a previously registered demo account; never display a real password. |
| Data is empty | Use current sample/dummy data where available and call it presentation seed data. |
| UI crashes | Show a recording/screenshots, then demonstrate endpoints with Postman/curl. |
| API is needed | In Postman call `POST /api/auth/login`, copy the token, set Bearer auth, then call `GET /api/transaction`. |

```bash
curl http://localhost:5000/api/health
```

Say honestly: “The live network path is unavailable on this device, so we are showing the same verified flow through prepared evidence and the API contract.”
