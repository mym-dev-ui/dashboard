"use client"

import * as React from "react"
import { addDays, endOfMonth, format, startOfMonth, subDays } from "date-fns"
import { CalendarIcon, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { DateRange } from "react-day-picker"

type Preset = {
  label: string
  getRange: () => DateRange
}

export type DateRangePickerProps = {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  numberOfMonths?: number
  showPresets?: boolean
  presets?: Preset[]
  align?: "start" | "center" | "end"
  side?: "top" | "bottom" | "left" | "right"
}

const defaultPresets: Preset[] = [
  {
    label: "Today",
    getRange: () => {
      const today = new Date()
      return { from: today, to: today }
    },
  },
  {
    label: "Yesterday",
    getRange: () => {
      const d = subDays(new Date(), 1)
      return { from: d, to: d }
    },
  },
  {
    label: "Last 7 days",
    getRange: () => {
      const to = new Date()
      const from = subDays(to, 6)
      return { from, to }
    },
  },
  {
    label: "Last 30 days",
    getRange: () => {
      const to = new Date()
      const from = subDays(to, 29)
      return { from, to }
    },
  },
  {
    label: "This month",
    getRange: () => {
      const now = new Date()
      return { from: startOfMonth(now), to: endOfMonth(now) }
    },
  },
  {
    label: "Last month",
    getRange: () => {
      const now = new Date()
      const lastMonthEnd = subDays(startOfMonth(now), 1)
      return { from: startOfMonth(lastMonthEnd), to: endOfMonth(lastMonthEnd) }
    },
  },
]

function formatRangeLabel(range?: DateRange) {
  const fmt = "LLL d, yyyy"
  if (range?.from && range?.to) {
    try {
      return `${format(range.from, fmt)} - ${format(range.to, fmt)}`
    } catch {
      return "Invalid date"
    }
  }
  if (range?.from) {
    try {
      return `${format(range.from, fmt)}`
    } catch {
      return "Invalid date"
    }
  }
  return undefined
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Pick a date range",
  disabled = false,
  className,
  numberOfMonths = 2,
  showPresets = true,
  presets = defaultPresets,
  align = "start",
  side = "bottom",
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)

  // Support controlled and uncontrolled usage
  const [internal, setInternal] = React.useState<DateRange | undefined>(value)
  const range = value !== undefined ? value : internal

  React.useEffect(() => {
    setInternal(value)
  }, [value?.from?.getTime(), value?.to?.getTime()])

  function setRange(next?: DateRange) {
    if (value === undefined) setInternal(next)
    onChange?.(next)
  }

  function handleSelect(next: DateRange | undefined) {
    setRange(next)
    // Close when a full range is selected
    if (next?.from && next?.to) {
      setOpen(false)
    }
  }

  function applyPreset(preset: Preset) {
    const r = preset.getRange()
    setRange(r)
    setOpen(false)
  }

  function clear() {
    setRange(undefined)
  }

  const label = formatRangeLabel(range)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-between text-left font-normal",
            !label && "text-muted-foreground",
            "md:w-[320px]",
            className
          )}
          disabled={disabled}
          aria-label="Open date range picker"
        >
          <span className="inline-flex items-center gap-2">
            <CalendarIcon className="size-4" aria-hidden="true" />
            {label ?? placeholder}
          </span>
          {range?.from || range?.to ? (
            <X
              className="size-4 shrink-0 text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                clear()
              }}
              role="button"
              aria-label="Clear selected date range"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  clear()
                }
              }}
            />
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-auto p-0",
          showPresets ? "md:min-w-[640px]" : "md:min-w-[520px]"
        )}
        align={align}
        side={side}
      >
        <div className="grid md:grid-cols-[200px_1fr]">
          {showPresets ? (
            <div className="p-3">
              <div className="text-xs font-medium text-muted-foreground px-2 pb-2">Quick ranges</div>
              <div className="flex flex-col gap-1 max-h-[280px] overflow-y-auto">
                {presets.map((p) => (
                  <Button
                    key={p.label}
                    type="button"
                    variant="ghost"
                    className={cn(
                      "justify-start w-full",
                      (() => {
                        const r = p.getRange()
                        const isActive =
                          !!range?.from &&
                          !!range?.to &&
                          !!r.from &&
                          !!r.to &&
                          // Compare by day
                          format(range.from, "yyyy-MM-dd") === format(r.from, "yyyy-MM-dd") &&
                          format(range.to, "yyyy-MM-dd") === format(r.to, "yyyy-MM-dd")
                        return isActive ? "bg-muted" : ""
                      })()
                    )}
                    onClick={() => applyPreset(p)}
                  >
                    {p.label}
                  </Button>
                ))}
              </div>
              <Separator className="my-3" />
              <div className="flex items-center justify-between gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => {
                    const today = new Date()
                    setRange({ from: today, to: addDays(today, 1) })
                  }}
                >
                  Set next 2 days
                </Button>
                <Button type="button" variant="outline" className="w-full" onClick={clear}>
                  Clear
                </Button>
              </div>
            </div>
          ) : null}
          <div className={cn("border-l md:block", !showPresets && "border-l-0")}>
            <Calendar
              mode="range"
              selected={range}
              onSelect={handleSelect}
              numberOfMonths={numberOfMonths}
              initialFocus
              // Allow selecting the same day for a single-day range
              min={1}
              className="p-3"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default DateRangePicker
