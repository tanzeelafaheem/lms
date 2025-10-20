import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import CourseCard from "../../components/student/CourseCard";
import { assets } from "../../assets/assets";

const CoursesList = () => {
  const { navigate } = useContext(AppContext);
  const [filteredCourse, setFilteredCourse] = useState([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_URI = import.meta.env.VITE_BACKEND_URI || "http://localhost:5000/api";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${BACKEND_URI}/courses/all`);
		console.log("backend working");
        const data = await res.json();
        if (data.success && data.courses) {
          setFilteredCourse(data.courses);
        } else if (data.success && data.course) {
          // In case backend returns a single course
          setFilteredCourse([data.course]);
        } else {
          console.error("Failed to fetch courses:", data.message);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [BACKEND_URI]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="relative md:px-36 px-8 pt-20 text-left bg-gradient-to-b from-yellow-200/100 to-white">
      <div className="flex md:flex-row flex-col gap-6 items-start justify-between w-full">
        <div>
          <h1 className="text-4xl font-semibold text-gray-800">Course List</h1>
          <p className="text-gray-500">
            <span
              onClick={() => navigate("/")}
              className="text-blue-600 cursor-pointer"
            >
              Home{" "}
            </span>{" "}
            / <span>Course List</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-3 px-2 md:p-0">
        {filteredCourse.length > 0 ? (
          filteredCourse.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))
        ) : (
          <p>No courses available</p>
        )}
      </div>
    </div>
  );
};

export default CoursesList;
