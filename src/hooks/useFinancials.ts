import { useState, useEffect } from 'react'
import type { FinancialSummary, Transaction } from '../types'

// Placeholder hook — replace with real data fetching when backend is ready
export function useFinancials() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setSummary({ income: 4250, expenses: 2840, savings: 1410, balance: 12380, currency: 'USD' })
      setTransactions([])
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return { summary, transactions, loading }
}
