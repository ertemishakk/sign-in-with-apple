const express = require("express");
const path = require("path");
const fs = require("fs");
const config = fs.readFileSync("./config/config.json");
const AppleAuth = require("apple-auth");
const jwt = require("jsonwebtoken");

let auth = new AppleAuth(
  config,
  fs.readFileSync("./config/AuthKey.p8").toString(),
  "text"
);

const app = express();

app.use(express.json({ extended: false }));

app.post("/auth", async (req, res) => {
  try {
    const response = await auth.accessToken(req.body.authorization.code);
    const idToken = jwt.decode(response.id_token);

    const user = {};
    user.id = idToken.sub;

    if (idToken.email) user.email = idToken.email;
    if (req.body.user) {
      const { name } = JSON.parse(req.body.user);
      user.name = name;
    }

    res.json(user);
  } catch (error) {
    console.log(error);
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
