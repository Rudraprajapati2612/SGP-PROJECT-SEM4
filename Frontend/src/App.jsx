import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './index.css';
import HomePage from './ownComponent/HomePage';
import AdminDashboard from './ownComponent/AdminDashboard';
import LoginPage from './ownComponent/LoginPage';
import AdminRegistration from './ownComponent/Adminregestration';
import StudentDashboard from './ownComponent/StudentDashboard';
import ProfileUpdate from './ownComponent/ProfileUpdate'; // Add this import

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/AdminRegestration" element={<AdminRegistration />} />
        <Route path="/StudentDashboard" element={<StudentDashboard />} />
        <Route path="/ProfileUpdate" element={<ProfileUpdate />} /> {/* Add this route */}
      </Routes>
    </Router>
  );
}

export default App;