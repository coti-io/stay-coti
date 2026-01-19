"use client"

import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { InfoIcon } from 'lucide-react'
import { useState } from 'react'

function Bangkok({
  image,
  title,
  subtitle,
  infoText,
  buttonText,
  onButtonClick,
  sectionTitle,
  sectionSubtitle
}) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center text-white">{sectionTitle}</h2>
        <p className="text-xl text-gray-600 mb-8 text-center text-white">{sectionSubtitle}</p>
        
        <div className="relative w-full h-[500px] overflow-hidden">
          <Image
            src={image}
            alt={title}
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-3xl font-bold text-white">{title}</h3>

                <div className="relative">
                  <button
                    onMouseEnter={() => setShowInfo(true)}
                    onMouseLeave={() => setShowInfo(false)}
                    className="focus:outline-none"
                  >
                    <InfoIcon className="w-6 h-6 text-white" />
                  </button>
                  {showInfo && (
                    <div className="absolute right-0 mt-2 p-2 bg-orange-100 text-black text-sm rounded shadow-lg z-10 w-48">
                      {infoText}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xl text-gray-200">{subtitle}</p>
            </div>
            <div className="flex justify-end">
              <Button 
              onClick={onButtonClick}
              className="bg-orange-200 text-black hover:bg-orange-300"
              >
                {buttonText}
                </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Bangkok
