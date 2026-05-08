import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

type TPageHeaderProps = {
  title: string
  description?: string
  className?: string
}
export default function PageHeader(props: TPageHeaderProps) {
  const isMobile = useIsMobile()
  return (
    <p
      className={cn(
        "font-heading text-lg font-medium",
        isMobile && "pl-6.5",
        props.className,
        props.description && "flex flex-col items-start"
      )}
    >
      {props.title}
      {props.description && (
        <span className="font-sans text-xs text-muted-foreground">
          {props.description}
        </span>
      )}
    </p>
  )
}
