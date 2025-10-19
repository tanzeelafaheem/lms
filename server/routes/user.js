import express from "express";
import { 
  addUserRating, 
  getUserCourseProgress, 
  getUserData, 
  purchaseCourse, 
  updateUserCourseProgress, 
  userEnrolledCourses,
  createOrLoginUser
} from "../controllers/userController.js";
import { verifyFirebaseToken } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

// Login / Create Account
userRouter.post("/login", verifyFirebaseToken, createOrLoginUser);

userRouter.get('/data', verifyFirebaseToken, getUserData);
userRouter.get('/enrolled-courses', verifyFirebaseToken, userEnrolledCourses);
userRouter.post('/purchase', verifyFirebaseToken, purchaseCourse);
userRouter.post('/update-course-progress', verifyFirebaseToken, updateUserCourseProgress);
userRouter.post('/get-course-progress', verifyFirebaseToken, getUserCourseProgress);
userRouter.post('/add-rating', verifyFirebaseToken, addUserRating);

export default userRouter;
