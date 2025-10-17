import React from 'react'
import Hero from '../../components/student/Hero'
import Companies from './Companies'
import CoursesSection from '../../components/student/CoursesSection'
import CallToAction from '../../components/student/CalltoAction'
import Loading from './Loading'

const Home = () => {
  return (
    <div className='flex flex-col items-center space-y-7 text-center'>
      <Hero/>
      <Companies/>
      <CoursesSection/>
      <CallToAction/>
    </div>
  )
}

export default Home
