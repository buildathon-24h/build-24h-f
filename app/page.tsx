import { redirect } from 'next/navigation'

export default function Page() {
  // Entry point: middleware gates auth, so land straight on the dashboard.
  redirect('/dashboard')
}
