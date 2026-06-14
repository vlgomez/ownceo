import type { DiagnosticResult, FinancialData, ProfileType } from '../types/diagnostic'

export function getProfile(testScore: number): ProfileType {
  if (testScore <= 9) return 'Impulsivo'
  if (testScore <= 18) return 'Ahorrador'
  if (testScore <= 27) return 'Estratega'
  return 'Inversor'
}

function calculateHealthScore(
  testScore: number,
  savingsRate: number,
  investmentRate: number,
  expenseRatio: number,
): number {
  const testPart = (testScore / 36) * 50
  const savingsPart = Math.min(savingsRate / 20, 1) * 25
  const investmentPart = Math.min(investmentRate / 10, 1) * 15
  const expensePart = Math.max(0, 1 - expenseRatio / 100) * 10
  return Math.min(100, Math.round(testPart + savingsPart + investmentPart + expensePart))
}

const RECOMMENDATIONS: Record<ProfileType, string[]> = {
  Impulsivo: [
    'Crea un presupuesto mensual con la regla 50/30/20: 50% necesidades, 30% deseos, 20% ahorro. Escríbelo esta semana.',
    'Abre una cuenta bancaria separada exclusivamente para ahorros. Transfiérale dinero el mismo día que cobras.',
    'Instala una app de registro de gastos y anota todo durante 30 días. La toma de conciencia es el primer cambio.',
    'Espera 48 horas antes de cualquier compra no planificada. Si al día siguiente sigues queriéndola, evalúala en tu presupuesto.',
    'Cancela las suscripciones que no hayas usado activamente en los últimos 2 meses. Ese dinero suma.',
  ],
  Ahorrador: [
    'Tu dinero parado pierde valor por la inflación. Mueve tu fondo de emergencia a una cuenta remunerada o fondo monetario.',
    'Empieza a invertir aunque sean €50/mes en un fondo indexado global (MSCI World o S&P 500). El tiempo es tu mayor activo.',
    'Automatiza tus inversiones: configura una transferencia periódica el día que cobras para no depender de la disciplina.',
    'Define 2-3 objetivos financieros concretos con fecha y cantidad exacta. Sin objetivos, el dinero no tiene dirección.',
    'Lee o escucha sobre interés compuesto: invertir 10 años antes puede doblar o triplicar el resultado final.',
  ],
  Estratega: [
    'Revisa tu distribución de activos: renta variable, renta fija, inmobiliario y liquidez deben estar alineados con tu horizonte temporal.',
    'Considera incrementar tu tasa de ahorro al 30% si aún no has llegado. Cada punto porcentual cuenta a largo plazo.',
    'Optimiza tu fiscalidad: ¿estás aprovechando las aportaciones al plan de pensiones para reducir tu IRPF?',
    'Calcula tu número FIRE (capital necesario para la independencia financiera) y establece una fecha objetivo real.',
    'Diversifica tus fuentes de ingresos: un ingreso pasivo, alquiler o proyecto lateral puede acelerar tu plan drásticamente.',
  ],
  Inversor: [
    'Revisa la concentración de riesgo: ningún activo debería superar el 20% del total de tu cartera.',
    'Analiza tu eficiencia fiscal: ETFs vs fondos, gestión de plusvalías, y las ventajas de una sociedad patrimonial si aplica.',
    'Evalúa tu asset allocation actual frente a tu horizonte temporal. ¿Sigue siendo el adecuado para tu etapa vital?',
    'Considera la planificación de la transmisión patrimonial si tu patrimonio supera €250k. El ahorro fiscal puede ser enorme.',
    'Establece una revisión trimestral formal de tus KPIs financieros y rebalancea la cartera si la desviación supera el 5%.',
  ],
}

export function buildResult(answers: number[], data: FinancialData): DiagnosticResult {
  const testScore = answers.reduce((sum, a) => sum + a, 0)
  const profile = getProfile(testScore)

  const totalExpenses = data.fixedExpenses + data.variableExpenses
  const savingsRate = data.income > 0 ? (data.monthlySavings / data.income) * 100 : 0
  const expenseRatio = data.income > 0 ? (totalExpenses / data.income) * 100 : 0
  const investmentRate = data.income > 0 ? (data.monthlyInvestment / data.income) * 100 : 0
  const availableBalance =
    data.income - totalExpenses - data.monthlySavings - data.monthlyInvestment

  const healthScore = calculateHealthScore(testScore, savingsRate, investmentRate, expenseRatio)

  return {
    testScore,
    healthScore,
    profile,
    financialData: data,
    savingsRate: Math.round(savingsRate * 10) / 10,
    expenseRatio: Math.round(expenseRatio * 10) / 10,
    investmentRate: Math.round(investmentRate * 10) / 10,
    availableBalance: Math.round(availableBalance),
    recommendations: RECOMMENDATIONS[profile],
    completedAt: new Date().toISOString(),
  }
}
