import * as AvatarPrimitive from "@radix-ui/react-avatar"
import * as React from "react"
import { cn } from "../../lib/utils"
import Image from "next/image"

const SAvatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
SAvatar.displayName = AvatarPrimitive.Root.displayName

const SAvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
SAvatarImage.displayName = AvatarPrimitive.Image.displayName

const SAvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
SAvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

type TProps = {
  src?: string
  name?: string
  bg?: "none" | string
  size?: string
  shape?: "rounded" | "radius-md"
}

export const Avatar = ({ bg, name, src, size, shape }: TProps) => {
  const getCharacters = (name: string) => {
    const words = name?.split(" ")

    if (words.length > 1) {
      const charW1 = words[0]?.charAt(0)
      const charW2 = words[1]?.charAt(0)

      return (charW1 || "U") + (charW2 || "N")
    }

    const w1 = words[0]

    if (w1 && w1.length > 1) {
      return w1?.charAt(0) + w1?.charAt(1)
    }

    return w1?.charAt(0) || "U"
  }

  return (
    <SAvatar
      style={{
        width: size || "40px",
        height: size || "40px",
        aspectRatio: "1 / 1",
      }}
      className={cn(shape === "radius-md" && "rounded-md")}
    >
      {src ? (
        <Image
          src={src}
          width={40}
          height={40}
          style={{
            width: size || "40px",
            height: size || "40px",
          }}
          alt={`${name || "User"}'s Avatar`}
          className={cn(
            "aspect-square h-full w-full object-cover",
            shape === "radius-md" && "rounded-md"
          )}
        />
      ) : (
        <div
          style={{
            backgroundColor: bg || "#E1E6FF",
            width: size || "40px",
            height: size || "40px",
            fontSize: `${parseInt(size || "40px") / 2.5}px`,
          }}
          className="flex items-center justify-center text-lg text-black uppercase"
          title={name || "Avatar"}
        >
          {getCharacters(name || "undefined")}
        </div>
      )}
    </SAvatar>
  )
}
