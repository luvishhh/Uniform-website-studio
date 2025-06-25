import { useState } from 'react'
import { Star } from 'lucide-react'

type StarRatingProps = {
  value: number
  onChange?: (value: number) => void
  max?: number
  readOnly?: boolean
  size?: number
}

export default function StarRating({
  value,
  onChange,
  max = 5,
  readOnly = false,
  size = 24,
}: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className='flex items-center'>
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1
        return (
          <button
            key={i}
            type='button'
            disabled={readOnly}
            onClick={() => onChange && onChange(starValue)}
            onMouseEnter={() => setHovered(starValue)}
            onMouseLeave={() => setHovered(null)}
            className='p-0 m-0 bg-transparent border-none'
            aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
            tabIndex={readOnly ? -1 : 0}
          >
            <Star
              fill={
                (hovered !== null ? starValue <= hovered : starValue <= value)
                  ? '#fbbf24'
                  : 'none'
              }
              stroke='#fbbf24'
              width={size}
              height={size}
              className='transition-colors'
            />
          </button>
        )
      })}
    </div>
  )
}
