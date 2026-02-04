const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "tweets.json");

app.use(express.static("public"));
app.use(express.json());

app.get("/tweets", (req, res) => {
  const tweets = readTweets();
  res.json(tweets);
});

app.post("/tweets", (req, res) => {
  const { author, message } = req.body;
  const tweets = readTweets();

  const newTweet = {
    id: uuidv4(),
    author,
    message,
    date: new Date().toLocaleString("de-DE"),
  };

  tweets.push(newTweet);
  saveTweets(tweets);
  res.status(201).json({ success: true });
});

app.delete("/tweets/:id", (req, res) => {
  const { id } = req.params;
  const tweets = readTweets().filter((t) => t.id !== id);
  saveTweets(tweets);
  res.status(200).json({ success: true });
});

app.put("/tweets/:id", (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  const tweets = readTweets();

  const tweet = tweets.find((t) => t.id === id);
  if (tweet) {
    tweet.message = message;
    saveTweets(tweets);
    res.status(200).json({ success: true });
  } else {
    res.status(404).json({ error: "Tweet nicht gefunden" });
  }
});

function readTweets() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function saveTweets(tweets) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tweets, null, 2));
}

app.listen(PORT, () => {
  console.log(`X-Light läuft unter http://localhost:${PORT}`);
});
