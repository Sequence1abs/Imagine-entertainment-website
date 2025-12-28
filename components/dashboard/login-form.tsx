'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signIn } from '@/app/(admin)/dashboard/actions'

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(formData: FormData) {
    setPending(true)
    setError(null)
    
    try {
      const result = await signIn(formData)
      if (result?.error) {
        setError(result.error)
        setPending(false)
      }
      // If no error, redirect will happen automatically
    } catch (e) {
      setError('An unexpected error occurred')
      setPending(false)
    }
  }

  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden p-4 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        {/* Main Grid Container */}
        <div className="relative border border-border bg-card shadow-sm rounded-lg">
          {/* Corner Icons */}
          <Plus className="absolute -top-3 -left-3 size-6 text-muted-foreground/40 z-20" strokeWidth={1} />
          <Plus className="absolute -top-3 -right-3 size-6 text-muted-foreground/40 z-20" strokeWidth={1} />
          <Plus className="absolute -bottom-3 -left-3 size-6 text-muted-foreground/40 z-20" strokeWidth={1} />
          <Plus className="absolute -bottom-3 -right-3 size-6 text-muted-foreground/40 z-20" strokeWidth={1} />

          {/* Header */}
          <div className="relative flex flex-col items-center justify-center border-b border-border p-6 md:p-8 text-center">
            <Plus className="absolute -bottom-3 left-1/2 -translate-x-1/2 size-6 text-muted-foreground/40 z-20 hidden md:block" strokeWidth={1} />

            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10 md:mb-4 md:size-14">
              <Image 
                src="/Imagine Logo White Alpha.png" 
                alt="IMAGINE" 
                width={32} 
                height={32}
                className="dark:invert-0 invert"
              />
            </div>

            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-sm text-muted-foreground md:text-base">
              Enter credentials to continue
            </p>
          </div>

          {/* Content */}
          <div className="grid md:grid-cols-2">
            {/* Left Column: Form */}
            <div className="relative p-6 md:p-8 md:border-r border-border">
              <form className="flex flex-col gap-4" action={handleSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="admin@imaginesl.com"
                      required
                      maxLength={50}
                      className="h-10 bg-background/50 border-border text-base md:text-sm"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      className="h-10 bg-background/50 border-border text-base md:text-sm"
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 text-base md:text-sm font-medium"
                  disabled={pending}
                >
                  {pending ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Test: admin@imaginesl.com / imagine2024
              </p>
            </div>

            {/* Right Column: Branding */}
            <div className="hidden md:flex flex-col items-center justify-center p-8 bg-muted/30">
              <div className="relative size-24 opacity-20">
                <Image
                  src="/Imagine Logo White Alpha.png"
                  alt="IMAGINE"
                  fill
                  className="object-contain dark:invert-0 invert"
                />
              </div>
              <h2 className="mt-4 text-xl font-bold">IMAGINE</h2>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Entertainment Dashboard
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
