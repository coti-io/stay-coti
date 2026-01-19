import * as THREE from 'three'

// Shared symbol sets
export const SHARED_SYMBOLS = {
  allSymbols: [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
    'A', 'B', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M',
    'N', 'P', 'Q', 'R', 'S', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '○', '□', '△', '◇', '⬟', '⬢', '⬡', '⯃', '⯂', '▲', '▼', '◀',
    '+', '-', '×', '÷', '=', '<', '>', '?', '!', '@', '#', '$', '%', '&'
  ],
  staticSymbols: ['0', '1'],
  cotiLetters: ['C', 'O', 'T', 'I']
}

export const HERO_GRID_CONFIG = {
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
    desktop: 0.7
  },
  
  // Visual Settings
  colors: {
    start: new THREE.Color(0x000000),
    end: new THREE.Color(0x000000)
  },
  
  textOpacity: 0.15,
  
  // COTI Pattern Settings
  cotiSpacing: 3, // Every 3rd row
  cotiLength: 4   // Length of COTI word
}

export const BINARY_GRID_CONFIG = {
  // Grid Settings
  defaultRows: 14,
  defaultCols: 16,
  spacing: 3.0,
  zPosition: -2,
  
  // COTI Position Settings
  cotiPosition: {
    row: 3,
    startCol: 2,
    endCol: 5
  },
  
  // Visual Settings
  colors: {
    start: new THREE.Color(0x00ff00),
    end: new THREE.Color(0x0000ff)
  },
  
  // Animation Settings
  rotationMultiplier: 2,
  changeThresholdModulo: 0.2
} 