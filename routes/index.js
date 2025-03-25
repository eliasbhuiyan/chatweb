const express = require('express')
const apiRoute = require("./api")
const router = express.Router();

router.use("/api/v1" , apiRoute)

router.use((req, res)=>{
    res.status(404).send("Page not found!")
})

module.exports = router;