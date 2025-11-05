import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: number
    direction: "up" | "down"
    label?: string
  }
  className?: string
  iconClassName?: string
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  iconClassName,
}: MetricCardProps) {
  return (
    <Card className={cn("transition-all duration-300 hover:-translate-y-1 hover:shadow-lg", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <div className={cn("rounded-lg bg-primary/10 p-2", iconClassName)}>
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {(description || trend) && (
          <div className="mt-2 flex items-center gap-2 text-xs">
            {trend && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 font-medium",
                  trend.direction === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}
              >
                {trend.direction === "up" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {Math.abs(trend.value)}%
              </span>
            )}
            {(trend?.label || description) && (
              <span className="text-muted-foreground">
                {trend?.label || description}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}