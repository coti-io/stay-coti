import { useState, useEffect } from 'react'

const examples = [
  'a private medical data app',
  'a community event in Bangalore',
  'a private DEX',
  'a COTI marketing campaign',
  'an AI agent that uses private data',
  'a meme coin with private features',
  'a livestreamed build-a-thon',
]

export default function useAnimatedPlaceholder() {
  const [placeholder, setPlaceholder] = useState('I want to create')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  
  useEffect(() => {
    const text = examples[currentIndex]
    let timeout
    
    if (isTyping) {
      if (placeholder.length < `I want to create ${text}`.length) {
        timeout = setTimeout(() => {
          setPlaceholder(prev => 
            `I want to create ${text.slice(0, placeholder.length - 'I want to create '.length + 1)}`
          )
        }, 16)
      } else {
        timeout = setTimeout(() => {
          setPlaceholder('I want to create')
          setCurrentIndex((prev) => (prev + 1) % examples.length)
        }, 1500)
      }
    } else {
      setIsTyping(true)
    }
    
    return () => clearTimeout(timeout)
  }, [placeholder, currentIndex, isTyping])
  
  return placeholder
} 