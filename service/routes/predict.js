const express = require("express");
const { postPresleepPrediction } = require("../controllers/predictController");

const router = express.Router();

router.post("/presleep", postPresleepPrediction);

module.exports = router;