const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// Root route (test)
app.get("/", (req, res) => {
    res.send("RSS Proxy is running ✅");
});

// RSS route (using rss2json to avoid blocking issues)
app.get("/rss", async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({ error: "Missing URL" });
    }

    try {
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            return res.status(response.status).json({ error: "Failed to fetch RSS" });
        }

        const data = await response.json();

        if (data.status !== "ok") {
            return res.status(500).json({ error: "Invalid RSS response" });
        }

        // Return clean JSON
        res.json({
            source: data.feed?.title || "Unknown Source",
            items: data.items || []
        });

    } catch (err) {
        console.error("RSS Fetch Error:", err);
        res.status(500).json({ error: "Failed to fetch RSS" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
