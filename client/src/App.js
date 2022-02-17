import React from 'react'
import Dashboard from './pages/Dashboard'
import Reports from './pages/Reports'
import Users from './pages/Users'
import Manage from './pages/Manage'
import Login from './pages/Login'
import { Navigate, Routes, Route, BrowserRouter } from 'react-router-dom'

function App () {
  return (
    <div>
      {/* Routes to pages */}
      <BrowserRouter basename='/'>
        <Routes>
          <Route exact path='/' element={<Navigate replace to='login' />} />
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/dashboard' element={<Dashboard />} />
          <Route exact path='/reports' element={<Reports />} />
          <Route exact path='/users' element={<Users />} />
          <Route exact path='/manage' element={<Manage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
