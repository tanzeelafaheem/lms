import React from 'react'
import { assets } from '../../assets/assets'

const Hero = () => {
  return (
    <div className='flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 text-center space-y-7 bg-gradient-to-b from-orange-100/70'>
      <h1 className='md:text-home-heading-large text-home-heading-small relative font-bold text-gray-800 max-w-3xl'>
        Brush up your skills with the courses of your interest
        <img src={assets.sketch} alt="sketch" className='md:block hidden absolute bottom-7 right-0'/></h1>

        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestias atque et quos non labore animi exercitationem tempora, aliquid tempore accusamus.</p>
    </div>
  )
}

export default Hero
