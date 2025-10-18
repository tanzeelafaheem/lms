import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/educator/Navbar'
import Sidebar from '../../components/educator/Sidebar'

const Educator = () => {
  return (
    <div className='text-default min-h-screen bg-white'>
     <Navbar/>
     <Sidebar/>
      <div>{<Outlet/>}</div>
    </div>
  )
}

export default Educator
