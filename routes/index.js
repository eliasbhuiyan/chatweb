const express = require('express')
const apiRoute = require("./api")
const router = express.Router();

router.use("/api/v1" , apiRoute)

router.get("/", (req, res)=>{
    res.send("Hello! Welcome to the server.")
})

router.use((req, res)=>{
    res.status(404).send("Page not found!")
})

module.exports = router;