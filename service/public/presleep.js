const predictBtn = document.getElementById("predictBtn");
const resultBox = document.getElementById("resultBox");

function getNumberValue(id) {
  return Number(document.getElementById(id).value);
}

predictBtn.addEventListener("click", async () => {
  const payload = {
    user_id: document.getElementById("userId").value.trim(),
    avg_hr_1h: getNumberValue("avgHr"),
    steps_sum_1h: getNumberValue("stepsSum"),
    calories_sum_1h: getNumberValue("caloriesSum"),
    avg_temp_1h: getNumberValue("avgTemp"),
    avg_humidity_1h: getNumberValue("avgHumidity"),
    avg_mq5_index_1h: getNumberValue("avgMq5"),
    recent_avg_sleep_minutes: getNumberValue("recentAvgSleep")
  };

  if (!payload.user_id) {
    resultBox.textContent = "user_id를 입력하세요.";
    return;
  }

  resultBox.textContent = "예측 요청 중...";

  try {
    const response = await fetch("/predict/presleep", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    resultBox.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    resultBox.textContent = `오류: ${error.message}`;
  }
});