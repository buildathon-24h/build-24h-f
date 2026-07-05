'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MarvaIsotype } from '@/components/marva-isotype'
import { useAuth } from '@/hooks/use-auth'
import { LoginForm } from '@/components/login-form'

export default function AuthPage() {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()

  // Already have a session? Skip the login screen.
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace('/dashboard')
    }
  }, [loading, isAuthenticated, router])

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/auth" className="flex items-center gap-3 font-medium">
            <MarvaIsotype size={36} />
            Knowly
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden overflow-hidden bg-muted lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-background" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-10 text-center">
          <MarvaIsotype size={96} />
          <h2 className="max-w-sm text-2xl font-semibold text-balance">
            Tu conocimiento, centralizado e inteligente
          </h2>
          <p className="max-w-sm text-sm text-muted-foreground text-balance">
            Chateá con tus documentos, encontrá respuestas al instante y mantené
            a tu equipo alineado.
          </p>
        </div>
      </div>
    </div>
  )
}
