const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

// IMPORTANT: use dynamic port for Render
const PORT = process.env.PORT || 3000;

app.get("/rss", async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).send("Missing URL");
    }

    try {
        const response = await fetch(url);
        const text = await response.text();
        res.send(text);
    } catch (err) {
        res.status(500).send("Failed to fetch RSS");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});