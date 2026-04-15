const loadBtn = document.getElementById("loadBtn");
const resultBox = document.getElementById("resultBox");

loadBtn.addEventListener("click", async () => {
  resultBox.textContent = "불러오는 중...";

  try {
    const response = await fetch("/result/latest");
    const data = await response.json();
    resultBox.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    resultBox.textContent = `오류: ${error.message}`;
  }
});