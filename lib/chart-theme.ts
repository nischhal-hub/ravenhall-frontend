// Shared Recharts styling so every chart follows the app theme in light and
// dark mode. Series colours come from the --chart-* tokens in globals.css
// (rose, indigo, amber, cyan, neutral; validated for colour-blind separation).
// Rose sits close to the danger red, so charts that also show `negative`
// (expenses, cancellations) use indigo/cyan for the positive series.
// Text always uses text tokens, never a series colour.

export const chartColors = {
  rose: "var(--chart-1)",
  indigo: "var(--chart-2)",
  amber: "var(--chart-3)",
  cyan: "var(--chart-4)",
  neutral: "var(--chart-5)",
  negative: "var(--destructive)",
} as const

const tick = { fontSize: 11, fill: "var(--muted-foreground)" }

/** Spread on <XAxis>/<YAxis>: muted labels, no heavy axis lines */
export const chartAxis = {
  tick,
  axisLine: false,
  tickLine: false,
} as const

/** Spread on <CartesianGrid>: recessive horizontal guides only */
export const chartGrid = {
  stroke: "var(--border)",
  strokeDasharray: "3 3",
  vertical: false,
} as const

/** Spread on <Tooltip>: card surface with theme text */
export const chartTooltip = {
  contentStyle: {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    fontSize: 12,
    color: "var(--foreground)",
    boxShadow: "0 4px 16px rgb(0 0 0 / 0.08)",
  },
  labelStyle: { color: "var(--foreground)", fontWeight: 600, marginBottom: 4 },
  itemStyle: { color: "var(--foreground)" },
  cursor: { fill: "var(--muted)", opacity: 0.5 },
} as const

/** Spread on <Legend>: small muted labels */
export const chartLegend = {
  iconType: "circle",
  iconSize: 8,
  wrapperStyle: {
    fontSize: 12,
    color: "var(--muted-foreground)",
    paddingTop: 8,
  },
} as const
