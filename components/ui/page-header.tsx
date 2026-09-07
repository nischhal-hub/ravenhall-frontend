import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

type TPageHeaderProps = {
  title: string
  description?: string
  className?: string
  size?: "default" | "lg"
  actions?: React.ReactNode
}
export default function PageHeader(props: TPageHeaderProps) {
  const isMobile = useIsMobile()
  const size = props.size ?? "default"

  const heading = (
    <p
      className={cn(
        "font-heading",
        size === "lg"
          ? "text-2xl font-semibold tracking-tight"
          : "text-lg font-medium",
        isMobile && "pl-6.5",
        props.className,
        props.description && "flex flex-col items-start"
      )}
    >
      {props.title}
      {props.description && (
        <span className="font-sans text-xs font-normal text-muted-foreground">
          {props.description}
        </span>
      )}
    </p>
  )

  if (!props.actions) return heading

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      {heading}
      <div className="flex items-center gap-3">{props.actions}</div>
    </div>
  )
}
