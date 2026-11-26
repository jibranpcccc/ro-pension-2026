# ro-pension-2026

Open-source JavaScript/TypeScript reference implementation of the **2026 Romanian Pension Formula** (Legea nr. 360/2023, OUG nr. 156/2024, Legea nr. 141/2025, Legea nr. 44/2026).

Extracted and maintained as a zero-dependency library powering [CalculatorPensie.com](https://calculatorpensie.com/).

## Key 2026 Statutory Parameters

| Parameter | Official 2026 Value | Legal Basis |
|---|---:|---|
| Reference Point Value (**VPR**) | `81 Lei` | OUG 156/2024 & Legea 141/2025 |
| Budgetary Average Gross Wage | `9.192 Lei` | Legea 44/2026 |
| Minimum Social Pension | `1.281 Lei/month` | CNPP 2026 |
| Net Tax Exemption Threshold | `3.000 Lei` | `10% CASS + 10%` tax on excess |
| Stability Points (`Art. 85`) | `+0.50 / +0.75 / +1.00 / yr` | Contributory years `> 25 / > 30 / > 35` |

## Usage

```js
import {
  calculateStabilityPoints,
  estimateNetPension2026,
  calculateStandardPension,
} from "./index.mjs";

console.log(calculateStabilityPoints(40)); // 11.25 points (+911 Lei/mo gross at VPR 81)
console.log(estimateNetPension2026(5000)); // 4620 Lei net (-200 CASS, -180 income tax)
```

## Full Interactive Tools & Resources

- [Main Gross & Net Pension Simulator](https://calculatorpensie.com/)
- [Early Retirement Penalty Calculator](https://calculatorpensie.com/calculator-pensie-anticipata/)
- [Annex 5 Retirement Age Schedule](https://calculatorpensie.com/calculator-varsta-pensionare/)
- [Stability Points & VPR Breakdown](https://calculatorpensie.com/calculator-puncte-pensie/)
- [Downloadable Excel CSV Template](https://calculatorpensie.com/program-excel-calcul-pensie/)
- [Mathematical Methodology & Legal Sources](https://calculatorpensie.com/metodologie/)

## Running Tests

```bash
npm test
```

## Live Interactive GitHub Pages Demo

Try the formula reference demo at `https://jibranpcccc.github.io/ro-pension-2026/` or run the full suite on `calculatorpensie.com`.
