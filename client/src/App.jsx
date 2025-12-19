import React, { useContext, useState, useEffect } from 'react'
import Header from './Components/Header'
import Footer from './Components/Footer'
import Home from './Pages/Home'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import About from './Pages/About'
import Dashboard from './Dashboard/Dashboard'
import Music from './Pages/Music'
import Favorites from './Pages/Favorites' // Import Favorites
import { PlayerProvider, PlayerContext } from './Context/PlayerContext'
import BottomPlayer from './Components/BottomPlayer'

// Protected Route Component
const ProtectedRoute = ({ isAuth, children }) => {
  if (!isAuth) {
    return <Navigate to="/signin" replace />;
  }
  return children;
};

const Layout = ({ isAuth, setIsAuth }) => { // Accept props
  const location = useLocation();
  const hide = ['/signin', '/signup', '/dashboard'];
  const hideLayout = hide.includes(location.pathname);

  return (
    <>
      {!hideLayout && <Header isAuth={isAuth} setIsAuth={setIsAuth} />}
      <div className={!hideLayout ? "pb-28" : ""}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />

          {/* Prevent authenticated users from seeing signin/signup */}
          <Route path='/signin' element={isAuth ? <Navigate to="/music" /> : <SignIn setIsAuth={setIsAuth} />} />
          <Route path='/signup' element={isAuth ? <Navigate to="/music" /> : <SignUp setIsAuth={setIsAuth} />} />

          <Route path='/dashboard' element={<Dashboard />} />

          {/* Protected Routes */}
          <Route
            path='/music'
            element={
              <ProtectedRoute isAuth={isAuth}>
                <Music />
              </ProtectedRoute>
            }
          />
          <Route
            path='/favorites'
            element={
              <ProtectedRoute isAuth={isAuth}>
                <Favorites />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      {/* Show BottomPlayer only if authenticated and not in hidden layout */}
      {!hideLayout && isAuth && <BottomPlayer />}
      {!hideLayout && <Footer />}
    </>
  )
}

const App = () => {
  // Global Auth State
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));

  return (
    <PlayerProvider>
      <Router>
        <Layout isAuth={isAuth} setIsAuth={setIsAuth} />
      </Router>
    </PlayerProvider>
  )
}

export default App