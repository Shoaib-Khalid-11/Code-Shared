import express from "express";
const app = express();
app.get("/", (req, res) => {
  res.json({
    message: "Hello World",
  });
});
app.get("/about", (req, res) => {
  res.json({
    message: "About Me",
  });
});
export default app;
