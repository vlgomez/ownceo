import type { DataPoint } from '../../utils/simulatorEngine'

interface Props {
  dataPoints: DataPoint[]
  accentColor: string
}

// Fixed SVG coordinate space
const CL = 62, CR = 694, CT = 12, CB = 248
const CW = CR - CL   // 632
const CH = CB - CT   // 236

function fmtY(n: number): string {
  if (n >= 1_000_000) return `€${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `€${Math.round(n / 1_000)}k`
  return `€${Math.round(n)}`
}

function xAt(i: number, n: number): number {
  return n <= 1 ? CL : CL + (i / (n - 1)) * CW
}

function yAt(v: number, maxV: number): number {
  return maxV === 0 ? CB : CT + (1 - v / maxV) * CH
}

export default function SimulatorChart({ dataPoints, accentColor }: Props) {
  if (dataPoints.length < 2) return null

  const n = dataPoints.length
  const maxPortfolio = Math.max(...dataPoints.map(d => d.portfolioValue))
  const maxV = maxPortfolio * 1.06   // 6% visual headroom

  // Build SVG path strings
  let portfolioD = ''
  let investedD = ''

  dataPoints.forEach((d, i) => {
    const x = xAt(i, n).toFixed(1)
    const cmd = i === 0 ? 'M' : 'L'
    portfolioD += `${cmd}${x},${yAt(d.portfolioValue, maxV).toFixed(1)} `
    investedD  += `${cmd}${x},${yAt(d.totalInvested,  maxV).toFixed(1)} `
  })

  // Closed area path (portfolio fill)
  const lastX = xAt(n - 1, n).toFixed(1)
  const areaD = `${portfolioD} L${lastX},${CB} L${CL},${CB} Z`

  // Y-axis gridlines (4 bands)
  const yGrid = [0, 0.25, 0.5, 0.75, 1].map(f => ({
    y: CT + (1 - f) * CH,
    label: fmtY(f * maxV),
  }))

  // X-axis year labels
  const yearSpan = n / 12
  const step = yearSpan <= 3 ? 1 : yearSpan <= 8 ? 2 : 5
  const xLabels: { x: number; label: string }[] = []
  dataPoints.forEach((d, i) => {
    if (d.month === 1 && d.year % step === 0) {
      xLabels.push({ x: xAt(i, n), label: String(d.year) })
    }
  })
  // Always show the final year
  const last = dataPoints[n - 1]
  if (!xLabels.some(l => l.label === String(last.year))) {
    xLabels.push({ x: xAt(n - 1, n), label: String(last.year) })
  }

  return (
    <svg
      viewBox="0 0 700 280"
      className="w-full"
      preserveAspectRatio="xMidYMid meet"
      style={{ minHeight: 180 }}
    >
      <defs>
        <linearGradient id="simAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.30" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="simInvestedArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#334155" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#334155" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Horizontal grid lines + y-axis labels */}
      {yGrid.map((g, i) => (
        <g key={i}>
          <line x1={CL} y1={g.y} x2={CR} y2={g.y} stroke="#1e293b" strokeWidth="1" />
          <text x={CL - 7} y={g.y + 4} textAnchor="end" fill="#475569" fontSize="11">
            {g.label}
          </text>
        </g>
      ))}

      {/* Vertical axis */}
      <line x1={CL} y1={CT} x2={CL} y2={CB} stroke="#1e293b" strokeWidth="1" />

      {/* Invested area (subtle background) */}
      <path
        d={`${investedD} L${lastX},${CB} L${CL},${CB} Z`}
        fill="url(#simInvestedArea)"
      />

      {/* Portfolio gradient fill */}
      <path d={areaD} fill="url(#simAreaGrad)" />

      {/* Invested line — dashed slate */}
      <path
        d={investedD}
        fill="none"
        stroke="#475569"
        strokeWidth="1.5"
        strokeDasharray="5 3"
      />

      {/* Portfolio value line */}
      <path
        d={portfolioD}
        fill="none"
        stroke={accentColor}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Final value dot */}
      <circle
        cx={xAt(n - 1, n)}
        cy={yAt(last.portfolioValue, maxV)}
        r="5"
        fill={accentColor}
        stroke="#020617"
        strokeWidth="2.5"
      />

      {/* X-axis year labels */}
      {xLabels.map((l, i) => (
        <text key={i} x={l.x} y={CB + 18} textAnchor="middle" fill="#475569" fontSize="11">
          {l.label}
        </text>
      ))}
    </svg>
  )
}
