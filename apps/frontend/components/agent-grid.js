"use client"

import Image from "next/image"
import Link from "next/link"
import { agents } from '@/data/agents-data'
import { Coins, ExternalLink, User } from 'lucide-react'

export default function AgentGrid() {
  return (
    <section className="py-28 px-4 bg-black ">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-24 text-white">
            COTI Community Agent Marketplace
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, index) => (
            <div key={index} className="relative rounded-xl overflow-hidden shadow-lg aspect-[3/4] w-full max-w-[360px] group mx-auto">
              {/* Background Image with Gradient Overlay */}
              <div className="absolute inset-0">
                <Image 
                  src={`/images/${(index % 3) + 1}.png`} 
                  alt={agent.title}
                  fill
                  className="object-cover"
                  priority={index < 3}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
              </div>
              
              {/* Content */}
              <div className="relative h-full p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-2xl text-white mb-2">
                    {agent.title}
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <p className="text-sm text-gray-200 opacity-80">
                    {agent.description}
                  </p>
                  <hr className="border-white/10 my-4" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-200">
                      <Coins size={16} />
                      <span>{(index % 8) + 1} COTI</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Link 
                        href={agent.href}
                        className="flex items-center gap-1 text-sm text-gray-200 hover:text-gray-100"
                      >
                        <ExternalLink size={16} />
                        Learn More
                      </Link>
                      <Link 
                        href={`/builders/${index + 1}`}
                        className="flex items-center gap-1 text-sm text-gray-200 hover:text-gray-100"
                      >
                        <User size={16} />
                        Builder Profile
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 