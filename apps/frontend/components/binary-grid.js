'use client'

import React, { useRef, useEffect, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { HERO_GRID_CONFIG, SHARED_SYMBOLS } from '@/config/grid-settings'

function BinaryGrid({ 
  rows = HERO_GRID_CONFIG.defaultRows, 
  cols = HERO_GRID_CONFIG.defaultCols, 
  globeRotation, 
  isMouseMoving 
}) {
  const meshRef = useRef()
  const [gridData, setGridData] = useState([])

  useEffect(() => {
    const newGridData = []
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const isCotiPosition = i === HERO_GRID_CONFIG.cotiPosition.row && 
          j >= HERO_GRID_CONFIG.cotiPosition.startCol && 
          j <= HERO_GRID_CONFIG.cotiPosition.endCol
        
        newGridData.push({
          position: [
            (j - cols / 2 + 0.5) * HERO_GRID_CONFIG.spacing, 
            (rows / 2 - i - 0.5) * HERO_GRID_CONFIG.spacing, 
            HERO_GRID_CONFIG.zPosition
          ],
          symbol: isCotiPosition ? 
            SHARED_SYMBOLS.cotiLetters[j - HERO_GRID_CONFIG.cotiPosition.startCol] : 
            SHARED_SYMBOLS.allSymbols[Math.floor(Math.random() * SHARED_SYMBOLS.allSymbols.length)],
          color: HERO_GRID_CONFIG.colors.start.clone().lerp(
            HERO_GRID_CONFIG.colors.end, 
            j / cols
          ),
          isCoti: isCotiPosition
        })
      }
    }
    setGridData(newGridData)
  }, [rows, cols])

  useFrame(() => {
    if (isMouseMoving) {
      setGridData(prevData => {
        return prevData.map((cell, index) => {
          const rotationEffect = (globeRotation.x + globeRotation.y) * HERO_GRID_CONFIG.rotationMultiplier
          const changeThreshold = Math.abs(rotationEffect) % HERO_GRID_CONFIG.changeThresholdModulo

          if (Math.random() < changeThreshold) {
            const newSymbol = cell.isCoti 
              ? SHARED_SYMBOLS.allSymbols[Math.floor(Math.random() * SHARED_SYMBOLS.allSymbols.length)]
              : SHARED_SYMBOLS.allSymbols.filter(s => !SHARED_SYMBOLS.cotiLetters.includes(s))[
                  Math.floor(Math.random() * (SHARED_SYMBOLS.allSymbols.filter(s => !SHARED_SYMBOLS.cotiLetters.includes(s)).length))
                ]
            return { ...cell, symbol: newSymbol }
          }
          return cell
        })
      })
    } else {
      setGridData(prevData => {
        return prevData.map((cell, index) => {
          if (cell.isCoti) {
            const col = index % cols
            return { ...cell, symbol: SHARED_SYMBOLS.cotiLetters[col - HERO_GRID_CONFIG.cotiPosition.startCol] }
          }
          return cell
        })
      })
    }
  })

  return (
    <group ref={meshRef}>
      {gridData.map((cell, index) => (
        <Text
          key={index}
          position={cell.position}
          color={cell.color}
          fontSize={1.5}
          anchorX="center"
          anchorY="middle"
          opacity={0.3}
        >
          {cell.symbol}
        </Text>
      ))}
    </group>
  )
}

export default BinaryGrid

