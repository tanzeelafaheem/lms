import React, { useEffect, useState } from "react";
import { assets, dummyEducatorData } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
// import Logger from "../Logger";
import { auth } from "../../firebase"; // ✅ Import Firebase auth instance
import { onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = () => {
	const [user, setUser] = useState(null);
	const educatorData = dummyEducatorData;
	const navigate = useNavigate();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
		});
		return () => unsubscribe();
	}, []);

	const handleLogout = async () => {
		try {
			await signOut(auth);
			setUser(null);
			navigate("/");
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	return (
		<div className="flex items-center justify-between px-4 md:px-8 border-b border-white py-3 bg-yellow-200">
			<Link to="/">
				<img src={assets.logo} alt="logo" className="w-28 lg:w-32" />
			</Link>

			<div className="flex items-center gap-5 text-gray-600 relative">
				{/* Logger for developers */}
				<div className="hidden md:block">
					{/* <Logger /> */}
				</div>

				{/* Greeting */}
				<p className="font-medium">
					Hi! {user ? user.displayName || user.email.split("@")[0] : "Developer"}
				</p>

				{/* Profile or Auth buttons */}
				{user ? (
					<div className="flex items-center gap-3">
						<img
							src={user.photoURL || assets.profile_img}
							alt="profile"
							className="w-9 h-9 rounded-full border border-gray-400"
						/>
						<button
							onClick={handleLogout}
							className="px-3 py-1 text-sm text-white bg-orange-600 rounded-md hover:bg-red-600 cursor-pointer"
						>
							Logout
						</button>
					</div>
				) : (
					<Link
						to="/login"
						className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
					>
						Login
					</Link>
				)}
			</div>
		</div>
	);
};

export default Navbar;
