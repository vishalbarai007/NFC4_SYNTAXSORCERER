"use client"

import { Compare } from "@/components/ui/compare"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const originalScript = `FADE IN:

INT. COFFEE SHOP - DAY

The morning rush is in full swing. SARAH (28), sharp-eyed and perpetually caffeinated, sits at a corner table with her laptop.

MIKE (30), earnest and slightly disheveled, enters.

MIKE
Sarah? I'm Mike. From the dating app?

SARAH
(not looking up)
You're late.

MIKE
Traffic was—

SARAH
(finally looking up)
I don't actually care. Sit.`

const enhancedScript = `FADE IN:

INT. COFFEE SHOP - DAY

The morning rush is in full swing. SARAH (28), sharp-eyed and perpetually caffeinated, sits at a corner table with her laptop.

MIKE (30), earnest and slightly disheveled, enters.

MIKE
Sarah? I'm Mike. From the dating app?

SARAH
(not looking up)
Fashionably late, or just regular late?

MIKE
Traffic was—

SARAH
(finally looking up)
I stopped caring about punctuality around my third coffee. Sit.`

export function CompareView() {
  const OriginalContent = () => (
    <div className="h-full bg-white dark:bg-slate-900 p-6 overflow-y-auto">
      <div className="mb-4">
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300">
          📝 Original Script
        </Badge>
      </div>
      <div className="screenplay-font text-sm leading-relaxed whitespace-pre-wrap">{originalScript}</div>
    </div>
  )

  const EnhancedContent = () => (
    <div className="h-full bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 overflow-y-auto">
      <div className="mb-4">
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300"
        >
          ✨ AI Enhanced
        </Badge>
      </div>
      <div className="screenplay-font text-sm leading-relaxed whitespace-pre-wrap">{enhancedScript}</div>
    </div>
  )

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">👁️ Compare View</h2>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300"
            >
              📝 Original
            </Badge>
            <span className="text-muted-foreground">vs</span>
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300"
            >
              ✨ Enhanced
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          🖱️ Hover or drag to compare original and AI-enhanced versions
        </p>
      </div>

      <div className="flex-1 p-4">
        <Card className="h-full hover-lift">
          <CardContent className="p-0 h-full">
            <Compare
              firstContent={<OriginalContent />}
              secondContent={<EnhancedContent />}
              className="h-full rounded-lg border"
              slideMode="hover"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
