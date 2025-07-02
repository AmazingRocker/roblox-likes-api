const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

const UNIVERSE_ID = "8009764752";
const API_URL = `https://games.roblox.com/v1/games/votes?universeIds=${UNIVERSE_ID}`;

let cachedLikes = null;
let lastFetchTime = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 5 mins

app.use(cors());

app.get("/likes", async (req, res) => {
  const now = Date.now();

  if (cachedLikes && now - lastFetchTime < CACHE_DURATION) {
    return res.json({ likes: cachedLikes });
  }

  try {
    const response = await axios.get(API_URL);
    const data = response.data.data[0];

    cachedLikes = data.upVotes;
    lastFetchTime = now;

    res.json({ likes: data.upVotes });
  } catch (err) {
    console.error("Error fetching likes:", err.message);
    res.status(500).json({ error: "Failed to fetch likes" });
  }
});

app.get("/", (req, res) => {
  res.send("👍 Roblox Likes API is running!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
