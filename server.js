const express = require("express");
const cors = require("cors");

const app = express();

// Enable CORS for all routes
app.use(cors());

// Helper: safe fetch with timeout
async function fetchWithTimeout(url, options = {}, timeout = 15000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(id);
  }
}

// RSS proxy route
app.get("/rss", async (req, res) => {
  const rssUrl = req.query.url;

  if (!rssUrl) {
    return res.status(400).json({ error: "Missing RSS URL" });
  }

  try {
    // decode in case frontend encoded it twice
    const decodedUrl = decodeURIComponent(rssUrl);

    const response = await fetchWithTimeout(decodedUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "Accept": "application/rss+xml, application/xml, text/xml, */*",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();

    // Return RSS as XML (important)
    res.set("Content-Type", "application/xml");
    return res.send(data);
  } catch (error) {
    console.error("RSS fetch error:", error.message);

    return res.status(500).json({
      error: "Failed to fetch RSS",
      details: error.message,
    });
  }
});

// Health check route (useful on Render)
app.get("/", (req, res) => {
  res.send("RSS backend is running 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
