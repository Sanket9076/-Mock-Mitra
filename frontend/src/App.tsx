import React from 'react';
import './App.css';
import { MainRoutes } from './Routes/MainRoutes';
import { NavBar } from './Components/NavBar';
import { Chatbot } from './Components/Chatbot';

function App() {
  return (
    <div className="App">
      <NavBar/>
      <MainRoutes/>
      <Chatbot/>
    </div>
  );
}

export default App;
