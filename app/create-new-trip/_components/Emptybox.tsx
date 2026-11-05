import React from 'react'
import { Compass, Globe, Mountain, Plane } from 'lucide-react'

const suggestions = [
  { icon: Plane, title: 'Plan a trip', prompt: 'Create a trip from Paris to New York' },
  { icon: Compass, title: 'Discover places', prompt: 'Help me discover hidden gems in Japan' },
  { icon: Mountain, title: 'Adventure getaway', prompt: 'Plan an adventure trip to Switzerland' },
  { icon: Globe, title: 'Budget travel', prompt: 'Plan a low budget trip to Thailand' },
]

type Props = {
  onSelectOption: (prompt: string) => void
}

export default function Emptybox({ onSelectOption }: Props) {
  return (
    <div className='flex flex-1 flex-col items-center justify-center text-center px-4 pb-44 sm:pb-56 min-h-0'>
      <h2 className='text-2xl sm:text-4xl font-bold text-white'>
        Where to <span className='text-amber-500'>next?</span>
      </h2>
      <p className='mt-2 sm:mt-3 max-w-md text-sm sm:text-lg text-gray-400'>
        Tell me about your dream trip and I&apos;ll build the perfect itinerary,
        one question at a time.
      </p>

      <div className='mt-6 grid w-full max-w-xl grid-cols-1 gap-2.5 sm:gap-3 sm:grid-cols-2'>
        {suggestions.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.title}
              onClick={() => onSelectOption(item.prompt)}
              className='group flex items-start gap-3 rounded-xl border border-zinc-700 bg-zinc-900 p-3 text-left transition hover:border-amber-600 hover:bg-zinc-800'
            >
              <Icon className='mt-0.5 sm:mt-1 h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-amber-500 transition group-hover:scale-110' />
              <div className='min-w-0'>
                <p className='font-semibold text-white text-sm sm:text-base'>{item.title}</p>
                <p className='text-xs sm:text-sm text-gray-400 truncate'>{item.prompt}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}