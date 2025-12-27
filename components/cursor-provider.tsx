"use client"

import dynamic from "next/dynamic"

const TargetCursor = dynamic(() => import("@/components/TargetCursor"), {
  ssr: false,
})

export default function CursorProvider() {
  return (
    <TargetCursor
      spinDuration={5}
      hideDefaultCursor={false}
      parallaxOn={true}
    />
  )
}
