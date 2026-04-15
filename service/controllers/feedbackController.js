const { saveFeedback } = require("../services/feedbackService");

async function postFeedback(req, res) {
  try {
    const result = await saveFeedback(req.body);

    return res.status(200).json({
      status: "ok",
      endpoint: "POST /feedback",
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message
    });
  }
}

module.exports = {
  postFeedback
};