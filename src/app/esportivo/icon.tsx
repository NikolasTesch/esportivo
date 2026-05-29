import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0B0B0C',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
        }}
      >
        <span
          style={{
            color: '#D6FF3F',
            fontSize: 36,
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            transform: 'rotate(15deg)',
            display: 'block',
          }}
        >
          +
        </span>
      </div>
    ),
    { ...size },
  )
}
