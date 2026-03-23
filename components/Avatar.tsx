'use client'

import { avatarSvgDataUrl } from '@/lib/avatar'

export default function Avatar({ name, size = 20 }: { name: string; size?: number }) {
  return (
    <img
      src={avatarSvgDataUrl(name, size * 2)}
      alt={name}
      width={size}
      height={size}
      className="rounded-full shrink-0"
      style={{ width: size, height: size }}
    />
  )
}
