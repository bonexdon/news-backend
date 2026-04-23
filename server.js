const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/rss", async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).send("Missing URL");
    }

    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                "Accept": "application/rss+xml, application/xml;q=0.9, */*;q=0.8"
            }
        });

        if (!response.ok) {
            return res.status(response.status).send("Failed to fetch RSS");
        }

        const text = await response.text();
        res.send(text);

    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to fetch RSS");
    }
});
app.get("/", (req, res) => {
    res.send("RSS Proxy is running ✅");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
