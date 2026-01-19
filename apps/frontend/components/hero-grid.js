import React, { useRef, useEffect, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

const allSymbols = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
  'A', 'B', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M',
  'N', 'P', 'Q', 'R', 'S', 'U', 'V', 'W', 'X', 'Y', 'Z',
  '○', '□', '△', '◇', '⬟', '⬢', '⬡', '⯃', '⯂',
  '+', '-', '×', '÷', '=', '<', '>', '?', '!', '@', '#', '$', '%', '&'
]
const staticSymbols = ['0', '1']
const cotiLetters = ['C', 'O', 'T', 'I']


const HERO_GRID_CONFIG = {
  // Grid Settings
  defaultRows: 20,
  defaultCols: 48,
  zPosition: -2,
  
  // Responsive Settings
  breakpoints: {
    mobile: 768,
    tablet: 1024
  },
  
  // Spacing by Device
  spacing: {
    mobile: 1.1,
    tablet: 1.3,
    desktop: 1.5
  },
  
  // Font Size by Device
  fontSize: {
    mobile: 0.32,
    tablet: 0.4,
    desktop: .9
  },
  
  // Visual Settings
  colors: {
    start: new THREE.Color(0x000000),
    end: new THREE.Color(0x434343)
  },
  
  textOpacity: 0.15,
  
  // COTI Pattern Settings
  cotiSpacing: 2, // Every 3rd row
  cotiLength: 4   // Length of COTI word
}

function HeroGrid({ rows = HERO_GRID_CONFIG.defaultRows, cols = HERO_GRID_CONFIG.defaultCols, isMouseMoving }) {
  const meshRef = useRef()
  const [gridData, setGridData] = useState([])
  const [isMobile, setIsMobile] = useState(window.innerWidth < HERO_GRID_CONFIG.breakpoints.mobile)
  const [isTablet, setIsTablet] = useState(window.innerWidth >= HERO_GRID_CONFIG.breakpoints.mobile && window.innerWidth < HERO_GRID_CONFIG.breakpoints.tablet)
  const [lastStaticGrid, setLastStaticGrid] = useState(null)

  const fontSize = useMemo(() => {
    if (isMobile) return HERO_GRID_CONFIG.fontSize.mobile
    if (isTablet) return HERO_GRID_CONFIG.fontSize.tablet
    return HERO_GRID_CONFIG.fontSize.desktop
  }, [isMobile, isTablet])

  const spacing = useMemo(() => {
    if (isMobile) return HERO_GRID_CONFIG.spacing.mobile
    if (isTablet) return HERO_GRID_CONFIG.spacing.tablet
    return HERO_GRID_CONFIG.spacing.desktop
  }, [isMobile, isTablet])

  const generateStaticGrid = () => {
    const newGridData = []
    const cotiPositions = []

    for (let i = 0; i < rows; i += HERO_GRID_CONFIG.cotiSpacing) {
      const cotiStart = Math.floor(Math.random() * (cols - HERO_GRID_CONFIG.cotiLength))
      for (let j = 0; j < HERO_GRID_CONFIG.cotiLength; j++) {
        cotiPositions.push({ row: i, col: cotiStart + j })
      }
    }

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const isCotiPosition = cotiPositions.some(pos => pos.row === i && pos.col === j)
        newGridData.push({
          position: [(j - cols / 2 + 0.5) * spacing, (rows / 2 - i - 0.5) * spacing, HERO_GRID_CONFIG.zPosition],
          symbol: isCotiPosition ? cotiLetters[cotiPositions.findIndex(pos => pos.row === i && pos.col === j) % 4] : staticSymbols[Math.floor(Math.random() * staticSymbols.length)],
          color: HERO_GRID_CONFIG.colors.start.lerp(HERO_GRID_CONFIG.colors.end, j / cols),
          isCoti: isCotiPosition
        })
      }
    }
    return newGridData
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < HERO_GRID_CONFIG.breakpoints.mobile)
      setIsTablet(window.innerWidth >= HERO_GRID_CONFIG.breakpoints.mobile && window.innerWidth < HERO_GRID_CONFIG.breakpoints.tablet)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setGridData(generateStaticGrid())
    setLastStaticGrid(generateStaticGrid())
  }, [rows, cols, spacing])

  useFrame(() => {
    if (isMouseMoving) {
      setGridData(prevData => {
        return prevData.map(cell => ({
          ...cell,
          symbol: allSymbols[Math.floor(Math.random() * allSymbols.length)]
        }))
      })
    } else if (gridData !== lastStaticGrid) {
      const newStaticGrid = generateStaticGrid()
      setGridData(newStaticGrid)
      setLastStaticGrid(newStaticGrid)
    }
  })

  return (
    <group ref={meshRef}>
      {gridData.map((cell, index) => (
        <Text
          key={index}
          position={cell.position}
          color={cell.color}
          fontSize={fontSize}
          anchorX="center"
          anchorY="middle"
          opacity={HERO_GRID_CONFIG.textOpacity}
        >
          {cell.symbol}
        </Text>
      ))}
    </group>
  )
}

export default HeroGrid

