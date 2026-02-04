export const calculateAcceptanceChance = (profile, university) => {
  let score = 0;
  const maxScore = 100;

  // Academic score (40 points)
  const academicScore = profile.gpa
    ? (profile.gpa / 10) * 100
    : profile.percentage || 0;
  if (academicScore >= 80) score += 40;
  else if (academicScore >= 70) score += 30;
  else if (academicScore >= 60) score += 20;
  else score += 10;

  // Test scores (30 points)
  if (profile.englishTest?.status === "Completed") score += 15;
  if (profile.standardizedTest?.status === "Completed") score += 15;

  // Documents (20 points)
  if (profile.sopStatus === "Ready" || profile.sopStatus === "Review")
    score += 10;
  if (profile.lorStatus === "Completed") score += 10;

  // Work experience (10 points)
  if (
    profile.workExperience?.hasExperience &&
    profile.workExperience.years > 0
  ) {
    score += Math.min(profile.workExperience.years * 2, 10);
  }

  // Compare with university acceptance rate
  const universityRate = university.acceptanceRate || 50;
  const adjustedScore = (score / maxScore) * 100;

  // Determine chance
  if (adjustedScore >= universityRate + 20) return "High";
  if (adjustedScore >= universityRate - 10) return "Medium";
  return "Low";
};

// Categorize university (Dream/Target/Safe)
export const categorizeUniversity = (profile, university, acceptanceChance) => {
  const universityRate = university.acceptanceRate || 50;
  const profileScore = profile.profileStrength?.overall || 0;

  if (universityRate < 20 || acceptanceChance === "Low") return "Dream";
  if (acceptanceChance === "High" || universityRate > 70) return "Safe";
  return "Target";
};

// Determine cost level
export const determineCostLevel = (universityCost, profileBudget) => {
  const avgCost =
    (universityCost.tuitionPerYear.min + universityCost.tuitionPerYear.max) / 2;
  const avgBudget = (profileBudget.min + profileBudget.max) / 2;

  if (avgCost <= avgBudget * 0.7) return "Low";
  if (avgCost <= avgBudget) return "Medium";
  return "High";
};

// Identify risks
export const identifyRisks = (
  profile,
  university,
  acceptanceChance,
  costLevel,
) => {
  const risks = [];

  if (acceptanceChance === "Low") {
    risks.push("Low acceptance chance based on your profile");
  }

  if (costLevel === "High") {
    risks.push("Tuition exceeds your stated budget");
  }

  if (profile.englishTest?.status !== "Completed") {
    risks.push("English test not completed - required for application");
  }

  if (profile.sopStatus === "Not Started") {
    risks.push("Statement of Purpose not started");
  }

  const universityRate = university.acceptanceRate || 50;
  if (universityRate < 15) {
    risks.push("Highly competitive university - very selective admission");
  }

  return risks;
};
