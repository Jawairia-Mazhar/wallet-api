# Wallet API

A REST API for managing user accounts and money transfers, built with Node.js, Express, PostgreSQL, and Prisma. Built to learn relational databases, foreign keys, and atomic database transactions.
**Live API:** wallet-api-production-42e8.up.railway.app
## Features
- User registration and login with JWT authentication
- One account per user, with deposit support
- Atomic money transfers between accounts (fully succeeds or fully rolls back — no partial transfers)
- Ownership and balance validation on every transfer
- Transaction history (sent + received)
- Input validation on transfer and deposit

## Tech Stack
Node.js, Express, PostgreSQL (hosted on Neon), Prisma, JWT, bcrypt, express-validator

## API Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | /api/auth/register | No | Register a new user |
| POST | /api/auth/login | No | Login, returns JWT |
| POST | /api/accounts | Yes | Create an account (one per user) |
| GET | /api/accounts/me | Yes | View your account and balance |
| POST | /api/accounts/deposit | Yes | Deposit money into your account |
| POST | /api/accounts/transfer | Yes | Transfer money to another account |
| GET | /api/accounts/transactions | Yes | View your transaction history |

## Setup
1. Clone the repo
2. `npm install`
3. Create a `.env` file with `DATABASE_URL` and `JWT_ACCESS_SECRET`
4. `npx prisma generate`
5. `node server.js`

## What I Learned
Writing a schema.prisma file and running a migration actually created real tables in my Neon database — seeing code changes turn into actual database structure, instead of just app logic, was new and genuinely clicked for me.

I learned why arithmetic on money should happen in the database itself (increment/decrement), not in JavaScript — doing the math in code first and writing back a new number risks two requests overwriting each other and silently losing money, since both could read the same stale value before either saves.

Prisma's $transaction wraps multiple operations together so they either all succeed or all roll back — this is what prevents a transfer from debiting one account but failing to credit the other, which would make money vanish.

I also added real security checks: amounts have to be positive (otherwise a negative "transfer" could add money instead of subtracting it), and every transfer verifies the sender actually owns the source account, so no one can move money out of an account that isn't theirs.

Finally, I used Prisma's OR queries to fetch a user's transaction history — matching rows where their account was either the sender or the receiver, not just one fixed field.
