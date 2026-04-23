const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const xml2js = require("xml2js");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// RSS fetch + parse route
app.get("/rss", async (req, res) => {
  const rssUrl = req.query.url;

  if (!rssUrl) {
    return res.status(400).json({ error: "Missing RSS url parameter" });
  }

  try {
    const response = await fetch(rssUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS: ${response.status}`);
    }

    const xml = await response.text();

    const parser = new xml2js.Parser({ explicitArray: false });

    parser.parseString(xml, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "XML parse error", details: err.message });
      }

      try {
        const items = result.rss.channel.item;

        const formatted = items.map(item => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          description: item.description
        }));

        res.json({
          source: result.rss.channel.title,
          count: formatted.length,
          items: formatted
        });
      } catch (e) {
        res.status(500).json({
          error: "Unexpected RSS structure",
          details: e.message
        });
      }
    });

  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch RSS",
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`RSS backend running on port ${PORT}`);
});