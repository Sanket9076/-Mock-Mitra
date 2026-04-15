import React from 'react'
import { Routes, Route } from 'react-router-dom'

import {Interview} from "../Components/Interview"
import { InterviewTypes } from '../Components/InterviewTypes'
import { Contact } from '../Pages/Contact'
import { Home } from '../Pages/Home'
import { Dashboard } from '../Pages/Dashboard'
import { Login } from '../Pages/Login'
import { Signup } from '../Pages/Signup'


export const MainRoutes = () => {
  return (
    <div>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/interviews' element={<InterviewTypes/>}/>
            <Route path='/contact' element={<Contact/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/interview/:techStack' element={<Interview/>}/>
            <Route path='/dashboard' element={<Dashboard/>}/>
        </Routes>
    </div>
  )
}
