import React, { useState, useContext, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import YouTube from "react-youtube";
import humanizeDuration from "humanize-duration";
import Loading from '../../components/student/Loading'

const CourseDetails = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [openSections, setOpenSections] = useState([]);
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);

  const { allCourses, currency } = useContext(AppContext);

  // ✅ Fetch course data safely
  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const foundCourse =
        allCourses.find((course) => course._id === id || course.id === id) ||
        null;
      setCourseData(foundCourse);
    }
  }, [allCourses, id]);

  // ✅ Section toggle logic
  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // ✅ Rating calculator
  const calculateRating = (course) => {
    if (!course?.courseRatings?.length) return 0;
    const total = course.courseRatings.reduce((a, b) => a + b.rating, 0);
    return (total / course.courseRatings.length).toFixed(1);
  };

  // ✅ Calculate total lectures
  const calculateNoOfLectures = (course) => {
    return course?.courseContent?.reduce(
      (acc, chapter) => acc + chapter.chapterContent.length,
      0
    );
  };

  // ✅ Calculate total course duration
  const calculateCourseDuration = (course) => {
    const totalMinutes = course?.courseContent?.reduce((total, chapter) => {
      const chapterMinutes = chapter.chapterContent.reduce(
        (sum, lecture) => sum + lecture.lectureDuration,
        0
      );
      return total + chapterMinutes;
    }, 0);
    return humanizeDuration(totalMinutes * 60 * 1000, { units: ["h", "m"] });
  };

  // ✅ Calculate total time per chapter
  const calculateChapterTime = (chapter) => {
    const totalMinutes = chapter.chapterContent.reduce(
      (sum, lecture) => sum + lecture.lectureDuration,
      0
    );
    return humanizeDuration(totalMinutes * 60 * 1000, { units: ["h", "m"] });
  };

  // ✅ Dummy enrollCourse handler
  const enrollCourse = () => {
    console.log("User enrolled in", courseData.courseTitle);
    setIsAlreadyEnrolled(true);
  };

  if (!courseData) return <Loading/>;

  return (
    <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 pt-20 text-left">
      <div className="absolute top-0 left-0 w-full h-section-height -z-10 bg-gradient-to-b from-yellow-100/70 to-orange-50"></div>

      {/* LEFT COLUMN */}
      <div className="max-w-xl z-10 text-gray-500">
        <h1 className="md:text-4xl text-2xl font-semibold text-gray-800">
          {courseData.courseTitle}
        </h1>
        <p
          className="pt-4 md:text-base text-sm"
          dangerouslySetInnerHTML={{
            __html: courseData.courseDescription?.slice(0, 200),
          }}
        ></p>

        {/* Rating */}
        <div className="flex items-center space-x-2 pt-3 pb-1 text-sm">
          <p>{calculateRating(courseData)}</p>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <img
                className="w-3.5 h-3.5"
                key={i}
                src={
                  i < Math.floor(calculateRating(courseData))
                    ? assets.star
                    : assets.star_blank
                }
                alt="star"
              />
            ))}
          </div>
          <p className="text-blue-600">
            ({courseData.courseRatings.length}{" "}
            {courseData.courseRatings.length > 1 ? "ratings" : "rating"})
          </p>
          <p>
            {courseData.enrolledStudents.length}{" "}
            {courseData.enrolledStudents.length > 1
              ? "students"
              : "student"}
          </p>
        </div>

        <p className="text-sm">
          Course by{" "}
          <span className="text-blue-600 underline">
            {courseData.educator.name}
          </span>
        </p>

        {/* Course Structure */}
        <div className="pt-8 text-gray-800">
          <h2 className="text-xl font-semibold">Course Structure</h2>
          <div className="pt-5">
            {courseData.courseContent.map((chapter, index) => (
              <div
                className="border border-gray-300 bg-white mb-2 rounded"
                key={index}
              >
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                  onClick={() => toggleSection(index)}
                >
                  <div className="flex items-center gap-2">
                    <img
                      className={`transform transition-transform ${
                        openSections[index] ? "rotate-180" : ""
                      }`}
                      src={assets.down_arrow_icon}
                      alt="down_arrow_icon"
                    />
                    <p className="font-medium md:text-base text-sm">
                      {chapter.chapterTitle}
                    </p>
                  </div>
                  <p className="text-sm">
                    {chapter.chapterContent.length} lectures -{" "}
                    {calculateChapterTime(chapter)}
                  </p>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openSections[index] ? "max-h-[900px]" : "max-h-0"
                  }`}
                >
                  <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
                    {chapter.chapterContent.map((lecture, i) => (
                      <li key={i} className="flex items-start gap-2 py-1">
                        <img
                          onClick={() =>
                            lecture.isPreviewFree &&
                            setPlayerData({
                              videoId: lecture.lectureUrl.split("/").pop(),
                            })
                          }
                          className={`w-4 h-4 mt-1 ${
                            lecture.isPreviewFree
                              ? "cursor-pointer"
                              : "opacity-50"
                          }`}
                          src={assets.play_icon}
                          alt="play_icon"
                        />

                        <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-base">
                          <p>{lecture.lectureTitle}</p>
                          <div className="flex gap-2">
                            {lecture.isPreviewFree && (
                              <p
                                onClick={() =>
                                  setPlayerData({
                                    videoId: lecture.lectureUrl.split("/").pop(),
                                  })
                                }
                                className="text-blue-500 cursor-pointer"
                              >
                                Preview
                              </p>
                            )}
                            <p>
                              {humanizeDuration(
                                lecture.lectureDuration * 60 * 1000,
                                { units: ["h", "m"] }
                              )}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="py-20 text-sm md:text-base">
          <h3 className="text-xl font-semibold text-gray-800">
            Course Description
          </h3>
          <p
            className="pt-3"
            dangerouslySetInnerHTML={{
              __html: courseData.courseDescription,
            }}
          ></p>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="max-w-sm z-10 shadow-md rounded overflow-hidden bg-white min-w-[320px]">
        {playerData ? (
          <YouTube
            videoId={playerData.videoId}
            opts={{ playerVars: { autoplay: 1 } }}
            iframeClassName="w-full aspect-video"
          />
        ) : (
          <img
            src={courseData.courseThumbnail}
            alt="courseThumbnail"
            className="w-full object-cover"
          />
        )}

        <div className="p-5">
          <div className="flex items-center gap-2">
            <img
              className="w-3.5"
              src={assets.time_left_clock_icon}
              alt="time_left_clock_icon"
            />
            <p className="text-red-500">
              <span className="font-medium">5 days</span> left at this price!
            </p>
          </div>

          <div className="flex gap-3 items-center pt-2">
            <p className="text-gray-800 text-2xl font-semibold">
              {currency}{" "}
              {(
                courseData.coursePrice -
                (courseData.discount * courseData.coursePrice) / 100
              ).toFixed(2)}
            </p>
            <p className="text-gray-500 line-through">
              {currency} {courseData.coursePrice}
            </p>
            <p className="text-gray-500">({courseData.discount}% off)</p>
          </div>

          {/* Enroll Section */}
          <div>
            {isAlreadyEnrolled ? (
              <p className="mt-6 w-full py-3 rounded text-center bg-yellow-600 text-white font-medium">
                Already Enrolled
              </p>
            ) : courseData.coursePrice -
                (courseData.discount * courseData.coursePrice) / 100 ===
              0 ? (
              <p className="mt-6 w-full py-3 rounded text-center bg-yellow-600 text-white font-medium">
                Free
              </p>
            ) : (
              <button
                onClick={enrollCourse}
                className="mt-6 w-full py-3 rounded text-center bg-yellow-600 text-white font-medium"
              >
                Enroll Now
              </button>
            )}
          </div>

          {/* My Enrollments Button */}
          <div>
            {isAlreadyEnrolled && (
              <Link to="/my-enrollments">
                <p className="mt-4 w-full text-center py-3 rounded bg-blue-600 text-white font-medium">
                  My Enrollments
                </p>
              </Link>
            )}
          </div>

          <div className="pt-6">
            <p className="text-lg font-medium text-gray-800">
              What's in the course?
            </p>
            <ul className="ml-4 pt-2 text-sm list-disc text-gray-500">
              <li>Lifetime access with free updates</li>
              <li>Step-by-step, hands-on project guidance</li>
              <li>Downloadable resources and source code</li>
              <li>Interactive quizzes</li>
              <li>Certificate of completion</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
