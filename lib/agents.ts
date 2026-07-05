import type { LucideIcon } from 'lucide-react'
import {
  UsersIcon,
  WalletIcon,
  TrendingUpIcon,
  ScaleIcon,
  MonitorIcon,
  MegaphoneIcon,
  BoxesIcon,
} from 'lucide-react'

export type AgentStatus = 'active' | 'coming-soon'

export interface Agent {
  id: string
  name: string
  department: string
  description: string
  status: AgentStatus
  icon: LucideIcon
  /** Two-stop gradient used by the animated orb. */
  gradient: [string, string]
  /** Sample prompts surfaced as suggestions. */
  suggestions: string[]
}

export const agents: Agent[] = [
  {
    id: 'hr',
    name: 'Alma',
    department: 'Recursos Humanos',
    description:
      'Resuelve dudas de vacaciones, políticas internas, onboarding y beneficios.',
    status: 'active',
    icon: UsersIcon,
    gradient: ['#34d399', '#0d9488'],
    suggestions: [
      '¿Cuántos días de vacaciones me quedan?',
      '¿Cómo solicito una licencia por enfermedad?',
      'Explicame el proceso de onboarding',
    ],
  },
  {
    id: 'finance',
    name: 'Cuentas',
    department: 'Finanzas',
    description: 'Reportes, presupuestos y estado de gastos.',
    status: 'coming-soon',
    icon: WalletIcon,
    gradient: ['#fbbf24', '#d97706'],
    suggestions: [],
  },
  {
    id: 'sales',
    name: 'Cierre',
    department: 'Ventas',
    description: 'Pipeline, cotizaciones y seguimiento de clientes.',
    status: 'coming-soon',
    icon: TrendingUpIcon,
    gradient: ['#60a5fa', '#2563eb'],
    suggestions: [],
  },
  {
    id: 'legal',
    name: 'Justo',
    department: 'Legal',
    description: 'Contratos, cumplimiento y políticas legales.',
    status: 'coming-soon',
    icon: ScaleIcon,
    gradient: ['#a78bfa', '#7c3aed'],
    suggestions: [],
  },
  {
    id: 'it',
    name: 'Byte',
    department: 'IT / Soporte',
    description: 'Accesos, incidencias y guías técnicas.',
    status: 'coming-soon',
    icon: MonitorIcon,
    gradient: ['#22d3ee', '#0891b2'],
    suggestions: [],
  },
  {
    id: 'marketing',
    name: 'Eco',
    department: 'Marketing',
    description: 'Campañas, contenido y métricas de marca.',
    status: 'coming-soon',
    icon: MegaphoneIcon,
    gradient: ['#f472b6', '#db2777'],
    suggestions: [],
  },
  {
    id: 'ops',
    name: 'Engranaje',
    department: 'Operaciones',
    description: 'Procesos, logística y coordinación interna.',
    status: 'coming-soon',
    icon: BoxesIcon,
    gradient: ['#fb923c', '#ea580c'],
    suggestions: [],
  },
]

export const getAgent = (id: string): Agent | undefined =>
  agents.find((agent) => agent.id === id)
