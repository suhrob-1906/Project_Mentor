import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Results from './pages/Results';
import Landing from './pages/Landing';
import Test from './pages/Test';
import Homework from './pages/Homework';
import Course from './pages/Course';
import CourseCompletion from './pages/CourseCompletion';
import { useState, useEffect } from 'react';
import api from './api';

// Simple Protected Route
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('/auth/profile/');
      setUser(res.data);
    } catch (err) {
      console.error("Profile fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const isChild = user?.age <= 14;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-500 ${isChild ? 'bg-yellow-400 font-["Outfit"]' : 'bg-gray-50 font-sans'}`}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login onLoginSuccess={fetchProfile} />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><Dashboard isChild={isChild} /></ProtectedRoute>}
          />
          <Route
            path="/test"
            element={<ProtectedRoute><Test isChild={isChild} /></ProtectedRoute>}
          />
          <Route
            path="/results"
            element={<ProtectedRoute><Results isChild={isChild} /></ProtectedRoute>}
          />
          <Route
            path="/homework"
            element={<ProtectedRoute><Homework isChild={isChild} /></ProtectedRoute>}
          />
          <Route
            path="/courses"
            element={<Navigate to="/dashboard" replace />}
          />
          <Route
            path="/courses/:slug"
            element={<ProtectedRoute><Course isChild={isChild} /></ProtectedRoute>}
          />
          <Route
            path="/courses/:slug/completion"
            element={<ProtectedRoute><Results isChild={isChild} /></ProtectedRoute>}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
