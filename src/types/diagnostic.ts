export type ProfileType = 'Impulsivo' | 'Ahorrador' | 'Estratega' | 'Inversor'

export type DiagnosticPhase = 'test' | 'form' | 'result'

export interface Question {
  id: number
  category: string
  text: string
  options: Array<{ text: string; points: number }>
}

export interface FinancialData {
  income: number
  fixedExpenses: number
  variableExpenses: number
  monthlySavings: number
  monthlyInvestment: number
  debt: number
}

export interface DiagnosticResult {
  testScore: number
  healthScore: number
  profile: ProfileType
  financialData: FinancialData
  savingsRate: number
  expenseRatio: number
  investmentRate: number
  availableBalance: number
  recommendations: string[]
  completedAt: string
}
