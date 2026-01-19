'use client'

import { useRef, useEffect, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'
import Link from 'next/link'
import BinaryGrid from './binary-grid'

function WireframeGlobe() {
  const globeRef = useRef()
  const { viewport } = useThree()
  const mousePosition = useRef({ x: 0, y: 0 })
  const [globeRotation, setGlobeRotation] = useState({ x: 0, y: 0 });
  const [isMouseMoving, setIsMouseMoving] = useState(false);

  useEffect(() => {
    let timeoutId;
    const updateMousePosition = (e) => {
      mousePosition.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      }
      setIsMouseMoving(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsMouseMoving(false), 100);
    }
    window.addEventListener('mousemove', updateMousePosition)
    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      clearTimeout(timeoutId);
    }
  }, [])

  useFrame(() => {
    if (globeRef.current) {
      // Constant rotation
      globeRef.current.rotation.y += 0.001

      // Mouse-controlled rotation
      const targetRotationX = mousePosition.current.y * 0.5
      const targetRotationY = mousePosition.current.x * 0.5

      globeRef.current.rotation.x += (targetRotationX - globeRef.current.rotation.x) * 0.1
      globeRef.current.rotation.y += (targetRotationY - globeRef.current.rotation.y) * 0.1

      // Update globe rotation state
      setGlobeRotation({
        x: globeRef.current.rotation.x,
        y: globeRef.current.rotation.y
      })
    }
  })

  const verticalWireframeMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        colorStart: { value: new THREE.Color(0x7fff98) }, // Lighter, more muted green
        colorEnd: { value: new THREE.Color(0x4169e1) },   // More muted blue
      },
      vertexShader: `
        varying vec3 vPosition;
        void main() {
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 colorStart;
        uniform vec3 colorEnd;
        varying vec3 vPosition;
        void main() {
          float latitude = acos(vPosition.y / length(vPosition));
          float longitude = atan(vPosition.z, vPosition.x);
          
          // Create vertical lines
          float verticalLineWidth = 0.03;
          float verticalLine = step(mod(longitude + 3.14159, 0.3141), verticalLineWidth);
          
          // Create horizontal lines
          float horizontalLineWidth = 0.02;
          float horizontalLine = step(mod(latitude, 3.14159 / 8.0), horizontalLineWidth);
          
          // Combine vertical and horizontal lines
          float line = max(verticalLine, horizontalLine);
          
          // Calculate diagonal gradient factor with smoother transition
          float gradientFactor = (vPosition.x + vPosition.y + 2.0) / 6.0; // Divided by 6.0 instead of 4.0 for smoother transition
          vec3 color = mix(colorStart, colorEnd, smoothstep(0.0, 1.0, gradientFactor));
          
          // Set color for lines, transparent for the rest
          gl_FragColor = vec4(color, line);
        }
      `,
      transparent: true,
    })
  }, [])

  return (
    <group>
      <BinaryGrid rows={7} cols={8} globeRotation={globeRotation} isMouseMoving={isMouseMoving} />
      <Sphere ref={globeRef} args={[16, 64, 64]} position={[0, 0, 0]}>
        <primitive object={verticalWireframeMaterial} attach="material" />
      </Sphere>
    </group>
  )
}

export default function GlobeSection() {
  return (
    <section className="relative overflow-hidden bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Image with text overlay */}
          <div className="relative rounded-3xl overflow-hidden h-[500px]">
            <img 
              src="/placeholder.svg?height=500&width=600" 
              alt="Global Privacy Network" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center p-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Global Privacy Network
              </h2>
              <p className="text-lg text-gray-200 mb-6">
                Join our network of creators, marketers, builders, developers, and planners to shape the future of privacy.
              </p>
              <Link
                href="#"
                className="inline-block bg-white text-black font-bold py-3 px-6 rounded-lg hover:bg-gray-200 transition duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Right side - Globe */}
          <div className="h-[500px] order-first md:order-last">
            <Canvas 
              camera={{ 
                position: [0, 0, 50],
                fov: 45,
                near: 0.1,
                far: 1000
              }}
            >
              <ambientLight intensity={0.5} />
              <WireframeGlobe />
            </Canvas>
          </div>
        </div>
      </div>
    </section>
  )
}

