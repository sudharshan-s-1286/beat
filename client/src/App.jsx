import React from 'react'
import Header from './Components/Header'
import Footer from './Components/Footer'
import Home from './Pages/Home'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import About from './Pages/About'
import Dashboard from './Dashboard/Dashboard'
import Music from './Pages/Music'

const Layout = () => {
  const location = useLocation();
  const hide = ['/signin', '/signup', '/dashboard'];
  const hideLayout = hide.includes(location.pathname);

  return (
    <>
      {!hideLayout && <Header />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/music' element={<Music />} />
      </Routes>
      {!hideLayout && <Footer />}
    </>
  )
}

const App = () => {
  return (
    <div>
      <Router>
        <Layout />
      </Router>
    </div>
  )
}

export default App