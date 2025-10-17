import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase"; // make sure you have your firebase setup here
import { assets } from "../../assets/assets";

const About = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* ====== Hero Section ====== */}
      <div className="w-full bg-gradient-to-b from-yellow-100 to-orange-50 py-20 px-8 md:px-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Empowering Learning, Everywhere ✨
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
          At <span className="font-semibold text-orange-500">Edemy LMS</span>,
          we believe education should be accessible, engaging, and empowering —
          no matter where you are in the world. Our platform bridges students and
          educators through technology, bringing learning to your fingertips.
        </p>
      </div>

      {/* ====== Mission Section ====== */}
      <div className="max-w-6xl mx-auto py-16 px-8 grid md:grid-cols-2 gap-10 items-center">
        <img
          src={assets.about_image}
          alt="mission"
          className="rounded-2xl shadow-lg w-full"
        />
        <div>
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Our Mission 🚀
          </h2>
          <p className="text-gray-600 leading-relaxed">
            To make education simple, interactive, and available for everyone.
            We help students gain real-world skills through expert-led courses,
            and enable educators to reach global audiences effortlessly.
          </p>
          <p className="mt-3 text-gray-600">
            With tools for progress tracking, interactive content, and
            community-based learning, we redefine what online education feels
            like.
          </p>
        </div>
      </div>

      {/* ====== Vision Section ====== */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-100 w-full py-16">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Our Vision 🌎
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We envision a world where learning is limitless — where every person
            has the freedom to learn, grow, and inspire others without
            boundaries. We’re here to make that future a reality.
          </p>
        </div>
      </div>

      {/* ====== Team Section ====== */}
      <div className="max-w-6xl mx-auto py-16 px-8 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Meet Our Team 💡
        </h2>
        <p className="text-gray-600 mb-10">
          A group of passionate creators, developers, and educators committed to
          transforming how the world learns.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center hover:shadow-lg transition"
            >
              <img
                src={assets[`team${i}`]}
                alt={`team${i}`}
                className="w-24 h-24 rounded-full mb-4 object-cover"
              />
              <h3 className="text-lg font-semibold text-gray-800">
                Team Member {i}
              </h3>
              <p className="text-gray-500 text-sm">Developer / Designer</p>
            </div>
          ))}
        </div>
      </div>

      {/* ====== Join Us Section ====== */}
      <div className="bg-gradient-to-b from-yellow-100 to-orange-50 w-full py-20 px-8 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-3">
          {user ? "Welcome Back! 🎉" : "Join Our Learning Community 💫"}
        </h2>

        <p className="text-gray-600 max-w-xl mx-auto leading-relaxed mb-8">
          {user
            ? "You're already part of our growing learner family! Explore new courses and keep growing with Edemy LMS."
            : "Be part of a global learning revolution. Sign up to explore courses, connect with mentors, and unlock your potential!"}
        </p>

        {user ? (
          <Link
            to="/course-list"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md font-medium transition"
          >
            Explore Courses
          </Link>
        ) : (
          <button
            onClick={handleSignIn}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md font-medium transition"
          >
            Join Now
          </button>
        )}
      </div>
    </div>
  );
};

export default About;
