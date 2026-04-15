const db = require("../../storage/db/db");

function fetchLatestResult() {
  return new Promise((resolve, reject) => {
    const latestFeedbackQuery = `
      SELECT id, sleep_date, satisfaction_score, created_at
      FROM user_feedback
      ORDER BY sleep_date DESC, id DESC
      LIMIT 1
    `;

    db.get(latestFeedbackQuery, [], (err, feedbackRow) => {
      if (err) {
        return reject(err);
      }

      return resolve({
        message: "latest result fetched",
        latest_feedback: feedbackRow
          ? {
              id: feedbackRow.id,
              sleep_date: feedbackRow.sleep_date,
              satisfaction_score: feedbackRow.satisfaction_score,
              created_at: feedbackRow.created_at
            }
          : null,
        latest_prediction: null,
        latest_sleep_score: null,
        latest_analysis: null
      });
    });
  });
}

module.exports = {
  fetchLatestResult
};