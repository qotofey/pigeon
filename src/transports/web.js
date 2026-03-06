const express = require("express");

const app = express();
const PORT = process.env.PORT || 2400;

app.get("/healthcheck", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/up", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

module.exports = { app };
