import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import CourseCard from "./CourseCard";

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext);
  const [topCourses, setTopCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_URI = import.meta.env.VITE_BACKEND_URI || "http://localhost:5000/api";

  useEffect(() => {
    const fetchTopCourses = async () => {
      try {
          // Fetch from backend
          const res = await fetch(`${BACKEND_URI}/courses/all`);
          console.log("backend working");
          const data = await res.json();
          if (data.success && data.courses) {
            setTopCourses(data.courses.slice(0, 4));
          } else if (data.success && data.course) {
            setTopCourses([data.course]);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopCourses();
  }, [allCourses, BACKEND_URI]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="py-16 md:px-40 px-8">
      <h2 className="text-3xl font-medium text-gray-800">Learn from the best</h2>
      <p className="text-sm md:text-base text-gray-500 mt-3 leading-relaxed">
        Discover our top-rated courses across various categories. From coding and design to <br /> 
        business and wellness, our courses are crafted to deliver results.
      </p>

      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {topCourses.length > 0 ? (
          topCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))
        ) : (
          <p>No courses available</p>
        )}
      </div>

      <div className="mt-10 text-center">
        <Link
          to={"/course-list"}
          onClick={() => scrollTo(0, 0)}
          className="text-gray-500 border border-gray-500/30 px-10 py-3 rounded hover:bg-gray-100 transition"
        >
          Show all courses
        </Link>
      </div>
    </div>
  );
};

export default CoursesSection;
