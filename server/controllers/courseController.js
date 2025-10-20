import Course from "../models/Course.js";
import mongoose from "mongoose";

export const getAllCourse = async (req,res) => {
    try {
        const courses = await Course.find({isPublished: true}).select(['-courseContent','-enrolledStudents']).populate({path: 'educator'})
        res.json({success: true, courses})
    } catch (error) {
        res.json({success: false, message:error.message})
    }
}

//get by id
export const getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    //console.log("Requested Course ID:", courseId);

    const course = await Course.findOne({
      $or: [
        { _id: courseId },
        { _id: new mongoose.Types.ObjectId(courseId) }
      ]
    })
      .populate("educator", "name email")
      .populate("enrolledStudents", "name email");

    if (!course) {
      console.log("🚫 Course not found for query:", courseId);
      return res.status(404).json({
        success: false,
        message: "Course not found. Please check the course ID."
      });
    }

    //console.log("Course found:", course.courseTitle);
    res.status(200).json({ success: true, course });

  } catch (error) {
    console.error("🔥 Error in getCourseById:", error);
    res.status(500).json({ success: false, message: "Server Error: " + error.message });
  }
};
