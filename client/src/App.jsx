import React, { useContext } from 'react'
import Header from './Components/Header'
import Footer from './Components/Footer'
import Home from './Pages/Home'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import About from './Pages/About'
import Dashboard from './Dashboard/Dashboard'
import Music from './Pages/Music'
import { PlayerProvider, PlayerContext } from './Context/PlayerContext'
import BottomPlayer from './Components/BottomPlayer'

const Layout = () => {
  const location = useLocation();
  const hide = ['/signin', '/signup', '/dashboard'];
  const hideLayout = hide.includes(location.pathname);

  // We can access context here if we want adjustments based on player visibility
  // const { currentTrack } = useContext(PlayerContext);

  return (
    <>
      {!hideLayout && <Header />}
      <div className={!hideLayout ? "pb-28" : ""}> {/* Add padding bottom for player space */}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/music' element={<Music />} />
        </Routes>
      </div>
      {!hideLayout && <BottomPlayer />}
      {!hideLayout && <Footer />}
    </>
  )
}

const App = () => {
  return (
    <PlayerProvider>
      <Router>
        <Layout />
      </Router>
    </PlayerProvider>
  )
}

export default App