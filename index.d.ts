export const OFFICIAL_VPR_2026: number;
export const AVERAGE_GROSS_SALARY_2026: number;
export const MINIMUM_PENSION_2026: number;
export const MINIMUM_WAGE_2026: number;
export const MINIMUM_CONTRIBUTION_YEARS: number;
export const STANDARD_RETIREMENT_AGE_MALE: number;
export const STANDARD_RETIREMENT_AGE_FEMALE: number;

export function estimateNetPension2026(grossPension: number): number;
export function calculateStabilityPoints(totalContributionYears: number): number;
export function calculateStandardPension(input: {
  currentAge: number;
  monthlyIncome: number;
  incomeType?: "net" | "gross";
  contributionYears: number;
  retirementAge: number;
  assimilatedYears?: number;
}): {
  monthlyPension: number;
  netMonthlyPension: number;
  totalPoints: number;
  contributoryPoints: number;
  stabilityPoints: number;
  assimilatedPoints: number;
};
export function calculateEarlyRetirement(input: {
  currentAge: number;
  gender: "male" | "female";
  monthlyIncome: number;
  incomeType?: "net" | "gross";
  contributionYears: number;
  earlyRetirementAge: number;
}): {
  earlyPension: number;
  netEarlyPension: number;
  standardPension: number;
  penaltyPercentage: number;
  monthsEarly: number;
  penaltyRate: number;
};
