import express from 'express';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const DATA_FILE = path.join(__dirname, 'data', 'moderated.json');
const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';
const API_KEY = process.env.NEWS_API_KEY || 'YOUR_API_KEY';
const COUNTRY = 'us';

function loadData() {
  if (fs.existsSync(DATA_FILE)) {
    return JSON.parse(fs.readFileSync(DATA_FILE));
  }
  return [];
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/refresh', async (req, res) => {
  const url = `${NEWS_API_URL}?country=${COUNTRY}`;
  try {
    const response = await fetch(url, { headers: { 'X-API-KEY': API_KEY } });
    const data = await response.json();
    const articles = data.articles.map((a, idx) => ({
      id: idx,
      title: a.title,
      description: a.description,
      url: a.url,
      rating: 0,
      approved: false
    }));
    saveData(articles);
    res.redirect('/admin');
  } catch (err) {
    res.status(500).send('Failed to fetch news');
  }
});

app.get('/admin', (req, res) => {
  const articles = loadData();
  res.render('admin', { articles });
});

app.post('/admin/update', (req, res) => {
  const articles = loadData();
  for (const art of articles) {
    const approved = req.body[`approved_${art.id}`] === 'on';
    const rating = parseInt(req.body[`rating_${art.id}`], 10) || 0;
    art.approved = approved;
    art.rating = rating;
  }
  saveData(articles);
  res.redirect('/admin');
});

app.get('/news', (req, res) => {
  const articles = loadData().filter(a => a.approved);
  res.json(articles);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

