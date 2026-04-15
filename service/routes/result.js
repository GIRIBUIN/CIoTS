const express = require("express");
const { getLatestResult } = require("../controllers/resultController");

const router = express.Router();

router.get("/latest", getLatestResult);

module.exports = router;