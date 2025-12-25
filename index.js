const express = require("express");
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.url, req.headers["content-type"]);
  next();
});

app.use("/jobs", require("./routes/jobs"));
app.use("/", require("./routes/applications"));

app.get("/", (req, res) => {
  res.send("Job Application Pipeline API is running");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
