import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Header = ({ isAuth, setIsAuth }) => {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
    navigate("/");
  };

  return (
    <div>
      <header className='font-mono flex justify-around shadow-2xl bg-neutral-900 text-white'>
        <div className='py-5 w-10 h-10'>
          <h1>
            <img src="data:image/png;base64,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"
              alt="" />
          </h1>
        </div>

        <ul className='py-5 flex justify-center gap-x-15'>
          <Link to='/'>
            <li className='transition-all duration-300 ease-in-out hover:text-green-500 text-lg md:text-2xl cursor-pointer'>Home</li>
          </Link>

          {!isAuth && (
            <>
              <Link to='/about'>
                <li className='transition-all duration-300 ease-in-out hover:text-green-500 text-lg md:text-2xl cursor-pointer'>About</li>
              </Link>
              <Link to='/contact'>
                <li className='transition-all duration-300 ease-in-out hover:text-green-500 text-lg md:text-2xl cursor-pointer'>Contact</li>
              </Link>
              <Link to='/signin'>
                <li className='transition-all duration-300 ease-in-out hover:text-green-500 text-lg md:text-2xl cursor-pointer'>Sign In</li>
              </Link>
              <Link to='/signup'>
                <li className='transition-all duration-300 ease-in-out hover:text-green-500 text-lg md:text-2xl cursor-pointer'>Sign Up</li>
              </Link>
            </>
          )}

          {isAuth && (
            <>
              <Link to='/music'>
                <li className='transition-all duration-300 ease-in-out hover:text-green-500 text-lg md:text-2xl cursor-pointer font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600'>Music</li>
              </Link>
              <Link to='/favorites'>
                <li className='transition-all duration-300 ease-in-out hover:text-green-500 text-lg md:text-2xl cursor-pointer'>Favorites</li>
              </Link>
              <li
                onClick={handleLogout}
                className='transition-all duration-300 ease-in-out hover:text-red-500 text-lg md:text-2xl cursor-pointer'
              >
                Logout
              </li>
            </>
          )}
        </ul>
      </header>
    </div>
  )
}

export default Header