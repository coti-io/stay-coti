import React from 'react'

export default function SectionLayout({ 
  children, 
  className = "",
  title,
  description,
  background = "bg-white"
}) {
  return (
    <section className={`py-28 px-4 ${background} ${className}`}>
      <div className="max-w-7xl mx-auto">
        {(title || description) && (
          <div className="text-center mb-8 sm:mb-12">
            {title && (
              <h2 className="text-2xl text-white sm:text-3xl md:text-4xl font-bold mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  )
} 