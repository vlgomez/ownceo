import type { Question } from '../types/diagnostic'

export const QUESTIONS: Question[] = [
  {
    id: 1,
    category: 'Control del gasto',
    text: 'Ves algo que quieres pero no lo tenías planeado. ¿Qué haces?',
    options: [
      { text: 'Lo compro de inmediato — si lo quiero, lo quiero ahora', points: 0 },
      { text: 'Lo pienso unos días y suelo acabar comprándolo', points: 1 },
      { text: 'Evalúo si cabe en el presupuesto de este mes', points: 2 },
      { text: 'Lo anoto, espero 48h y solo compro si encaja en mi plan', points: 3 },
    ],
  },
  {
    id: 2,
    category: 'Conciencia financiera',
    text: '¿Sabes exactamente cuánto has gastado este mes?',
    options: [
      { text: 'No tengo ni idea', points: 0 },
      { text: 'Más o menos, pero sin mucho detalle', points: 1 },
      { text: 'Sí, llevo un control básico por categorías', points: 2 },
      { text: 'Sí, con detalle exacto y registro actualizado', points: 3 },
    ],
  },
  {
    id: 3,
    category: 'Fondo de emergencia',
    text: '¿Cuántos meses de gastos tienes guardados como colchón de seguridad?',
    options: [
      { text: 'Ninguno — si surge algo, ya veré cómo lo resuelvo', points: 0 },
      { text: 'Menos de un mes', points: 1 },
      { text: 'Entre 1 y 3 meses', points: 2 },
      { text: 'Más de 3 meses de gastos cubiertos', points: 3 },
    ],
  },
  {
    id: 4,
    category: 'Hábito de ahorro',
    text: '¿Cuándo y cómo ahorras habitualmente?',
    options: [
      { text: 'Si sobra algo a fin de mes, lo guardo (suele no sobrar)', points: 0 },
      { text: 'Intento guardar algo, pero no siempre lo consigo', points: 1 },
      { text: 'Aparto una cantidad fija al principio del mes', points: 2 },
      { text: 'Tengo transferencias automáticas el día que cobro', points: 3 },
    ],
  },
  {
    id: 5,
    category: 'Gestión de deudas',
    text: '¿Cómo describes tu relación actual con las deudas?',
    options: [
      { text: 'Tengo deudas de consumo: tarjetas, préstamos personales', points: 0 },
      { text: 'Tengo alguna deuda pequeña que voy pagando poco a poco', points: 1 },
      { text: 'Solo tengo hipoteca o directamente no tengo deudas', points: 2 },
      { text: 'Cero deudas. Pago todo al contado o en el mes sin intereses', points: 3 },
    ],
  },
  {
    id: 6,
    category: 'Inversión',
    text: '¿Inviertes dinero de forma regular?',
    options: [
      { text: 'No. No sé por dónde empezar', points: 0 },
      { text: 'He pensado en ello pero aún no me he puesto', points: 1 },
      { text: 'Invierto ocasionalmente cuando puedo o cuando me acuerdo', points: 2 },
      { text: 'Sí, tengo un plan de inversión mensual automatizado', points: 3 },
    ],
  },
  {
    id: 7,
    category: 'Objetivos financieros',
    text: '¿Tienes objetivos financieros concretos definidos?',
    options: [
      { text: 'No suelo pensar en eso', points: 0 },
      { text: 'Los tengo en la cabeza, pero sin mucho detalle', points: 1 },
      { text: 'Sí, tengo 1-2 objetivos claros con cantidad y fecha', points: 2 },
      { text: 'Sí, con fecha, cantidad, plan de acción y seguimiento mensual', points: 3 },
    ],
  },
  {
    id: 8,
    category: 'Inflación del estilo de vida',
    text: 'Cuando tus ingresos aumentan, ¿qué haces primero?',
    options: [
      { text: 'Subo mi estilo de vida: mejor piso, más salidas, más gastos', points: 0 },
      { text: 'Gasto un poco más pero intento guardar algo extra', points: 1 },
      { text: 'Mantengo mis gastos actuales y aumento mi ahorro', points: 2 },
      { text: 'Asigno el extra a inversión según mi plan financiero', points: 3 },
    ],
  },
  {
    id: 9,
    category: 'Conocimiento financiero',
    text: '¿Cómo describirías tu nivel de conocimiento en finanzas personales?',
    options: [
      { text: 'Básico — sé lo mínimo para pagar facturas y ya', points: 0 },
      { text: 'Regular — entiendo conceptos básicos de ahorro y presupuesto', points: 1 },
      { text: 'Bueno — me he formado en inversión y planificación financiera', points: 2 },
      { text: 'Avanzado — gestiono activamente mi cartera y patrimonio', points: 3 },
    ],
  },
  {
    id: 10,
    category: 'Planificación de jubilación',
    text: '¿Estás haciendo algo activamente para tu jubilación?',
    options: [
      { text: 'No lo he pensado todavía — queda mucho para eso', points: 0 },
      { text: 'Confío principalmente en la pensión pública del Estado', points: 1 },
      { text: 'Tengo un plan de pensiones o EPSV', points: 2 },
      { text: 'Tengo una estrategia diversificada: pensión, inversiones y activos', points: 3 },
    ],
  },
  {
    id: 11,
    category: 'Registro de gastos',
    text: 'El mes pasado, ¿sabes cuánto gastaste en ocio o restaurantes?',
    options: [
      { text: 'No tengo ni idea', points: 0 },
      { text: 'Más de lo que debería, pero sin cifra exacta', points: 1 },
      { text: 'Aproximadamente sí, lo recuerdo más o menos', points: 2 },
      { text: 'Sí, lo sé con exactitud — está en mi registro de gastos', points: 3 },
    ],
  },
  {
    id: 12,
    category: 'Revisión financiera',
    text: '¿Con qué frecuencia revisas y analizas tu situación financiera?',
    options: [
      { text: 'Nunca o casi nunca', points: 0 },
      { text: 'Solo cuando hay algún problema o urgencia', points: 1 },
      { text: 'Una vez al mes hago un repaso general', points: 2 },
      { text: 'Semanalmente, con seguimiento de métricas y KPIs', points: 3 },
    ],
  },
]
