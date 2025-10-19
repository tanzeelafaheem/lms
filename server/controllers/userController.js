import Course from "../models/Course.js"; 
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";
import { CourseProgress } from "../models/CourseProgress.js";

// Create or login user (Firebase + MongoDB)
export const createOrLoginUser = async (req, res) => {
  try {
    const { uid, email, name, picture } = req.user; // comes from Firebase token

    if (!uid || !email) {
      return res.status(400).json({ success: false, message: "Invalid Firebase user data" });
    }

    // Check if user already exists in MongoDB
    let user = await User.findById(uid);

    if (!user) {
      // Create new user in MongoDB
      user = await User.create({
        _id: uid, // use Firebase uid as _id
        name: name || "Anonymous",
        email,
        imageUrl: picture || "",
        enrolledCourses: [],
      });
    }

    res.json({ success: true, user, message: "User login successful" });
  } catch (error) {
    console.error("Create/Login User Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user data
export const getUserData = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// User enrolled courses
export const userEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.uid;
    const userData = await User.findById(userId).populate("enrolledCourses");

    res.json({ success: true, enrolledCourses: userData.enrolledCourses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Purchase (Enroll) Course
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.uid;

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.json({ success: false, message: "User or Course not found" });
    }

    // Check if already enrolled
    if (user.enrolledCourses.includes(courseId)) {
      return res.json({ success: false, message: "Course already enrolled" });
    }

    // Create a Purchase record
    const purchaseData = {
      courseId: course._id,
      userId,
      amount: (course.coursePrice - (course.discount * course.coursePrice) / 100).toFixed(2),
    };
    await Purchase.create(purchaseData);

    // Add to user enrolled courses
    user.enrolledCourses.push(courseId);
    await user.save();

    res.json({ success: true, message: "Course enrolled successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update user course progress
export const updateUserCourseProgress = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { courseId, lectureId } = req.body;
    const progressData = await CourseProgress.findOne({ userId, courseId });

    if (progressData) {
      if (progressData.lectureCompleted.includes(lectureId)) {
        return res.json({ success: true, message: "Lecture already completed" });
      }

      progressData.lectureCompleted.push(lectureId);
      progressData.completed = true;
      await progressData.save();
    } else {
      await CourseProgress.create({
        userId,
        courseId,
        lectureCompleted: [lectureId],
      });
    }

    res.json({ success: true, message: "Progress updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get user course progress
export const getUserCourseProgress = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { courseId } = req.body;
    const progressData = await CourseProgress.findOne({ userId, courseId });
    res.json({ success: true, progressData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Add user rating
export const addUserRating = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { courseId, rating } = req.body;

    if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
      return res.json({ success: false, message: "Invalid details" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.json({ success: false, message: "Course not found!" });
    }

    const user = await User.findById(userId);
    if (!user || !user.enrolledCourses.includes(courseId)) {
      return res.json({
        success: false,
        message: "User has not purchased this course.",
      });
    }

    const existingRatingIndex = course.courseRatings.findIndex(
      (r) => r.userId.toString() === userId
    );

    if (existingRatingIndex > -1) {
      course.courseRatings[existingRatingIndex].rating = rating;
    } else {
      course.courseRatings.push({ userId, rating });
    }

    await course.save();
    res.json({ success: true, message: "Rating added" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
