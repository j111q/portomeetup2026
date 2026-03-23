// Generate a deterministic Mondrian-style geometric avatar
// Angular blocks, 2-3 brand colors, no circles

const PALETTES: [string, string, string][] = [
  ['#E53312', '#6B7BFF', '#F0E4D4'],
  ['#6B7BFF', '#1A1A1A', '#F0E4D4'],
  ['#E53312', '#1A1A1A', '#F0E4D4'],
  ['#6B7BFF', '#E53312', '#1A1A1A'],
  ['#1A1A1A', '#F0E4D4', '#6B7BFF'],
  ['#E53312', '#F0E4D4', '#6B7BFF'],
  ['#1A1A1A', '#E53312', '#F0E4D4'],
]

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

export function avatarSvgDataUrl(name: string, size = 32): string {
  const h = hashCode(name)
  const [c1, c2, c3] = PALETTES[h % PALETTES.length]
  const pattern = (h >> 3) % 10
  const s = size

  // Split ratios derived from hash for variety
  const r1 = 0.3 + ((h >> 5) % 4) * 0.1  // 0.3–0.6
  const r2 = 0.4 + ((h >> 7) % 3) * 0.1  // 0.4–0.6

  let shapes = ''

  switch (pattern) {
    case 0: // vertical thirds
      shapes = `<rect width="${s * r1}" height="${s}" fill="${c1}"/>
        <rect x="${s * r1}" width="${s * (r2 - r1 + 0.3)}" height="${s}" fill="${c2}"/>
        <rect x="${s * (r2 + 0.3)}" width="${s}" height="${s}" fill="${c3}"/>`
      break
    case 1: // horizontal split + vertical block
      shapes = `<rect width="${s}" height="${s * r1}" fill="${c1}"/>
        <rect y="${s * r1}" width="${s * r2}" height="${s}" fill="${c2}"/>
        <rect x="${s * r2}" y="${s * r1}" width="${s}" height="${s}" fill="${c3}"/>`
      break
    case 2: // L-shape
      shapes = `<rect width="${s}" height="${s}" fill="${c3}"/>
        <rect width="${s * 0.55}" height="${s}" fill="${c1}"/>
        <rect y="${s * 0.6}" width="${s}" height="${s * 0.4}" fill="${c2}"/>`
      break
    case 3: // corner blocks
      shapes = `<rect width="${s}" height="${s}" fill="${c1}"/>
        <rect width="${s * 0.45}" height="${s * 0.45}" fill="${c2}"/>
        <rect x="${s * 0.45}" y="${s * 0.45}" width="${s * 0.55}" height="${s * 0.55}" fill="${c3}"/>`
      break
    case 4: // cross
      shapes = `<rect width="${s}" height="${s}" fill="${c3}"/>
        <rect x="${s * 0.35}" width="${s * 0.3}" height="${s}" fill="${c1}"/>
        <rect y="${s * 0.35}" width="${s}" height="${s * 0.3}" fill="${c2}"/>`
      break
    case 5: // diagonal blocks (staircase)
      shapes = `<rect width="${s}" height="${s}" fill="${c3}"/>
        <rect width="${s * 0.5}" height="${s * 0.35}" fill="${c1}"/>
        <rect x="${s * 0.25}" y="${s * 0.35}" width="${s * 0.5}" height="${s * 0.3}" fill="${c2}"/>
        <rect x="${s * 0.5}" y="${s * 0.65}" width="${s * 0.5}" height="${s * 0.35}" fill="${c1}"/>`
      break
    case 6: // four unequal blocks
      shapes = `<rect width="${s * r1}" height="${s * r2}" fill="${c1}"/>
        <rect x="${s * r1}" width="${s}" height="${s * r2}" fill="${c2}"/>
        <rect width="${s * r1}" y="${s * r2}" height="${s}" fill="${c3}"/>
        <rect x="${s * r1}" y="${s * r2}" width="${s}" height="${s}" fill="${c1}"/>`
      break
    case 7: // T-shape
      shapes = `<rect width="${s}" height="${s}" fill="${c2}"/>
        <rect width="${s}" height="${s * 0.4}" fill="${c1}"/>
        <rect x="${s * 0.3}" y="${s * 0.4}" width="${s * 0.4}" height="${s * 0.6}" fill="${c3}"/>`
      break
    case 8: // flag-like horizontal bands
      shapes = `<rect width="${s}" height="${s * 0.33}" fill="${c1}"/>
        <rect y="${s * 0.33}" width="${s}" height="${s * 0.34}" fill="${c2}"/>
        <rect y="${s * 0.67}" width="${s}" height="${s * 0.33}" fill="${c3}"/>
        <rect width="${s * 0.35}" height="${s}" fill="${c1}" opacity="0.6"/>`
      break
    case 9: // asymmetric grid
      shapes = `<rect width="${s}" height="${s}" fill="${c3}"/>
        <rect width="${s * 0.6}" height="${s * 0.5}" fill="${c1}"/>
        <rect x="${s * 0.6}" y="${s * 0.5}" width="${s * 0.4}" height="${s * 0.5}" fill="${c2}"/>
        <rect x="${s * 0.6}" width="${s * 0.4}" height="${s * 0.25}" fill="${c2}"/>`
      break
  }

  const id = `av${h}`
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
    <defs><clipPath id="${id}"><circle cx="${s / 2}" cy="${s / 2}" r="${s / 2}"/></clipPath></defs>
    <g clip-path="url(#${id})">${shapes}</g>
  </svg>`

  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
