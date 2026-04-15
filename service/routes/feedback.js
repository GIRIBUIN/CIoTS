const express = require("express");
const { postFeedback } = require("../controllers/feedbackController");

const router = express.Router();

router.post("/", postFeedback);

module.exports = router;