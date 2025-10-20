import React from 'react'
import { assets } from '../../assets/assets'

const Hero = () => {
  return (
    <div className='flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 space-y-7 text-center bg-gradient-to-b from-yellow-300/100 to-white'>
      
      <h1 className='md:text-6xl text-3xl relative font-extrabold text-gray-900 max-w-3xl mx-auto leading-tight drop-shadow-md'>
        Empower your future with courses designed{' '}
        <span className='text-yellow-800 underline decoration-orange-400 decoration-4'>
          to fit your choice.
        </span>
        <img 
          src={assets.sketch} 
          alt="sketch" 
          className='md:block hidden absolute -bottom-7 right-0 w-16 md:w-24'
        />
      </h1>

      <p className='md:block hidden text-gray-700 max-w-2xl mx-auto text-lg leading-relaxed'>
        We bring together world-class instructors, interactive content, and a supportive
        community to help you achieve your personal and professional goals.
      </p>

      <p className='md:hidden text-gray-700 max-w-sm mx-auto text-base leading-relaxed'>
        We bring together world-class instructors to help you achieve your professional goals.
      </p>

    </div>
  )
}

export default Hero
