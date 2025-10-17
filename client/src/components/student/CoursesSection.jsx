import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import CourseCard from "./CourseCard";

const CoursesSection = () => {
    const {allCourses} = useContext(AppContext);
// console.log(allCourses)

    return (
        <div className="py-16 md:px-40 px-8">
            <h2 className="text-3xl font-medium text-gray-800">Learn from the best</h2>
            <p className="text-sm md:text-base text-gray-500 mt-3 leading-relaxed">
                Discover our top-rated courses across various categories. From coding
                and design to <br /> business and wellness, our courses are crafted to deliver
                results.
            </p>

            <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {allCourses.length > 0 &&
           allCourses.slice(0, 4).map((course) => (
          <CourseCard key={course.id || course.title} course={course} />
             ))}

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
