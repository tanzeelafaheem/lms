import React, { useEffect, useRef, useState } from "react";
import uniqid from "uniqid";
import Quill from "quill";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import "quill/dist/quill.snow.css";

const AddCourse = () => {
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
  });

  // ----- Chapter Handlers -----
  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      const title = prompt("Enter Chapter Name:");
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder:
            chapters.length > 0 ? chapters[chapters.length - 1].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
        toast.success("Chapter added successfully!");
      }
    } else if (action === "remove") {
      setChapters(chapters.filter((ch) => ch.chapterId !== chapterId));
      toast.info("Chapter removed!");
    } else if (action === "toggle") {
      setChapters(
        chapters.map((ch) =>
          ch.chapterId === chapterId ? { ...ch, collapsed: !ch.collapsed } : ch
        )
      );
    }
  };

  // ----- Lecture Handlers -----
  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === "add") {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === "remove") {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            const updatedLectures = [...chapter.chapterContent];
            updatedLectures.splice(lectureIndex, 1);
            return { ...chapter, chapterContent: updatedLectures };
          }
          return chapter;
        })
      );
      toast.info("Lecture removed!");
    }
  };

  const addLecture = () => {
    if (!lectureDetails.lectureTitle || !lectureDetails.lectureUrl) {
      toast.error("Please fill all lecture details!");
      return;
    }

    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureOrder:
              chapter.chapterContent.length > 0
                ? chapter.chapterContent[chapter.chapterContent.length - 1].lectureOrder + 1
                : 1,
            lectureId: uniqid(),
          };
          return { ...chapter, chapterContent: [...chapter.chapterContent, newLecture] };
        }
        return chapter;
      })
    );

    setShowPopup(false);
    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      isPreviewFree: false,
    });
    toast.success("Lecture added successfully!");
  };

  // ----- Submit Handler -----
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please select a course thumbnail!");
      return;
    }

    const dummyCourse = {
      courseTitle,
      courseDescription: quillRef.current.root.innerHTML,
      coursePrice: Number(coursePrice),
      discount: Number(discount),
      courseThumbnail: image.name,
      courseContent: chapters,
    };

    console.log("Dummy Course Data:", dummyCourse);
    toast.success("Course saved locally (Dummy Mode)!");

    // Reset form
    setCourseTitle("");
    setCoursePrice("");
    setDiscount("");
    setImage(null);
    setChapters([]);
    quillRef.current.root.innerHTML = "";
  };

  // ----- Quill Setup -----
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: "snow" });
    }
  }, []);

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col items-start md:p-8 p-4 pt-8 pb-10">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-2xl w-full text-gray-600"
      >
        {/* Title */}
        <div className="flex flex-col gap-1">
          <p>Course Title</p>
          <input
            onChange={(e) => setCourseTitle(e.target.value)}
            value={courseTitle}
            type="text"
            placeholder="Enter course title"
            className="outline-none py-2 px-3 rounded border border-gray-400"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <p>Course Description</p>
          <div ref={editorRef} className="border rounded p-2 min-h-40 bg-white" />
        </div>

        {/* Price & Thumbnail */}
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <p>Course Price</p>
            <input
              onChange={(e) => setCoursePrice(e.target.value)}
              value={coursePrice}
              type="number"
              placeholder="0"
              className="outline-none py-2 px-3 w-28 rounded border border-gray-400"
              required
            />
          </div>

          <div className="flex items-center gap-3 mt-5">
            <p>Thumbnail</p>
            <label htmlFor="thumbnailImage" className="flex items-center gap-3 cursor-pointer">
              <img
                src={assets.file_upload_icon}
                alt="upload_icon"
                className="p-2 bg-blue-500 rounded"
              />
              <input
                type="file"
                id="thumbnailImage"
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/*"
                hidden
              />
              {image && (
                <img
                  className="max-h-10 rounded"
                  src={URL.createObjectURL(image)}
                  alt="preview"
                />
              )}
            </label>
          </div>
        </div>

        {/* Discount */}
        <div className="flex flex-col gap-1">
          <p>Discount %</p>
          <input
            onChange={(e) => setDiscount(e.target.value)}
            value={discount}
            type="number"
            placeholder="0"
            min={0}
            max={100}
            className="outline-none py-2 px-3 w-28 rounded border border-gray-400"
          />
        </div>

        {/* Chapters & Lectures */}
        <div>
          {chapters.map((chapter, i) => (
            <div key={chapter.chapterId} className="bg-white border rounded-lg mb-4 shadow-sm">
              <div className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center gap-2">
                  <img
                    onClick={() => handleChapter("toggle", chapter.chapterId)}
                    src={assets.dropdown_icon}
                    alt=""
                    className={`w-4 cursor-pointer transition-transform ${
                      chapter.collapsed ? "-rotate-90" : ""
                    }`}
                  />
                  <span className="font-semibold">
                    {i + 1}. {chapter.chapterTitle}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-500">
                    {chapter.chapterContent.length} Lectures
                  </span>
                  <img
                    onClick={() => handleChapter("remove", chapter.chapterId)}
                    src={assets.cross_icon}
                    alt=""
                    className="w-4 cursor-pointer"
                  />
                </div>
              </div>

              {!chapter.collapsed && (
                <div className="p-4">
                  {chapter.chapterContent.map((lecture, j) => (
                    <div
                      key={lecture.lectureId}
                      className="flex justify-between items-center mb-2"
                    >
                      <span>
                        {j + 1}. {lecture.lectureTitle} ({lecture.lectureDuration} mins) -{" "}
                        <a href={lecture.lectureUrl} target="_blank" className="text-blue-500">
                          View
                        </a>{" "}
                        - {lecture.isPreviewFree ? "Free Preview" : "Paid"}
                      </span>
                      <img
                        onClick={() => handleLecture("remove", chapter.chapterId, j)}
                        src={assets.cross_icon}
                        alt="remove"
                        className="w-4 cursor-pointer"
                      />
                    </div>
                  ))}

                  <div
                    onClick={() => handleLecture("add", chapter.chapterId)}
                    className="inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2 hover:bg-gray-200"
                  >
                    + Add Lecture
                  </div>
                </div>
              )}
            </div>
          ))}

          <div
            onClick={() => handleChapter("add")}
            className="flex justify-center items-center bg-blue-100 hover:bg-blue-200 p-2 rounded-lg cursor-pointer font-medium"
          >
            + Add Chapter
          </div>
        </div>

        {/* Add Lecture Popup */}
        {showPopup && (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white text-gray-700 p-5 rounded relative w-full max-w-sm shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Add Lecture</h2>

              <div className="mb-3">
                <p>Lecture Title</p>
                <input
                  type="text"
                  className="mt-1 block w-full border rounded py-2 px-2"
                  value={lectureDetails.lectureTitle}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      lectureTitle: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-3">
                <p>Duration (minutes)</p>
                <input
                  type="number"
                  className="mt-1 block w-full border rounded py-2 px-2"
                  value={lectureDetails.lectureDuration}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      lectureDuration: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-3">
                <p>Lecture URL</p>
                <input
                  type="text"
                  className="mt-1 block w-full border rounded py-2 px-2"
                  value={lectureDetails.lectureUrl}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      lectureUrl: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-3 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={lectureDetails.isPreviewFree}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      isPreviewFree: e.target.checked,
                    })
                  }
                />
                <p>Free Preview</p>
              </div>

              <button
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                onClick={addLecture}
                type="button"
              >
                Add Lecture
              </button>

              <img
                onClick={() => setShowPopup(false)}
                src={assets.cross_icon}
                alt="close"
                className="absolute top-4 right-4 w-4 cursor-pointer"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="bg-black font-semibold text-white w-max pt-2.5 px-8 py-2 rounded my-4 hover:bg-gray-900 transition"
        >
          Save Course (Dummy)
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
