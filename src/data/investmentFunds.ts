export interface FundInfo {
  id: string
  name: string
  ticker: string
  description: string
  avgReturn: string
  accentColor: string
  borderClass: string
  bgClass: string
  textClass: string
}

export const FUNDS: FundInfo[] = [
  {
    id: 'sp500',
    name: 'S&P 500',
    ticker: 'VOO / SPY',
    description: 'Las 500 mayores empresas de EE.UU.',
    avgReturn: '~10.5% histórico',
    accentColor: '#f59e0b',
    borderClass: 'border-amber-500/40',
    bgClass: 'bg-amber-500/10',
    textClass: 'text-amber-300',
  },
  {
    id: 'msci-world',
    name: 'MSCI World',
    ticker: 'IWDA / EUNL',
    description: 'Empresas de 23 países desarrollados',
    avgReturn: '~9.2% histórico',
    accentColor: '#8b5cf6',
    borderClass: 'border-violet-500/40',
    bgClass: 'bg-violet-500/10',
    textClass: 'text-violet-300',
  },
  {
    id: 'nasdaq100',
    name: 'Nasdaq 100',
    ticker: 'QQQ / CNDX',
    description: 'Las 100 mayores tecnológicas de EE.UU.',
    avgReturn: '~14.8% histórico',
    accentColor: '#3b82f6',
    borderClass: 'border-blue-500/40',
    bgClass: 'bg-blue-500/10',
    textClass: 'text-blue-300',
  },
  {
    id: 'ftse-all-world',
    name: 'FTSE All-World',
    ticker: 'VWCE / VWRL',
    description: 'Mercados desarrollados y emergentes',
    avgReturn: '~9.0% histórico',
    accentColor: '#10b981',
    borderClass: 'border-emerald-500/40',
    bgClass: 'bg-emerald-500/10',
    textClass: 'text-emerald-300',
  },
]

export const FUND_MAP: Record<string, FundInfo> = Object.fromEntries(
  FUNDS.map(f => [f.id, f])
)

// Mock annual returns — approximate for educational purposes only
export const HISTORICAL_RETURNS: Record<string, Record<number, number>> = {
  sp500: {
    2005: 0.049, 2006: 0.158, 2007: 0.055, 2008: -0.370, 2009: 0.265,
    2010: 0.151, 2011: 0.021, 2012: 0.160, 2013: 0.324, 2014: 0.137,
    2015: 0.014, 2016: 0.120, 2017: 0.218, 2018: -0.044, 2019: 0.315,
    2020: 0.184, 2021: 0.287, 2022: -0.181, 2023: 0.263, 2024: 0.250,
    2025: 0.095, 2026: 0.025,
  },
  'msci-world': {
    2005: 0.095, 2006: 0.201, 2007: 0.096, 2008: -0.403, 2009: 0.300,
    2010: 0.118, 2011: -0.055, 2012: 0.158, 2013: 0.274, 2014: 0.055,
    2015: 0.007, 2016: 0.082, 2017: 0.224, 2018: -0.087, 2019: 0.277,
    2020: 0.159, 2021: 0.218, 2022: -0.181, 2023: 0.238, 2024: 0.190,
    2025: 0.085, 2026: 0.020,
  },
  nasdaq100: {
    2005: 0.015, 2006: 0.068, 2007: 0.187, 2008: -0.419, 2009: 0.535,
    2010: 0.192, 2011: 0.027, 2012: 0.181, 2013: 0.366, 2014: 0.192,
    2015: 0.097, 2016: 0.070, 2017: 0.327, 2018: -0.010, 2019: 0.380,
    2020: 0.476, 2021: 0.266, 2022: -0.326, 2023: 0.549, 2024: 0.260,
    2025: 0.120, 2026: 0.030,
  },
  'ftse-all-world': {
    2005: 0.110, 2006: 0.210, 2007: 0.100, 2008: -0.410, 2009: 0.300,
    2010: 0.130, 2011: -0.070, 2012: 0.170, 2013: 0.270, 2014: 0.050,
    2015: -0.003, 2016: 0.090, 2017: 0.230, 2018: -0.090, 2019: 0.280,
    2020: 0.160, 2021: 0.200, 2022: -0.190, 2023: 0.220, 2024: 0.180,
    2025: 0.080, 2026: 0.020,
  },
}
