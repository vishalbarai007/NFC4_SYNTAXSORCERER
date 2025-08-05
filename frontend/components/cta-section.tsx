"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="container py-24">
      <Card className="mx-auto max-w-4xl">
        <CardContent className="p-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Ready to Transform Your Writing?</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join thousands of screenwriters who are already using AI to enhance their craft
          </p>
          <Button size="lg" className="text-lg" asChild>
            <Link href="/upload">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}
