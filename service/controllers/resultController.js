const { fetchLatestResult } = require("../services/resultService");

async function getLatestResult(req, res) {
  try {
    const result = await fetchLatestResult();

    return res.status(200).json({
      status: "ok",
      endpoint: "GET /result/latest",
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
  getLatestResult
};