// Cloudflare Pages Function — llama a Claude de forma segura (API key server-side)

function buildFinancialContext(body: any): string {
  const d = body.diagnosticResult
  if (!d) return 'Sin datos de diagnóstico disponibles.'

  const {
    financialData, profile, healthScore,
    savingsRate, expenseRatio, investmentRate, availableBalance,
    completedAt,
  } = d
  const { income, fixedExpenses, variableExpenses, monthlySavings, monthlyInvestment, debt } = financialData
  const totalExpenses = fixedExpenses + variableExpenses

  const fmt = (n: number) => n.toLocaleString('es-ES', { maximumFractionDigits: 0 })
  const pct = (n: number) => `${n.toFixed(1)}%`

  const goalsText = body.goals?.length
    ? body.goals.map((g: any) =>
        `  - ${g.name} [${g.type}]: objetivo €${fmt(g.targetAmount)}, actual €${fmt(g.currentAmount)}, aportación mensual €${fmt(g.monthlyContribution)}, fecha límite ${g.targetDate}`
      ).join('\n')
    : '  Sin objetivos definidos todavía.'

  const historyItems: any[] = body.history ?? []
  const historyText = historyItems.length > 1
    ? historyItems.slice(-4).map((h: any, i: number) =>
        `  [${i + 1}] ${new Date(h.completedAt).toLocaleDateString('es-ES')} — Salud: ${h.healthScore}/100 | Ahorro: ${pct(h.savingsRate)} | Inversión: ${pct(h.investmentRate)} | Gastos: ${pct(h.expenseRatio)}`
      ).join('\n')
    : '  Solo existe un diagnóstico (sin historial comparativo aún).'

  const emergencyFundTarget = income * 6
  const emergencyFundStatus = debt > 0
    ? `Hay deuda de €${fmt(debt)} — evaluar prioridad vs fondo emergencia`
    : `Objetivo recomendado: €${fmt(emergencyFundTarget)} (6 meses de ingresos)`

  return `
PERFIL DEL USUARIO:
- Perfil financiero: ${profile}
- Health Score: ${healthScore}/100
- Fecha del diagnóstico: ${new Date(completedAt).toLocaleDateString('es-ES')}

SITUACIÓN FINANCIERA MENSUAL:
- Ingresos netos: €${fmt(income)}
- Gastos fijos: €${fmt(fixedExpenses)} (alquiler, seguros, suscripciones fijas)
- Gastos variables: €${fmt(variableExpenses)} (alimentación, ocio, transporte)
- Total gastos: €${fmt(totalExpenses)}
- Ahorro mensual: €${fmt(monthlySavings)} → tasa de ahorro: ${pct(savingsRate)}
- Inversión mensual: €${fmt(monthlyInvestment)} → tasa de inversión: ${pct(investmentRate)}
- Deuda total pendiente: €${fmt(debt)}
- Balance disponible (excedente mensual): €${fmt(availableBalance)}
- Ratio de gastos sobre ingresos: ${pct(expenseRatio)}

BENCHMARKS VS OBJETIVOS SALUDABLES:
- Tasa de ahorro ≥20%: ${savingsRate >= 20 ? `✓ CUMPLE (${pct(savingsRate)})` : `✗ DÉFICIT ${pct(20 - savingsRate)} — actualmente ${pct(savingsRate)}`}
- Tasa inversión ≥10%: ${investmentRate >= 10 ? `✓ CUMPLE (${pct(investmentRate)})` : `✗ DÉFICIT ${pct(10 - investmentRate)} — actualmente ${pct(investmentRate)}`}
- Ratio gastos ≤70%: ${expenseRatio <= 70 ? `✓ CUMPLE (${pct(expenseRatio)})` : `✗ EXCESO ${pct(expenseRatio - 70)} — actualmente ${pct(expenseRatio)}`}
- Fondo de emergencia: ${emergencyFundStatus}

OBJETIVOS FINANCIEROS DEFINIDOS:
${goalsText}

HISTORIAL DE DIAGNÓSTICOS:
${historyText}
`.trim()
}

const ANALYSIS_SYSTEM_PROMPT = `Eres un asesor financiero personal senior, experto en finanzas personales, ahorro, inversión y planificación patrimonial en España y Europa.

Tu misión es analizar los datos financieros REALES del usuario y generar recomendaciones ALTAMENTE personalizadas, concretas y accionables — jamás genéricas.

REGLAS OBLIGATORIAS:
1. Cada recomendación usa números exactos del usuario.
   ❌ "Ahorra más dinero"
   ✅ "Reduce tu gasto variable en €120/mes para subir tu tasa de ahorro del 8% al 13%"

2. Prioriza por impacto financiero real: "alto" tiene mayor urgencia que "bajo".

3. Incluye siempre: qué hacer, por qué, beneficio cuantificado con cálculos, tiempo para notar resultados.

4. Detecta y nombra explícitamente estos riesgos si aplican:
   - Fondo de emergencia insuficiente (< 3-6 meses de ingresos)
   - Tasa de ahorro baja (< 20%)
   - Ratio de gastos elevado (> 70% de ingresos)
   - Dependencia de una sola fuente de ingresos
   - Exceso de liquidez sin invertir (ahorro >> inversión)
   - Endeudamiento elevado respecto a ingresos

5. Cuando hay objetivos definidos, conecta las recomendaciones directamente con ellos.

6. Calcula oportunidades con interés compuesto cuando aplique (usa 7% anual de referencia para indexados).

7. Genera exactamente 5 recomendaciones ordenadas de MAYOR a MENOR impacto.

8. Responde ÚNICAMENTE con JSON válido (sin texto antes ni después, sin markdown code blocks).

ESQUEMA EXACTO DE RESPUESTA:
{
  "summary": "Resumen ejecutivo de 2-3 frases sobre la situación real con números concretos",
  "strengths": ["fortaleza concreta con datos del usuario", "..."],
  "risks": ["riesgo específico con cifras reales del usuario", "..."],
  "recommendations": [
    {
      "title": "Título corto de la acción (máx 8 palabras)",
      "impact": "alto",
      "action": "Descripción exacta de qué hacer con cifras del usuario",
      "reason": "Por qué es prioritario para este usuario concreto",
      "estimated_benefit": "Beneficio cuantificado con cálculos matemáticos reales",
      "timeframe": "Plazo concreto para ver los primeros resultados"
    }
  ],
  "next_best_action": "La única acción más importante a ejecutar esta semana, con instrucciones específicas"
}`

const CHAT_SYSTEM_PROMPT = `Eres un asesor financiero personal senior experto en finanzas personales en España y Europa. Tienes acceso a los datos financieros completos del usuario.

REGLAS:
- Responde de forma directa, concreta y personalizada usando los números reales del usuario.
- Nunca des consejos genéricos — siempre calcula con los datos concretos del usuario.
- Si el usuario pregunta por proyecciones, usa interés compuesto al 7% anual de referencia para ETFs indexados.
- Responde siempre en español.
- Sé conciso pero completo. Usa listas con bullets cuando ayude a la claridad.
- Si no tienes suficiente información para responder con precisión, dilo y pide los datos que faltan.`

export async function onRequestPost(context: any) {
  try {
    const env = context.env as { ANTHROPIC_API_KEY?: string }

    if (!env.ANTHROPIC_API_KEY) {
      return Response.json({ error: 'ANTHROPIC_API_KEY no configurada en las variables de entorno de Cloudflare.' }, { status: 500 })
    }

    const body = await context.request.json()
    const { mode, messages } = body

    const financialContext = buildFinancialContext(body)

    let apiMessages: any[]
    let systemPrompt: string
    let maxTokens: number

    if (mode === 'analysis') {
      systemPrompt = ANALYSIS_SYSTEM_PROMPT
      maxTokens = 3000
      apiMessages = [{
        role: 'user',
        content: `Genera mi informe financiero personalizado completo.\n\n${financialContext}`,
      }]
    } else {
      // chat mode — inject financial context into the first user message
      systemPrompt = CHAT_SYSTEM_PROMPT
      maxTokens = 1024
      const chatMessages: any[] = messages ?? []
      apiMessages = chatMessages.map((m: any, i: number) =>
        i === 0 && m.role === 'user'
          ? { ...m, content: `[DATOS FINANCIEROS DEL USUARIO]\n${financialContext}\n\n[PREGUNTA DEL USUARIO]\n${m.content}` }
          : m
      )
    }

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: apiMessages,
      }),
    })

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text()
      return Response.json({ error: `Anthropic API error: ${errText}` }, { status: anthropicRes.status })
    }

    const data = await anthropicRes.json() as any
    const rawContent: string = data.content?.[0]?.text ?? ''

    if (mode === 'analysis') {
      try {
        // Strip optional markdown fences
        const cleaned = rawContent.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim()
        const parsed = JSON.parse(cleaned)
        return Response.json({ type: 'analysis', data: parsed })
      } catch {
        // Fallback: return raw text if JSON parse fails
        return Response.json({ type: 'analysis_raw', content: rawContent })
      }
    }

    return Response.json({ type: 'message', content: rawContent })

  } catch (err: any) {
    return Response.json({ error: err?.message ?? 'Error interno del servidor' }, { status: 500 })
  }
}
