import { HISTORICAL_RETURNS } from '../data/investmentFunds'

// Simulation "today" — all projections end here
export const SIM_TODAY = { year: 2026, month: 6 } as const

export interface DataPoint {
  year: number
  month: number
  totalInvested: number
  portfolioValue: number
}

export interface SimulationResult {
  dataPoints: DataPoint[]
  totalInvested: number
  finalValue: number
  gainLoss: number
  returnPct: number
  months: number
}

function afterToday(year: number, month: number): boolean {
  return year > SIM_TODAY.year || (year === SIM_TODAY.year && month > SIM_TODAY.month)
}

export function runSimulation(
  fundId: string,
  monthlyContrib: number,
  startYear: number,
  startMonth: number,        // 1–12
  customAnnualReturn: number | null  // null → use historical mock data
): SimulationResult {
  const historical = HISTORICAL_RETURNS[fundId] ?? {}
  const dataPoints: DataPoint[] = []

  let portfolioValue = 0
  let totalInvested = 0
  let year = startYear
  let month = startMonth

  while (!afterToday(year, month)) {
    const annualReturn =
      customAnnualReturn !== null ? customAnnualReturn : (historical[year] ?? 0.07)
    const monthlyReturn = Math.pow(1 + annualReturn, 1 / 12) - 1

    totalInvested += monthlyContrib
    portfolioValue = (portfolioValue + monthlyContrib) * (1 + monthlyReturn)

    dataPoints.push({
      year,
      month,
      totalInvested: Math.round(totalInvested),
      portfolioValue: Math.round(portfolioValue),
    })

    month++
    if (month > 12) { month = 1; year++ }
  }

  const finalValue = Math.round(portfolioValue)
  const invested = Math.round(totalInvested)
  const gainLoss = finalValue - invested
  const returnPct = invested > 0 ? (gainLoss / invested) * 100 : 0

  return { dataPoints, totalInvested: invested, finalValue, gainLoss, returnPct, months: dataPoints.length }
}
