import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import EnrolledCourses from './pages/EnrolledCourses';
import FacultyDashboard from './pages/FacultyDashboard';
import SyllabusDetail from './components/SyllabusDetail';
import Unauthorized from './pages/Unauthorized';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <div className="App">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  
                  {/* Protected Routes */}
                  <Route 
                    path="/student-dashboard" 
                    element={
                      <PrivateRoute requiredRole="student">
                        <EnrolledCourses />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/available-courses" 
                    element={
                      <PrivateRoute requiredRole="student">
                        <StudentDashboard />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/faculty-dashboard" 
                    element={
                      <PrivateRoute requiredRole="faculty">
                        <FacultyDashboard />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/syllabus-detail" 
                    element={
                      <PrivateRoute requiredRole="student">
                        <SyllabusDetail />
                      </PrivateRoute>
                    } 
                  />
                </Routes>
              </main>
            </div>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;