import React, { useState, useEffect, useContext } from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { auth, provider } from "../../firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { AppContext } from "../../context/AppContext";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const isCourseListPage = window.location.pathname.includes("/course-list");
  const { navigate, isEducator, setIsEducator } = useContext(AppContext);

  // Track login status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
    return () => unsubscribe();
  }, []);

  // Google Sign-In
  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      alert(`Welcome ${result.user.displayName}!`);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      alert("Logged out successfully!");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Educator button logic
  const handleEducatorClick = () => {
    if (!user) {
      alert("Please sign in first!");
      return;
    }
    if (isEducator) {
      navigate("/educator");
    } else {
      // mark as educator (temporary — can replace with backend role)
      setIsEducator(true);
      alert("Welcome aboard! You are now an Educator 🎓");
      navigate("/educator");
    }
  };

  return (
    <div
      className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 py-4 
      ${isCourseListPage ? "bg-orange-200" : "bg-yellow-200"}`}
    >
      {/* 🔸 Logo */}
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="w-28 lg:w-32 cursor-pointer"
      />

      {/* 🔸 Desktop Navigation */}
      {user ? (
        <div className="hidden md:flex items-center gap-5 text-gray-700">
          {/* Navigation Links */}
          <div className="flex items-center gap-5">
            <button onClick={handleEducatorClick} className="hover:underline cursor-pointer">
              {isEducator ? "Educator Dashboard" : "Become Educator"}
            </button>
            <span>|</span>
            <Link to="/my-enrollments" className="hover:underline">
              My Enrollments
            </Link>
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center gap-3">
            <img
              src={user.photoURL || assets.user_icon}
              alt="User"
              className="w-8 h-8 rounded-full border border-gray-300"
            />
            <span className="text-gray-800 font-medium">{user.displayName}</span>
            <button
              onClick={handleLogout}
              className="bg-orange-600 text-white px-5 py-2 rounded-full hover:bg-red-600 transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex items-center gap-5 text-gray-700">
          <button
            onClick={handleSignIn}
            className="bg-yellow-600 text-white px-5 py-2 rounded-full hover:bg-yellow-700 transition"
          >
            Sign in / Create Account
          </button>
        </div>
      )}

      {/* 🔸 Mobile Navigation */}
      <div className="md:hidden flex items-center justify-between w-full text-gray-700">
        {user ? (
          <div className="flex items-center gap-2 sm:gap-5">
            <button onClick={handleEducatorClick}>
              {isEducator ? "Dashboard" : "Become Educator"}
            </button>
            <span>|</span>
            <Link to="/my-enrollments">My Enrollments</Link>
          </div>
        ) : (
          <div></div>
        )}

        <button onClick={user ? handleLogout : handleSignIn}>
          <img
            src={user?.photoURL || assets.user_icon}
            alt="User"
            className={`rounded-full border border-gray-300 ${
              user ? "w-8 h-8" : "w-7 h-7"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
