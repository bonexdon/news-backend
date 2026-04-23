const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

const response = await fetch(url, {
    headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Connection": "keep-alive"
    }
});
app.get("/", (req, res) => {
    res.send("RSS Proxy is running ✅");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
