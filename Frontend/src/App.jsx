import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './index.css';
import HomePage from './ownComponent/HomePage';
import AdminDashboard from './ownComponent/AdminDashboard';
import LoginPage from './ownComponent/Login';
import AdminRegistration from './ownComponent/Adminregestration';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/AdminDashboard' element={<AdminDashboard/>}/>
        <Route path='/Login' element={<LoginPage/>}/>
        <Route path='/AdminRegestration' element={<AdminRegistration/>} />
      </Routes>
    </Router>
  );
}

export default App;
