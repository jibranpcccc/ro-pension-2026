// Official 2026 Romanian pension calculation formulas (Law 360/2023, OUG 156/2024, Law 141/2025, Law 44/2026)

export const OFFICIAL_VPR_2026 = 81;
export const AVERAGE_GROSS_SALARY_2026 = 9192;
export const MINIMUM_PENSION_2026 = 1281;
export const MINIMUM_WAGE_2026 = 4050;
export const MINIMUM_CONTRIBUTION_YEARS = 15;
export const STANDARD_RETIREMENT_AGE_MALE = 65;
export const STANDARD_RETIREMENT_AGE_FEMALE = 63;

/**
 * Compute net monthly pension after 2026 CASS (10% above 3,000 Lei)
 * and 10% income tax on the taxable remainder above 3,000 Lei.
 */
export function estimateNetPension2026(grossPension) {
  const roundedGross = Math.round(grossPension);
  if (roundedGross <= 3000) return roundedGross;
  const cass = (roundedGross - 3000) * 0.1;
  const taxableAfterCass = roundedGross - cass;
  const incomeTax = taxableAfterCass > 3000 ? (taxableAfterCass - 3000) * 0.1 : 0;
  return Math.round(roundedGross - cass - incomeTax);
}

/**
 * Stability points under Art. 85 of Law 360/2023 for contributory years > 25.
 * +0.50/yr (years 26-30), +0.75/yr (years 31-35), +1.00/yr (> 35 years).
 */
export function calculateStabilityPoints(totalContributionYears) {
  if (totalContributionYears <= 25) return 0;
  const extraYears = totalContributionYears - 25;
  if (extraYears <= 5) return extraYears * 0.5;
  if (extraYears <= 10) return 5 * 0.5 + (extraYears - 5) * 0.75;
  return 5 * 0.5 + 5 * 0.75 + (extraYears - 10) * 1.0;
}

export function calculateStandardPension({
  currentAge,
  monthlyIncome,
  incomeType = "net",
  contributionYears,
  retirementAge,
  assimilatedYears = 0,
}) {
  const futureYears = Math.max(0, retirementAge - currentAge);
  const totalContributionYears = contributionYears + futureYears;

  if (totalContributionYears < MINIMUM_CONTRIBUTION_YEARS) {
    throw new Error(`Minimum contributory stage is ${MINIMUM_CONTRIBUTION_YEARS} years`);
  }

  const grossMonthlySalary = incomeType === "gross" ? monthlyIncome : monthlyIncome / 0.585;
  const pointsPerYear = grossMonthlySalary / AVERAGE_GROSS_SALARY_2026;
  const contributoryPoints = pointsPerYear * totalContributionYears;
  const stabilityPoints = calculateStabilityPoints(totalContributionYears);
  const assimilatedPoints = assimilatedYears * 0.25;
  const totalPoints = contributoryPoints + stabilityPoints + assimilatedPoints;

  const monthlyPension = Math.round(Math.max(totalPoints * OFFICIAL_VPR_2026, MINIMUM_PENSION_2026));
  const netMonthlyPension = estimateNetPension2026(monthlyPension);

  return {
    monthlyPension,
    netMonthlyPension,
    totalPoints: parseFloat(totalPoints.toFixed(4)),
    contributoryPoints: parseFloat(contributoryPoints.toFixed(4)),
    stabilityPoints: parseFloat(stabilityPoints.toFixed(4)),
    assimilatedPoints: parseFloat(assimilatedPoints.toFixed(4)),
  };
}

export function calculateEarlyRetirement({
  currentAge,
  gender,
  monthlyIncome,
  incomeType = "net",
  contributionYears,
  earlyRetirementAge,
}) {
  const standardAge = gender === "male" ? STANDARD_RETIREMENT_AGE_MALE : STANDARD_RETIREMENT_AGE_FEMALE;
  const monthsEarly = (standardAge - earlyRetirementAge) * 12;
  const requiredYears = gender === "male" ? 35 : 33;
  const futureYears = Math.max(0, earlyRetirementAge - currentAge);
  const totalYears = contributionYears + futureYears;

  if (totalYears < requiredYears) {
    throw new Error(`Full contributory stage of ${requiredYears} years is required`);
  }
  if (monthsEarly <= 0) {
    throw new Error("Early retirement age must be below standard retirement age");
  }

  const standardResult = calculateStandardPension({
    currentAge,
    monthlyIncome,
    incomeType,
    contributionYears,
    retirementAge: earlyRetirementAge,
  });

  const exceedYears = totalYears - requiredYears;
  let penaltyRate = 0.4;
  if (exceedYears >= 8) penaltyRate = 0.0;
  else if (exceedYears >= 5) penaltyRate = 0.15;
  else if (exceedYears >= 4) penaltyRate = 0.2;
  else if (exceedYears >= 3) penaltyRate = 0.25;
  else if (exceedYears >= 2) penaltyRate = 0.3;
  else if (exceedYears >= 1) penaltyRate = 0.35;

  const penaltyPercentage = Number((monthsEarly * penaltyRate).toFixed(2));
  const earlyPensionGross = standardResult.monthlyPension * (1 - penaltyPercentage / 100);
  const earlyPension = Math.round(Math.max(earlyPensionGross, MINIMUM_PENSION_2026));

  return {
    earlyPension,
    netEarlyPension: estimateNetPension2026(earlyPension),
    standardPension: standardResult.monthlyPension,
    penaltyPercentage,
    monthsEarly,
    penaltyRate,
  };
}
