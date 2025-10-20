import express from "express";
import { getAllCourse, getCourseById} from "../controllers/courseController.js";

const courseRouter = express.Router()

courseRouter.get('/all', getAllCourse);
courseRouter.get('/:id', getCourseById);
//courseRouter.get('/debug', debugAllCourses);

export default courseRouter;