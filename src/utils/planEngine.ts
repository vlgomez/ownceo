import type { DiagnosticResult, ProfileType } from '../types/diagnostic'

export interface FinancialGoal {
  id: string
  title: string
  description: string
  currentLabel: string
  targetLabel: string
  progress: number                             // 0-100
  status: 'achieved' | 'close' | 'needs_work'
  actionText: string
}

export interface RoadmapTask {
  text: string
  priority: 'high' | 'medium' | 'low'
}

export interface RoadmapMonth {
  month: number
  title: string
  theme: string
  headerClass: string
  badgeClass: string
  tasks: RoadmapTask[]
}

export interface FinancialPlan {
  overallProgress: number
  achievedCount: number
  goals: FinancialGoal[]
  roadmap: RoadmapMonth[]
}

// ------- helpers --------------------------------------------------------

function goalStatus(p: number): 'achieved' | 'close' | 'needs_work' {
  if (p >= 100) return 'achieved'
  if (p >= 50) return 'close'
  return 'needs_work'
}

function fmtK(n: number): string {
  return `€${Math.abs(n).toLocaleString('es-ES', { maximumFractionDigits: 0 })}`
}

// Estimated emergency-fund completion by profile (rough heuristic, no balance data)
const EMERGENCY_PROGRESS: Record<ProfileType, number> = {
  Impulsivo: 5,
  Ahorrador: 35,
  Estratega: 70,
  Inversor: 100,
}

// ------- roadmap data ---------------------------------------------------

type RoadmapTemplate = Omit<RoadmapMonth, 'month'>[]

const ROADMAPS: Record<ProfileType, RoadmapTemplate> = {
  Impulsivo: [
    {
      title: 'Mes 1', theme: 'Toma de conciencia',
      headerClass: 'border-slate-700 bg-slate-800/60',
      badgeClass: 'bg-slate-700 text-slate-300',
      tasks: [
        { text: 'Registra todos tus gastos sin excepción durante 30 días', priority: 'high' },
        { text: 'Identifica y cancela 2 suscripciones que no usas este mes', priority: 'high' },
        { text: 'Abre una cuenta bancaria separada exclusivamente para ahorros', priority: 'high' },
        { text: 'Configura una transferencia automática fija el día de cobro', priority: 'medium' },
      ],
    },
    {
      title: 'Mes 2', theme: 'Primeros hábitos',
      headerClass: 'border-violet-700/50 bg-violet-900/25',
      badgeClass: 'bg-violet-800/50 text-violet-300',
      tasks: [
        { text: 'Aplica el presupuesto 50/30/20 con los datos del mes anterior', priority: 'high' },
        { text: 'Practica la regla de 48 h antes de cualquier compra no planificada', priority: 'high' },
        { text: 'Revisa tus gastos cada domingo — solo 10 minutos', priority: 'medium' },
        { text: 'Empieza a reducir o pagar deudas de consumo si las tienes', priority: 'medium' },
      ],
    },
    {
      title: 'Mes 3', theme: 'Consolidación',
      headerClass: 'border-emerald-700/50 bg-emerald-900/20',
      badgeClass: 'bg-emerald-800/50 text-emerald-300',
      tasks: [
        { text: 'Aumenta tu ahorro automático en €25-50 adicionales', priority: 'high' },
        { text: 'Define tu primer objetivo financiero con fecha y cantidad exacta', priority: 'high' },
        { text: 'Aprende qué es un fondo indexado y cómo empezar con €50', priority: 'medium' },
        { text: 'Evalúa tu progreso y ajusta el presupuesto para el próximo trimestre', priority: 'low' },
      ],
    },
  ],
  Ahorrador: [
    {
      title: 'Mes 1', theme: 'Activar el dinero',
      headerClass: 'border-slate-700 bg-slate-800/60',
      badgeClass: 'bg-slate-700 text-slate-300',
      tasks: [
        { text: 'Mueve tu fondo de emergencia a una cuenta remunerada (>3% TAE)', priority: 'high' },
        { text: 'Investiga fondos indexados globales: MSCI World y S&P 500', priority: 'high' },
        { text: 'Abre cuenta en un bróker o gestora (Indexa, MyInvestor, Finanbest)', priority: 'high' },
        { text: 'Define 2 objetivos financieros con fecha y cantidad exacta', priority: 'medium' },
      ],
    },
    {
      title: 'Mes 2', theme: 'Primera inversión',
      headerClass: 'border-violet-700/50 bg-violet-900/25',
      badgeClass: 'bg-violet-800/50 text-violet-300',
      tasks: [
        { text: 'Haz tu primera aportación a un fondo indexado — aunque sean €50', priority: 'high' },
        { text: 'Automatiza la aportación el día de cobro para no depender de la disciplina', priority: 'high' },
        { text: 'Calcula tu número FIRE básico: 25 × tus gastos anuales', priority: 'medium' },
        { text: 'Verifica que tu fondo de emergencia cubre 3-6 meses de gastos', priority: 'medium' },
      ],
    },
    {
      title: 'Mes 3', theme: 'Crecimiento',
      headerClass: 'border-emerald-700/50 bg-emerald-900/20',
      badgeClass: 'bg-emerald-800/50 text-emerald-300',
      tasks: [
        { text: 'Incrementa tu aportación mensual a inversión al menos un 10%', priority: 'high' },
        { text: 'Calcula tu patrimonio neto y fija una meta para 12 meses', priority: 'medium' },
        { text: 'Considera un plan de pensiones para reducir tu base imponible', priority: 'medium' },
        { text: 'Lee sobre interés compuesto y el impacto de invertir 10 años antes', priority: 'low' },
      ],
    },
  ],
  Estratega: [
    {
      title: 'Mes 1', theme: 'Optimización',
      headerClass: 'border-slate-700 bg-slate-800/60',
      badgeClass: 'bg-slate-700 text-slate-300',
      tasks: [
        { text: 'Revisa tu asset allocation: ¿encaja con tu horizonte temporal?', priority: 'high' },
        { text: 'Calcula tu número FIRE exacto y fija una fecha objetivo real', priority: 'high' },
        { text: 'Maximiza la aportación al plan de pensiones para reducir IRPF', priority: 'high' },
        { text: 'Identifica una fuente de ingresos adicionales para desarrollar este año', priority: 'medium' },
      ],
    },
    {
      title: 'Mes 2', theme: 'Escala',
      headerClass: 'border-violet-700/50 bg-violet-900/25',
      badgeClass: 'bg-violet-800/50 text-violet-300',
      tasks: [
        { text: 'Aumenta tu tasa de ahorro al 30% si aún no has llegado', priority: 'high' },
        { text: 'Diversifica geográficamente: exposición a EEUU, Europa y emergentes', priority: 'medium' },
        { text: 'Estudia la regla del 4% y cómo aplica a tu situación concreta', priority: 'medium' },
        { text: 'Asegúrate de que tu liquidez está bien remunerada', priority: 'low' },
      ],
    },
    {
      title: 'Mes 3', theme: 'Aceleración',
      headerClass: 'border-emerald-700/50 bg-emerald-900/20',
      badgeClass: 'bg-emerald-800/50 text-emerald-300',
      tasks: [
        { text: 'Implementa un rebalanceo trimestral de tu cartera de inversión', priority: 'high' },
        { text: 'Analiza las principales categorías de gasto y optimiza fiscalmente', priority: 'medium' },
        { text: 'Define un plan concreto de ingresos alternativos para el próximo año', priority: 'medium' },
        { text: 'Revisa tu planificación patrimonial básica y actualiza beneficiarios', priority: 'low' },
      ],
    },
  ],
  Inversor: [
    {
      title: 'Mes 1', theme: 'Eficiencia fiscal',
      headerClass: 'border-slate-700 bg-slate-800/60',
      badgeClass: 'bg-slate-700 text-slate-300',
      tasks: [
        { text: 'Audita la eficiencia fiscal de tu cartera: ETFs vs fondos, plusvalías latentes', priority: 'high' },
        { text: 'Analiza la concentración por activo — ninguno debe superar el 20%', priority: 'high' },
        { text: 'Evalúa si una sociedad patrimonial es fiscalmente ventajosa en tu caso', priority: 'medium' },
        { text: 'Calcula tu rentabilidad real neta de inflación en los últimos 12 meses', priority: 'medium' },
      ],
    },
    {
      title: 'Mes 2', theme: 'Diversificación avanzada',
      headerClass: 'border-violet-700/50 bg-violet-900/25',
      badgeClass: 'bg-violet-800/50 text-violet-300',
      tasks: [
        { text: 'Evalúa exposición a activos alternativos: REITs, materias primas', priority: 'medium' },
        { text: 'Revisa tu asset allocation frente a tu horizonte temporal actualizado', priority: 'high' },
        { text: 'Optimiza la remuneración de tu liquidez en fondos monetarios', priority: 'medium' },
        { text: 'Planifica y ejecuta el rebalanceo trimestral si la desviación supera el 5%', priority: 'high' },
      ],
    },
    {
      title: 'Mes 3', theme: 'Patrimonio a largo plazo',
      headerClass: 'border-emerald-700/50 bg-emerald-900/20',
      badgeClass: 'bg-emerald-800/50 text-emerald-300',
      tasks: [
        { text: 'Define o actualiza tu plan de transmisión patrimonial', priority: 'high' },
        { text: 'Establece un sistema de revisión trimestral formal con KPIs financieros', priority: 'high' },
        { text: 'Evalúa la diversificación de divisas y cobertura de riesgo cambiario', priority: 'medium' },
        { text: 'Fija tu próxima meta patrimonial con fecha y estrategia de consecución', priority: 'medium' },
      ],
    },
  ],
}

// ------- main export ----------------------------------------------------

export function buildPlan(result: DiagnosticResult): FinancialPlan {
  const { financialData, savingsRate, expenseRatio, investmentRate, profile } = result
  const { income, fixedExpenses, variableExpenses, monthlySavings, monthlyInvestment } = financialData
  const totalExpenses = fixedExpenses + variableExpenses

  // --- Goal 1: Savings rate (target ≥20%) ---
  const savingsProgress = income > 0 ? Math.min(100, Math.round((savingsRate / 20) * 100)) : 0
  const savingsGap = Math.max(0, Math.round(income * 0.2 - monthlySavings))

  // --- Goal 2: Investment rate (target ≥10%) ---
  const investmentProgress = income > 0 ? Math.min(100, Math.round((investmentRate / 10) * 100)) : 0
  const investmentGap = Math.max(0, Math.round(income * 0.1 - monthlyInvestment))

  // --- Goal 3: Expense ratio (target ≤70%) ---
  const expenseProgress =
    totalExpenses === 0 || income === 0
      ? 100
      : expenseRatio <= 70
      ? 100
      : Math.max(0, Math.round((70 / expenseRatio) * 100))
  const expenseReduction = Math.max(0, Math.round(totalExpenses - income * 0.7))

  // --- Goal 4: Emergency fund (target = 3 × monthly expenses) ---
  const emergencyTarget = totalExpenses * 3
  const emergencyProgress = EMERGENCY_PROGRESS[profile]
  const estimatedSaved = Math.round(emergencyTarget * emergencyProgress / 100)
  const remaining = Math.max(0, emergencyTarget - estimatedSaved)
  const monthsLeft = monthlySavings > 0 ? Math.ceil(remaining / monthlySavings) : null

  const goals: FinancialGoal[] = [
    {
      id: 'savings',
      title: 'Tasa de ahorro',
      description: 'Porcentaje de tus ingresos que ahorras cada mes.',
      currentLabel: `${savingsRate.toFixed(1)}%`,
      targetLabel: '20%',
      progress: savingsProgress,
      status: goalStatus(savingsProgress),
      actionText:
        savingsProgress >= 100
          ? '¡Objetivo alcanzado! Mantén el ritmo.'
          : savingsGap > 0
          ? `Aumenta €${savingsGap}/mes tu ahorro automático`
          : 'Empieza apartando cualquier cantidad fija',
    },
    {
      id: 'investment',
      title: 'Tasa de inversión',
      description: 'Porcentaje de ingresos invertidos mensualmente.',
      currentLabel: `${investmentRate.toFixed(1)}%`,
      targetLabel: '10%',
      progress: investmentProgress,
      status: goalStatus(investmentProgress),
      actionText:
        investmentProgress >= 100
          ? '¡Objetivo alcanzado! Revisa tu portfolio.'
          : investmentGap > 0
          ? `Empieza o incrementa en €${investmentGap}/mes en fondos indexados`
          : 'Configura tu primera aportación automática',
    },
    {
      id: 'expenses',
      title: 'Control de gastos',
      description: 'Ratio de gastos sobre ingresos (objetivo ≤70%).',
      currentLabel: `${expenseRatio.toFixed(1)}%`,
      targetLabel: '≤70%',
      progress: expenseProgress,
      status: goalStatus(expenseProgress),
      actionText:
        expenseProgress >= 100
          ? '¡Gastos bajo control!'
          : expenseReduction > 0
          ? `Reduce €${expenseReduction}/mes en gastos variables`
          : 'Identifica suscripciones o gastos innecesarios',
    },
    {
      id: 'emergency',
      title: 'Fondo de emergencia',
      description: `Objetivo: ${fmtK(emergencyTarget)} (3 meses de gastos).`,
      currentLabel: `≈${fmtK(estimatedSaved)}`,
      targetLabel: fmtK(emergencyTarget),
      progress: emergencyProgress,
      status: goalStatus(emergencyProgress),
      actionText:
        emergencyProgress >= 100
          ? '¡Fondo cubierto! Muévelo a cuenta remunerada.'
          : monthsLeft !== null
          ? `En ~${monthsLeft} meses lo alcanzas con tu ahorro actual`
          : 'Empieza a apartar una cantidad fija mensual',
    },
  ]

  const overallProgress = Math.round(goals.reduce((s, g) => s + g.progress, 0) / goals.length)
  const achievedCount = goals.filter((g) => g.status === 'achieved').length

  const roadmap: RoadmapMonth[] = ROADMAPS[profile].map((m, i) => ({
    ...m,
    month: i + 1,
  }))

  return { overallProgress, achievedCount, goals, roadmap }
}
