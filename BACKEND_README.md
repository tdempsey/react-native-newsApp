# Backend for News Moderation

This directory contains a small Express based API and admin panel for moderating news stories fetched from NewsAPI.org. The panel allows an administrator to approve stories and assign a rating between 0 and 5.

## Running locally

1. Install dependencies:

```bash
cd backend
npm install
```

2. Set an environment variable `NEWS_API_KEY` with your NewsAPI key.

3. Start the server:

```bash
npm start
```

4. Visit `http://localhost:3000/admin` to moderate news. Click **Refresh from API** to load the latest stories. Approved and rated stories are saved in `data/moderated.json` and can be fetched at `/news`.

This backend can be deployed to a Node-capable host such as Bluehost's NodeJS hosting.
