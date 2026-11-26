import test from "node:test";
import assert from "node:assert/strict";
import {
  OFFICIAL_VPR_2026,
  AVERAGE_GROSS_SALARY_2026,
  calculateStabilityPoints,
  estimateNetPension2026,
  calculateStandardPension,
  calculateEarlyRetirement,
} from "./index.mjs";

test("2026 statutory constants", () => {
  assert.equal(OFFICIAL_VPR_2026, 81);
  assert.equal(AVERAGE_GROSS_SALARY_2026, 9192);
});

test("Art. 85 stability points bands", () => {
  assert.equal(calculateStabilityPoints(25), 0);
  assert.equal(calculateStabilityPoints(30), 2.5);
  assert.equal(calculateStabilityPoints(35), 6.25);
  assert.equal(calculateStabilityPoints(40), 11.25);
});

test("2026 CASS 10% and income tax 10% above 3000 Lei", () => {
  assert.equal(estimateNetPension2026(3000), 3000);
  assert.equal(estimateNetPension2026(3500), 3405);
  assert.equal(estimateNetPension2026(5000), 4620);
  assert.equal(estimateNetPension2026(7000), 6240);
  assert.equal(estimateNetPension2026(10000), 8670);
});

test("Standard pension and early retirement penalty calculations", () => {
  const std = calculateStandardPension({
    currentAge: 35,
    monthlyIncome: 9192,
    incomeType: "gross",
    contributionYears: 10,
    retirementAge: 65,
  });
  assert.equal(std.totalPoints, 51.25);
  assert.equal(std.monthlyPension, Math.round(51.25 * 81));

  const early = calculateEarlyRetirement({
    currentAge: 55,
    gender: "male",
    monthlyIncome: 9192,
    incomeType: "gross",
    contributionYears: 30,
    earlyRetirementAge: 62,
  });
  assert.equal(early.monthsEarly, 36);
  assert.equal(early.penaltyRate, 0.3);
  assert.equal(early.penaltyPercentage, 10.8);
});
