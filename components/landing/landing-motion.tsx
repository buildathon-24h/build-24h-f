"use client"

import { useEffect, useRef, type ReactNode } from "react"
import gsap from "gsap"

import { cn } from "@/lib/utils"

type LandingMotionProps = {
  children: ReactNode
  className?: string
}

export function LandingMotion({ children, className }: LandingMotionProps) {
  const scopeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scope = scopeRef.current

    if (!scope) {
      return
    }

    const media = gsap.matchMedia()

    media.add(
      "(prefers-reduced-motion: reduce)",
      () => {
        gsap.set("[data-landing-reveal]", { autoAlpha: 1, clearProps: "transform" })
        gsap.set("[data-landing-parallax]", { autoAlpha: 0.4, clearProps: "transform" })
      },
      scope
    )

    media.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        gsap.from("[data-landing-reveal]", {
          autoAlpha: 0,
          y: 28,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
        })

        gsap.to("[data-landing-parallax]", {
          yPercent: -8,
          xPercent: 4,
          scale: 1.04,
          duration: 5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          stagger: 0.4,
        })
      },
      scope
    )

    return () => media.revert()
  }, [])

  return (
    <div ref={scopeRef} className={cn("overflow-hidden", className)}>
      {children}
    </div>
  )
}
