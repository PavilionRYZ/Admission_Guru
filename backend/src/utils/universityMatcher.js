import {
  calculateAcceptanceChance,
  categorizeUniversity,
  determineCostLevel,
  identifyRisks,
} from "../services/profileAnalysisService.js";

// Match universities to profile
export const matchUniversitiesToProfile = (universities, profile) => {
  const matched = universities.map((university) => {
    const acceptanceChance = calculateAcceptanceChance(profile, university);
    const category = categorizeUniversity(
      profile,
      university,
      acceptanceChance,
    );
    const costLevel = determineCostLevel(
      university.cost,
      profile.budgetPerYear,
    );
    const risks = identifyRisks(
      profile,
      university,
      acceptanceChance,
      costLevel,
    );

    // Calculate match score
    let matchScore = 0;

    // Budget match (30 points)
    const avgCost =
      (university.cost.tuitionPerYear.min +
        university.cost.tuitionPerYear.max) /
      2;
    if (avgCost <= profile.budgetPerYear.max) {
      if (avgCost <= profile.budgetPerYear.max * 0.8) matchScore += 30;
      else matchScore += 20;
    }

    // Field match (25 points)
    const hasMatchingField = university.popularFields?.some((field) =>
      field.toLowerCase().includes(profile.fieldOfStudy.toLowerCase()),
    );
    if (hasMatchingField) matchScore += 25;

    // Acceptance chance (25 points)
    if (acceptanceChance === "High") matchScore += 25;
    else if (acceptanceChance === "Medium") matchScore += 15;
    else matchScore += 5;

    // Profile strength (20 points)
    matchScore += (profile.profileStrength?.overall || 0) * 0.2;

    return {
      university,
      acceptanceChance,
      category,
      costLevel,
      risks,
      matchScore: Math.round(matchScore),
    };
  });

  // Sort by match score
  return matched.sort((a, b) => b.matchScore - a.matchScore);
};
