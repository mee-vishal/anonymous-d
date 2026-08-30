# Dating Site Prototype

A tiny one-page prototype: a landing page with a signup form that saves to
MongoDB, sends a verification email (Nodemailer), and confirms the entry
once the link is clicked.

## Folder structure

```
dating-app/
├── app/
│   ├── layout.js            Root layout, fonts, metadata
│   ├── page.js               The landing page + form (client component)
│   ├── globals.css           Tailwind + small custom styles
│   └── api/
│       ├── submit/route.js   POST: save signup, send verification email
│       └── verify/route.js   GET:  verify token, send confirmation email
├── lib/
│   ├── mongodb.js             MongoDB connection helper
│   └── mailer.js              Nodemailer helpers
├── .env.local.example         Copy to .env.local and fill in
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
├── jsconfig.json
└── package.json
```

## 1. Install dependencies

```bash
cd dating-app
npm install
```

## 2. Set up environment variables

Copy the example file and fill in your own values:

```bash
cp .env.local.example .env.local
```

- `MONGODB_URI` — a MongoDB connection string. Easiest option: create a free
  cluster at https://www.mongodb.com/cloud/atlas, add a database user, and
  allow your current IP (or `0.0.0.0/0` for local testing).
- `EMAIL_USER` / `EMAIL_PASS` — SMTP credentials. With Gmail, turn on 2-Step
  Verification, then create an **App Password**
  (https://myaccount.google.com/apppasswords) and use that as `EMAIL_PASS`.
  Any other SMTP provider (Mailtrap, SendGrid SMTP, etc.) works too — just
  change `EMAIL_HOST` / `EMAIL_PORT` accordingly.
- `BASE_URL` — keep as `http://localhost:3000` for local dev.

## 3. Run it

```bash
npm run dev
```

Visit http://localhost:3000.

## How it works

1. Visitor fills in **Code Name**, **Email**, **Remarks** and submits.
2. `POST /api/submit` validates the input, saves/updates a document in the
   `signups` collection (`{ codeName, email, remarks, verified: false, token }`),
   and emails a verification link:
   `http://localhost:3000/api/verify?token=...`
3. Clicking the link hits `GET /api/verify`, which looks up the token, sets
   `verified: true`, and sends the confirmation email:
   **"You're in! We'll be in touch shortly."**
4. The verify route returns a small standalone HTML page confirming success
   or explaining what went wrong (invalid/expired link).

## Notes

- This is intentionally minimal: no auth, no dashboard, no matching logic —
  just a form, a database write, and two emails.
- Re-submitting the same email before verifying just refreshes the token
  and resends the verification email (upsert).
- For production you'd want to add rate limiting, token expiry, and a
  privacy policy — left out here to keep the prototype small.
