const db = require("../../storage/db/db");

function saveFeedback(payload) {
  return new Promise((resolve, reject) => {
    const { sleep_date, satisfaction_score } = payload || {};

    if (!sleep_date) {
      return reject(new Error("sleep_date is required"));
    }

    if (
      satisfaction_score === undefined ||
      satisfaction_score === null ||
      Number.isNaN(Number(satisfaction_score))
    ) {
      return reject(new Error("satisfaction_score must be a number"));
    }

    const score = Number(satisfaction_score);

    if (score < 0 || score > 100) {
      return reject(new Error("satisfaction_score must be between 0 and 100"));
    }

    const now = new Date().toISOString();

    const selectQuery = `
      SELECT id
      FROM user_feedback
      WHERE sleep_date = ?
      LIMIT 1
    `;

    db.get(selectQuery, [sleep_date], (selectErr, row) => {
      if (selectErr) {
        return reject(selectErr);
      }

      if (row) {
        const updateQuery = `
          UPDATE user_feedback
          SET satisfaction_score = ?, created_at = ?
          WHERE id = ?
        `;

        db.run(updateQuery, [score, now, row.id], function (updateErr) {
          if (updateErr) {
            return reject(updateErr);
          }

          return resolve({
            message: "feedback updated",
            action: "update",
            id: row.id,
            sleep_date,
            satisfaction_score: score,
            created_at: now
          });
        });
      } else {
        const insertQuery = `
          INSERT INTO user_feedback (sleep_date, satisfaction_score, created_at)
          VALUES (?, ?, ?)
        `;

        db.run(insertQuery, [sleep_date, score, now], function (insertErr) {
          if (insertErr) {
            return reject(insertErr);
          }

          return resolve({
            message: "feedback saved",
            action: "insert",
            id: this.lastID,
            sleep_date,
            satisfaction_score: score,
            created_at: now
          });
        });
      }
    });
  });
}

module.exports = {
  saveFeedback
};