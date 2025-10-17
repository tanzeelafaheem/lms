import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";

export const AppContext = createContext();

export const AppProvider = (props)=>{

    const currency=import.meta.env.VITE_CURRENCY || '$';
    const [allCourses,setAllCourses]=useState([]);
    const [enrolledCourses,setEnrolledCourses]=useState([]);
    const navigate=useNavigate();
     const [isEducator, setIsEducator] = useState(true)

    //fetch courses
    const fetchAllCourses=async()=>{
        setAllCourses(dummyCourses);
        fetchUserEnrolledCourses();
    }

    // Function to calculate average rating of course
    const calculateRating = (course) => {
        if(course.courseRatings.length === 0){
            return 0;
        }
        let totalRating = 0;
        course.courseRatings.forEach(rating =>{
            totalRating += rating.rating;
        })
        return Math.floor(totalRating / course.courseRatings.length)
    }

    //calculate course chapter time
    const calculateChapterTime=(chapter)=>{
      let time=0
      chapter.chapterContent.map((lecture)=>{
        time+=lecture.lectureDuration;
        
        return humanizeDuration(time*60000,{units:['h','m'],round:true});
      })
    }
    
    // calculate course duration
const calculateCourseDuration = (course) => {
  let time = 0;

  course.courseContent.forEach((chapter) => {
    chapter.chapterContent.forEach((lecture) => {
      time += lecture.lectureDuration;
    });
  });

  return humanizeDuration(time * 60000, { units: ['h', 'm'], round: true });
};

   //no of lectures
   // calculate total number of lectures in a course
const calculateNoOfLectures = (course) => {
  let count = 0;

  course.courseContent.forEach((chapter) => {
    count += chapter.chapterContent.length;
  });

  return count;
};



    //enrolledCourses
    const fetchUserEnrolledCourses=async()=>{
     setEnrolledCourses(dummyCourses);  
    }
    
    useEffect(()=>{
        fetchAllCourses();
    },[]);
    const value={
       currency,allCourses,navigate,calculateRating,isEducator,setIsEducator,
       enrolledCourses,fetchUserEnrolledCourses,setEnrolledCourses,calculateChapterTime,calculateNoOfLectures,
       calculateCourseDuration,
    };
    return (
    <AppContext.Provider value={value}>
        {props.children}
        </AppContext.Provider>
    )
}