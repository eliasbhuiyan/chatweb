const express = require("express");
const dbConfig = require("./dbConfig/db");
const router = require("./routes");
require("dotenv").config();
const app = express();
app.use(express.json());

dbConfig();

app.use(router);

app.listen(8000, () => console.log("Server is running"));