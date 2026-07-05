import type { Agent } from '@/lib/agents'

const HR_REPLIES: string[] = [
  `Claro, con gusto te ayudo. Según la **política de vacaciones** vigente:

- Acumulás **1.25 días por mes** trabajado.
- Podés solicitarlas desde el portal de RRHH con **al menos 15 días de anticipación**.
- El saldo no usado se traslada hasta un máximo de **10 días** al siguiente año.

¿Querés que revise tu saldo actual o que te arme la solicitud?`,

  `Para una **licencia por enfermedad** el proceso es sencillo:

1. Notificá a tu líder directo el mismo día.
2. Subí el **comprobante médico** al portal dentro de las 48 horas.
3. RRHH valida y actualiza tu registro automáticamente.

Recordá que los primeros 3 días son de goce completo de salario. ¿Necesitás el enlace del formulario?`,

  `El **onboarding** en la empresa tiene tres etapas:

- **Día 1:** accesos, equipo y presentación del equipo.
- **Semana 1:** capacitaciones obligatorias y lectura de políticas internas.
- **Mes 1:** acompañamiento con tu buddy asignado y primera evaluación.

Todo queda documentado en tu checklist personal. ¿Te muestro qué pasos tenés pendientes?`,

  `Buena pregunta. Entre los **beneficios** que ofrecemos están:

- Seguro médico privado con cobertura familiar.
- **Día libre por cumpleaños** 🎂
- Presupuesto anual de aprendizaje y home office.

¿Sobre cuál te gustaría más detalle?`,
]

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** Returns a canned, department-flavored markdown reply for the given prompt. */
export function getMockReply(agent: Agent, prompt: string): string {
  if (agent.id === 'hr') {
    const p = prompt.toLowerCase()
    if (p.includes('vacacion') || p.includes('día')) return HR_REPLIES[0]
    if (p.includes('enferm') || p.includes('licencia')) return HR_REPLIES[1]
    if (p.includes('onboarding') || p.includes('ingreso')) return HR_REPLIES[2]
    if (p.includes('beneficio')) return HR_REPLIES[3]
    return HR_REPLIES[Math.floor(Math.random() * HR_REPLIES.length)]
  }
  return `Soy el asistente de **${agent.department}**. Todavía estoy en preparación 🚧`
}

/**
 * Simulates token streaming: calls `onChunk` with the growing text and resolves
 * when done. Honors an AbortSignal so callers can cancel mid-stream.
 */
export async function streamMockReply(
  fullText: string,
  onChunk: (partial: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const tokens = fullText.match(/\S+\s*/g) ?? [fullText]
  let acc = ''
  for (const token of tokens) {
    if (signal?.aborted) return
    acc += token
    onChunk(acc)
    await sleep(28 + Math.random() * 55)
  }
}
