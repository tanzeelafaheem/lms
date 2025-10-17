import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Line } from "rc-progress";

const MyEnrollments = () => {
  const {
    navigate,
    enrolledCourses,
    calculateCourseDuration,
    fetchUserEnrolledCourses,
  } = useContext(AppContext);

  const [progressArray, setProgressArray] = useState([]);

  // Simulate course progress using dummy values
  const getCourseProgress = () => {
    const tempProgressArray = enrolledCourses.map((course) => {
      const totalLectures = course.totalLectures || 10;
      const lectureCompleted = Math.floor(Math.random() * totalLectures); // random demo progress
      return { totalLectures, lectureCompleted };
    });
    setProgressArray(tempProgressArray);
  };

  useEffect(() => {
    fetchUserEnrolledCourses(); // load dummy courses
  }, []);

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseProgress();
    }
  }, [enrolledCourses]);

  return (
    <div className="md:px-36 px-8 pt-10 pb-16">
      <h1 className="text-2xl font-semibold text-gray-800">My Enrollments</h1>

      <table className="md:table-auto table-fixed w-full overflow-hidden mt-10">
        <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden">
          <tr>
            <th className="px-4 py-3 font-semibold truncate">Course</th>
            <th className="px-4 py-3 font-semibold truncate">Duration</th>
            <th className="px-4 py-3 font-semibold truncate">Completed</th>
            <th className="px-4 py-3 font-semibold truncate">Status</th>
          </tr>
        </thead>

        <tbody className="text-gray-700">
          {enrolledCourses.map((course, index) => (
            <tr className="border-b border-gray-500/20" key={index}>
              <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 ">
                <img
                  className="w-14 sm:w-24 md:w-28 cursor-pointer rounded-md"
                  onClick={() => navigate("/player/" + course._id)}
                  src={course.courseThumbnail}
                  alt="courseThumbnail"
                />
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => navigate("/player/" + course._id)}
                >
                  <p className="mb-1 max-sm:text-sm font-medium text-gray-800">
                    {course.courseTitle}
                  </p>
                  <Line
                    strokeWidth={2}
                    percent={
                      progressArray[index]
                        ? (progressArray[index].lectureCompleted * 100) /
                          progressArray[index].totalLectures
                        : 0
                    }
                    strokeColor="#2563EB"
                    className="bg-gray-300 rounded-full"
                  />
                </div>
              </td>

              <td className="px-4 py-3 max-sm:hidden">
                {calculateCourseDuration
                  ? calculateCourseDuration(course)
                  : "2h 30m"}
              </td>

              <td className="px-4 py-3 max-sm:hidden">
                {progressArray[index] &&
                  `${progressArray[index].lectureCompleted} / ${progressArray[index].totalLectures} `}
                <span>Lectures</span>
              </td>

              <td className="px-3 py-3 max-sm:text-right">
                <button
                  className="px-3 sm:px-5 py-1.5 sm:py-2 bg-yellow-600 text-white rounded-md max-sm:text-xs cursor-pointer"
                  onClick={() => navigate("/player/" + course._id)}
                >
                  {progressArray[index] &&
                  progressArray[index].lectureCompleted /
                    progressArray[index].totalLectures ===
                    1
                    ? "Completed"
                    : "On Going"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {enrolledCourses.length === 0 && (
        <p className="text-gray-500 text-center mt-16">
          You haven’t enrolled in any courses yet.
        </p>
      )}
    </div>
  );
};

export default MyEnrollments;
