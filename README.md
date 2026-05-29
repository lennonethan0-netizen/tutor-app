# AI Revision Tutor — Deploy Guide

This app has two parts:
- **Frontend** (`src/App.jsx`) — the UI students see
- **Backend** (`api/claude.js`) — runs on Vercel's servers, holds your secret API key, talks to Claude

The frontend never sees your API key, so nobody can steal it.

---

## Step 1 — Get an Anthropic API key

1. Go to **console.anthropic.com**
2. Sign up / log in
3. Click **Billing** → add credit (start with £5)
4. Click **API Keys** → **Create Key** → copy it (starts with `sk-ant-...`)
5. Keep it secret — do NOT put it in any code or share it

---

## Step 2 — Put the project on GitHub

1. Create a free account at **github.com**
2. Create a new repository (e.g. `ai-revision-tutor`)
3. Upload all the files in this folder to it
   (or use GitHub Desktop if you're not comfortable with git commands)

---

## Step 3 — Deploy to Vercel

1. Go to **vercel.com** → sign up with your GitHub account
2. Click **Add New → Project**
3. Select your `ai-revision-tutor` repo → **Import**
4. Before clicking Deploy, open **Environment Variables** and add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** paste your `sk-ant-...` key here
5. Click **Deploy**

Wait ~1 minute. Vercel gives you a live URL like `your-app.vercel.app`.

---

## Step 4 — Test it

Open the URL, go to Chat, ask a question. It should now answer properly.

If it errors, go to Vercel → your project → **Logs** to see the real error.

---

## Important business note

Every question/chat costs YOU money (~£0.01–0.03 each via the API).
At £3.99/mo per subscriber, a heavy user could cost more than they pay.

Before launching, consider:
- A daily question cap on the free tier (e.g. 3/day)
- A fair-use cap even on paid (e.g. 100/day)

This protects you from a surprise API bill.

---

## Running locally (optional, for testing)

```
npm install
npm run dev
```

Note: the `/api/claude` backend only runs on Vercel, so chat won't work
in plain local `npm run dev` unless you use `vercel dev` with the key set.
