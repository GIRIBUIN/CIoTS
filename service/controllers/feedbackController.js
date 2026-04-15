const { saveFeedback } = require("../services/feedbackService");

function postFeedback(req, res) {
  try {
    const result = saveFeedback(req.body);

    return res.status(200).json({
      status: "ok",
      endpoint: "POST /feedback",
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    });
  }
}

module.exports = {
  postFeedback
};