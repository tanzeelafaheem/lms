import React, { useState, useEffect, useContext } from 'react';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { auth, provider } from '../../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { AppContext } from '../../context/AppContext';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const isCourseListPage = window.location.pathname.includes('/course-list');
  const navigate=useContext(AppContext);

  // 🔹 Track login status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
    return () => unsubscribe();
  }, []);

  // 🔹 Google Sign-In
  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      alert(`Welcome ${result.user.displayName}!`);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  // 🔹 Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('Logged out successfully!');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div
      className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 
      ${isCourseListPage ? 'bg-gray-100' : 'bg-orange-200'}`}
    >
      {/* 🔸 Logo */}
      <Link to='/'>
        <img onClick= {()=> navigate('/')}
        src={assets.logo} alt='Logo' className='w-28 lg:w-32 cursor-pointer' />
      </Link>

      {/* 🔸 Desktop Navigation */}
{user ? (
  <div className='hidden md:flex items-center gap-5 text-gray-700'>
    {/* Navigation Links */}
    <div className='flex items-center gap-5'>
      <button>Become Educator</button> | 
      <Link to='/my-enrollments'>My Enrollments</Link>
    </div>

    {/* User Info & Logout */}
    <div className='flex items-center gap-3'>
      <img
        src={user.photoURL || assets.user_icon}
        alt='User'
        className='w-8 h-8 rounded-full border border-gray-300'
      />
      <span className='text-gray-800 font-medium'>{user.displayName}</span>
      <button
        onClick={handleLogout}
        className='bg-red-600 text-white px-5 py-2 rounded-full hover:bg-red-700 transition'
      >
        Logout
      </button>
    </div>
  </div>
) : (
  <div className='hidden md:flex items-center gap-5 text-gray-700'>
    {/* Only Sign In Button for guests */}
    <button
      onClick={handleSignIn}
      className='bg-yellow-600 text-white px-5 py-2 rounded-full hover:bg-yellow-700 transition'
    >
      Sign in / Create Account
    </button>
  </div>
)}

      {/* 🔸 Mobile Navigation */}
<div className="md:hidden flex items-center justify-between w-full text-gray-500">
  
  {/* Navigation Links - show only if user is logged in */}
  {user ? (
    <div className="flex items-center gap-2 sm:gap-5">
      <button>Become Educator</button>
     |<Link to="/my-enrollments"> My Enrollments</Link>
    </div>
  ) : (
    // Empty div to push user icon to the right
    <div></div>
  )}

  {/* User / Login Button always on the right */}
  <button onClick={user ? handleLogout : handleSignIn}>
    <img
      src={user?.photoURL || assets.user_icon}
      alt="User"
      className={`rounded-full border border-gray-300 ${user ? "w-8 h-8" : "w-7 h-7"}`}
    />
  </button>
</div>

    </div>
  );
};

export default Navbar;
