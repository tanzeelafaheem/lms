import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { auth, provider } from "../../firebase";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";

const CallToAction = () => {
  const [user, setUser] = useState(null);

  // 🔹 Track login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 🔹 Sign in with Google
  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  // 🔹 Sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 pt-10 pb-24 px-8 md:px-0">
      <h1 className="text-xl md:text-4xl text-gray-800 font-semibold">
        Learn anything, anytime, anywhere
      </h1>
      <p className="text-gray-500 sm:text-sm max-w-xl text-center leading-relaxed">
        Whether you're a student looking to enhance your skills or an educator
        wanting to share knowledge, ELearn is the perfect platform for you.
      </p>

      <div className="flex items-center font-medium gap-6 mt-4">
        {user ? (
          <button
            onClick={handleSignOut}
            className="px-10 py-3 rounded-md text-white bg-yellow-600"
          >
            Sign Out
          </button>
        ) : (
          <button
            onClick={handleSignIn}
            className="px-10 py-3 rounded-md text-white bg-yellow-600"
          >
            Get Started
          </button>
        )}

        <Link to="/about">
          <button className="flex items-center gap-2">
            Learn more <img src={assets.arrow_icon} alt="arrow_icon" />
          </button>
        </Link>
      </div>

      {user && (
        <p className="text-gray-700 mt-4 text-sm">
          Logged in as <span className="font-semibold">{user.displayName}</span>
        </p>
      )}
    </div>
  );
};

export default CallToAction;
