import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Playlist from './Playlist'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { StrictMode } from "react";
import { RecoilRoot } from "recoil";



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecoilRoot>
      <Router>
        <Routes>
          <Route path='/*' element={<App/>}></Route>
        </Routes>
      </Router>
    </RecoilRoot>
  </React.StrictMode>,
)