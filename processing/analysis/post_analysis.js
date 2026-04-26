// Post-sleep cause analysis
// Input: { sleepRow, scoreResult, featureSnapshot, satisfactionScore, patternProfile }
// Output: { causes_json, analysis_text, score_gap_note }

const CAUSE_LABELS = {
  gas:      "실내 가스(공기질) 불량",
  temp:     "실내 온도 높음",
  humidity: "실내 습도 높음",
  hr:       "취침 전 심박 상승",
  activity: "취침 전 과도한 활동"
};

function detectCauses(featureSnapshot, patternProfile) {
  const f = featureSnapshot || {};
  const baseHr = Number(patternProfile?.avg_presleep_hr ?? 70);

  const hits = [];
  if (Number(f.avg_mq5_index_1h) >= 0.5)         hits.push({ key: "gas",      weight: 3 });
  if (Number(f.avg_hr_1h) >= baseHr + 8)          hits.push({ key: "hr",       weight: 3 });
  if (Number(f.avg_temp_1h) >= 25.5)              hits.push({ key: "temp",     weight: 2 });
  if (Number(f.avg_humidity_1h) >= 65)            hits.push({ key: "humidity", weight: 2 });
  if (Number(f.steps_sum_1h) >= 300)              hits.push({ key: "activity", weight: 1 });

  hits.sort((a, b) => b.weight - a.weight);
  return hits;
}

function buildScoreGapNote(autoScore, satisfactionScore) {
  if (satisfactionScore == null) return null;
  const gap = Math.round((Number(autoScore) - Number(satisfactionScore)) * 10) / 10;
  if (Math.abs(gap) < 5) return "객관 수면 점수와 주관적 만족도가 대체로 일치합니다.";
  if (gap > 0) return `객관 점수(${autoScore})가 주관 만족도(${satisfactionScore})보다 ${gap}점 높습니다. 수면 구조는 양호했으나 컨디션이 좋지 않으셨을 수 있습니다.`;
  return `주관 만족도(${satisfactionScore})가 객관 점수(${autoScore})보다 ${Math.abs(gap)}점 높습니다. 수면의 질 지표 대비 체감 컨디션이 더 좋으셨던 것 같습니다.`;
}

function analyzePostSleep({ sleepRow, scoreResult, featureSnapshot, satisfactionScore, patternProfile }) {
  const causes = detectCauses(featureSnapshot, patternProfile);
  const noSensorData = !featureSnapshot;

  const mainCause = causes[0] ? CAUSE_LABELS[causes[0].key] : null;
  const subCause  = causes[1] ? CAUSE_LABELS[causes[1].key] : null;

  const causesList = causes.map((c) => ({ key: c.key, label: CAUSE_LABELS[c.key] }));

  let analysis_text;
  if (noSensorData) {
    analysis_text = "취침 전 센서 데이터가 없어 원인 분석을 수행할 수 없습니다.";
  } else if (causesList.length === 0) {
    analysis_text = "특별한 수면 방해 요인이 감지되지 않았습니다. 전반적으로 양호한 수면 환경이었습니다.";
  } else {
    const parts = [`주요 원인: ${mainCause}.`];
    if (subCause) parts.push(`보조 원인: ${subCause}.`);
    parts.push("취침 전 환경 및 신체 상태를 점검해 보세요.");
    analysis_text = parts.join(" ");
  }

  const score_gap_note = buildScoreGapNote(scoreResult?.total_score, satisfactionScore);

  return {
    causes_json: JSON.stringify(causesList),
    analysis_text,
    score_gap_note
  };
}

module.exports = { analyzePostSleep };
