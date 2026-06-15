export interface AdvisorRecommendation {
  title: string
  impact: 'alto' | 'medio' | 'bajo'
  action: string
  reason: string
  estimated_benefit: string
  timeframe: string
}

export interface AdvisorAnalysis {
  summary: string
  strengths: string[]
  risks: string[]
  recommendations: AdvisorRecommendation[]
  next_best_action: string
}
