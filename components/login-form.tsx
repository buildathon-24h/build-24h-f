"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { MarvaIsotype } from "@/components/marva-isotype"
import { Loader2Icon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return

    if (!EMAIL_PATTERN.test(email)) {
      toast.error("Ingresá un correo válido.")
      return
    }
    if (!password) {
      toast.error("Ingresá tu contraseña.")
      return
    }

    setSubmitting(true)
    try {
      await login(email, password)
      toast.success("¡Bienvenido de vuelta!")
      router.replace("/dashboard")
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo iniciar sesión"
      toast.error(
        message === "Invalid login credentials"
          ? "Correo o contraseña incorrectos."
          : message
      )
      setSubmitting(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-3 text-center">
            <MarvaIsotype size={64} />
            <h1 className="text-xl font-bold">Bienvenido a Knowly</h1>
            <FieldDescription>
              Acceso exclusivo para usuarios registrados.
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Correo</FieldLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={submitting}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Contraseña</FieldLabel>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={submitting}
              required
            />
          </Field>
          <Field>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  Ingresando...
                </>
              ) : (
                "Ingresar"
              )}
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        Al continuar aceptás nuestros{" "}
        <a href="#">Términos de servicio</a> y{" "}
        <a href="#">Política de privacidad</a>.
      </FieldDescription>
    </div>
  )
}
