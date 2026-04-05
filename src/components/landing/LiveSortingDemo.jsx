import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

function generateArr(n = 18) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 80) + 15)
}

function getBubbleFrames(arr) {
  const frames = []
  const a = [...arr]
  const sorted = new Set()
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - 1 - i; j++) {
      frames.push({ array: [...a], comparing: [j, j + 1], swapping: [], sorted: [...sorted] })
      if (a[j] > a[j + 1]) {
        ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
        frames.push({ array: [...a], comparing: [], swapping: [j, j + 1], sorted: [...sorted] })
      }
    }
    sorted.add(a.length - 1 - i)
  }
  sorted.add(0)
  frames.push({ array: [...a], comparing: [], swapping: [], sorted: [...sorted] })
  return frames
}

export default function LiveSortingDemo() {
  const [frames, setFrames] = useState(() => getBubbleFrames(generateArr()))
  const idxRef = useRef(0)
  const [frame, setFrame] = useState(frames[0])

  useEffect(() => {
    let currentFrames = frames
    const tick = () => {
      idxRef.current += 1
      if (idxRef.current >= currentFrames.length) {
        const newFrames = getBubbleFrames(generateArr())
        currentFrames = newFrames
        setFrames(newFrames)
        idxRef.current = 0
      }
      setFrame(currentFrames[idxRef.current])
    }
    const t = setInterval(tick, 100)
    return () => clearInterval(t)
  }, [])

  if (!frame) return null
  const max = Math.max(...frame.array, 1)

  const getColor = (i) => {
    if (frame.swapping?.includes(i)) return '#C95555'
    if (frame.comparing?.includes(i)) return '#C8873A'
    if (frame.sorted?.includes(i)) return '#4BAF78'
    return '#2A3441'
  }

  return (
    <div className="w-full h-full relative">
      {/* Absolute container so % heights resolve correctly */}
      <div className="absolute inset-x-2 bottom-0 top-0 flex items-end gap-0.5">
        {frame.array.map((val, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end" style={{ height: '100%' }}>
            <motion.div
              animate={{ height: `${(val / max) * 92}%`, backgroundColor: getColor(i) }}
              transition={{ duration: 0.08 }}
              className="w-full rounded-t-sm min-h-[3px]"
              style={{
                boxShadow: frame.comparing?.includes(i)
                  ? '0 0 6px rgba(200,135,58,0.5)'
                  : frame.swapping?.includes(i)
                  ? '0 0 6px rgba(201,85,85,0.5)'
                  : 'none',
              }}
            />
          </div>
        ))}
      </div>
      {/* Baseline */}
      <div className="absolute bottom-0 inset-x-2 h-px bg-white/10" />
    </div>
  )
}
