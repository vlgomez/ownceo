const ANNUAL_RETURN = 0.07
const MONTHLY_RETURN = Math.pow(1 + ANNUAL_RETURN, 1 / 12) - 1

export interface Projection {
  years: number
  savings: number          // accumulated savings at 0% return
  investedCapital: number  // total put into investment
  investmentGains: number  // compound-interest gains
  investmentTotal: number  // investedCapital + investmentGains
  total: number            // savings + investmentTotal
  totalContributed: number // savings + investedCapital (money actually put in)
}

function fvContrib(monthly: number, months: number): number {
  if (monthly <= 0 || months === 0) return 0
  return monthly * ((Math.pow(1 + MONTHLY_RETURN, months) - 1) / MONTHLY_RETURN)
}

export function buildProjections(monthlySavings: number, monthlyInvestment: number): Projection[] {
  return [1, 5, 10, 20].map(years => {
    const months = years * 12
    const savings = Math.round(monthlySavings * months)
    const investedCapital = Math.round(monthlyInvestment * months)
    const investmentTotal = Math.round(fvContrib(monthlyInvestment, months))
    const investmentGains = investmentTotal - investedCapital
    const total = savings + investmentTotal
    const totalContributed = savings + investedCapital
    return { years, savings, investedCapital, investmentGains, investmentTotal, total, totalContributed }
  })
}
