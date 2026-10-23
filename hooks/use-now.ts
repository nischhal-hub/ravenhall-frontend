import * as React from "react"

/** Current time, refreshed every `intervalMs` so time-based UI stays correct */
export function useNow(intervalMs = 30_000) {
  const [now, setNow] = React.useState(() => new Date())

  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])

  return now
}
