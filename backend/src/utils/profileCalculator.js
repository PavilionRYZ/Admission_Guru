export const calculateProfileStrength = (profile) => {
  let academicScore = 0;
  let examScore = 0;
  let documentScore = 0;

  // Academic scoring (40%)
  if (profile.gpa || profile.percentage) {
    const score = profile.gpa ? (profile.gpa / 10) * 100 : profile.percentage;
    if (score >= 80) academicScore = 100;
    else if (score >= 70) academicScore = 75;
    else if (score >= 60) academicScore = 50;
    else academicScore = 25;
  }

  // Exam scoring (30%)
  const englishComplete = profile.englishTest?.status === "Completed";
  const standardComplete = profile.standardizedTest?.status === "Completed";
  if (englishComplete && standardComplete) examScore = 100;
  else if (englishComplete || standardComplete) examScore = 50;

  // Document scoring (30%)
  const sopReady =
    profile.sopStatus === "Ready" || profile.sopStatus === "Review";
  const lorComplete = profile.lorStatus === "Completed";
  if (sopReady && lorComplete) documentScore = 100;
  else if (sopReady || lorComplete) documentScore = 50;

  // Overall score
  const overall = Math.round(
    academicScore * 0.4 + examScore * 0.3 + documentScore * 0.3,
  );

  return {
    overall,
    academic: academicScore,
    exam: examScore,
    document: documentScore,
  };
};
