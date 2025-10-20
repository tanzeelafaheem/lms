import React, { useState, useEffect, useContext } from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { auth, provider } from "../../firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { AppContext } from "../../context/AppContext";
import logo_new from '../../assets/logo_new.svg';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const isCourseListPage = window.location.pathname.includes("/course-list");
  const { navigate, isEducator, setIsEducator } = useContext(AppContext);

  const BACKEND_URI = import.meta.env.VITE_BACKEND_URI || "http://localhost:5000/api";

  // Track login status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Get Firebase ID token
          const token = await currentUser.getIdToken();

          // Send token to backend to create/login user
          const res = await fetch(`${BACKEND_URI}/users/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              uid: currentUser.uid,
              email: currentUser.email,
              name: currentUser.displayName,
              picture: currentUser.photoURL,
            }),
          });

          const data = await res.json();
          if (data.success) {
            setUser(data.user);
          } else {
            console.error("Backend login failed:", data.message);
          }
        } catch (error) {
          console.error("Error fetching backend login:", error);
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [BACKEND_URI]);

  // Google Sign-In
  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
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
      <img
  onClick={() => navigate("/")}
  src={logo_new}
  alt="Logo"
  className="h-10 lg:h-12 cursor-pointer object-contain"
/>


      {/* Desktop Navigation */}
      {user ? (
        <div className="hidden md:flex items-center gap-5 text-gray-700">
          <div className="flex items-center gap-5">
            <button onClick={handleEducatorClick} className="hover:underline cursor-pointer">
              {isEducator ? "Educator Dashboard" : "Become Educator"}
            </button>
            <span>|</span>
            <Link to="/my-enrollments" className="hover:underline">
              My Enrollments
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <img
              src={user.imageUrl || assets.user_icon}
              alt="User"
              className="w-8 h-10 rounded-full border border-gray-300"
            />
            <span className="text-gray-800 font-medium">{user.name}</span>
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
            className="bg-yellow-600 text-white px-5 py-2 rounded-full hover:bg-yellow-700 transition cursor-pointer"
          >
            Sign in / Create Account
          </button>
        </div>
      )}

      {/* Mobile Navigation */}
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
            src={user?.imageUrl || assets.user_icon}
            alt="User"
            className={`rounded-full border border-gray-300 ${user ? "w-8 h-8" : "w-7 h-7"}`}
          />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
