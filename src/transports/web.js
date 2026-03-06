const express = require("express");

const app = express();
const PORT = process.env.PORT || 2400;

app.get("/", (req, res) => {
  res.send(`Node.js ${process.version}, Express ${require("express/package.json").version}`);
});

app.get("/healthcheck", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

module.exports = { app };
