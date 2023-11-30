const express = require("express");
const app = express();
const dotEnv = require("dotenv").config({ path: "./config.env" });
const port = process.env.NODE_PORT || 3000;
const { mongoose } = require("./Database/connect");
const { routes } = require("./Model/user");

app.use(express.json());
app.use(express.static("dist"));
app.post("/api/signup", routes.signup);
app.post("/api/signin", routes.signin);
app.post("/api/forget", routes.forgetPassword);
app.patch("/api/resetPassword", routes.emailReset);
app.get("/api/signout", routes.logout);
app.post("/api/getUrl", routes.CreateUrl);
app.get("/api/getid/:id", routes.getFullUrl);
app.get("/api/", routes.getUrl);
app.delete("/api/:id", routes.getOne);

app.listen(port, (e) => console.log("Server Running...."));
