import React from 'react'
import { Route, Routes,useMatch } from 'react-router-dom'
import Home from './pages/student/Home'
import CourseList from './pages/student/CoursesList'
import CourseDetails from './pages/student/CourseDetails'
import MyEnrollements from './pages/student/MyEnrollments'
import Player from './pages/student/Player'
import Educator from './pages/educator/Educator'
import Dashboard from './pages/educator/Dashboard'
import AddCourse from './pages/educator/AddCourse'
import MyCourses from './pages/educator/MyCourses'
import StudentsEnrolled from './pages/educator/StudentsEnrolled'
import Navbar from './components/student/Navbar'

const App = () => {
 const isEducatorRoute=useMatch('/educator/*');

  return (
    <div className='min-h-screen text-default bg-white'>
      {!isEducatorRoute && <Navbar/>}
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/course-list' element={<CourseList/>}/>
      <Route path='/course-list/:input' element={<CourseList/>}/>
      <Route path='/course-details/:id' element={<CourseDetails/>}/>
      <Route path='/my-enrollements' element={<MyEnrollements/>}/>
      <Route path='/player/:courseId' element={<Player/>}/>
      <Route path='/educator' element={<Educator/>}>
        <Route path='educator' element={<Dashboard/>}/>
        <Route path='add-course' element={<AddCourse/>}/>
        <Route path='my-courses' element={<MyCourses/>}/>
        <Route path='students-enrolled' element={<StudentsEnrolled/>}/>
      </Route>
    </Routes>
    </div>
  )
}

export default App