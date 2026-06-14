export interface User {
  id: string
  name: string
  email: string
  plan: 'free' | 'pro' | 'enterprise'
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface Transaction {
  id: string
  name: string
  category: string
  amount: number
  date: string
  type: 'income' | 'expense'
}

export interface FinancialSummary {
  income: number
  expenses: number
  savings: number
  balance: number
  currency: string
}
