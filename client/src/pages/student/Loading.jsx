import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const Loading = () => {

  const {path} = useParams()

  const navigate = useNavigate();

  useEffect(() => {
    if (path) {
      const timer = setTimeout(() => {
        navigate(`/${path}`);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);
  // }, [path, navigate]);

  return (
    <div className='min-h-[10vh] flex items-center justify-center'>
      {/* <div className='w-16 sm:w-20 aspect-square border-4 border-gray-400 border-t-4 border-t-blue-400 rounded-full animate-spin '></div> */}
      <div className="flex space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping animation-delay-400"></div>
           <div className="w-4 h-4 bg-green-500 rounded-full animate-ping animation-delay-400"></div>
           <div className="w-4 h-4 bg-yellow-500 rounded-full animate-ping animation-delay-400"></div>
           <div className="w-4 h-4 bg-red-600 rounded-full animate-ping animation-delay-400"></div>
         </div>
    </div>
  )
}

export default Loading