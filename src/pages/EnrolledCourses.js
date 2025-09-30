import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const EnrolledCourses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load enrolled courses from localStorage
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Load enrolled courses from localStorage
        const savedEnrolled = localStorage.getItem(`enrolledCourses_${user?.id}`);
        if (savedEnrolled) {
          setEnrolledCourses(JSON.parse(savedEnrolled));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  // Unenroll from a course
  const unenrollFromCourse = (courseId) => {
    const course = enrolledCourses.find(c => c.id === courseId);
    if (course) {
      setEnrolledCourses(prev => prev.filter(c => c.id !== courseId));
      
      // Update course enrollment count in localStorage
      const allCourses = JSON.parse(localStorage.getItem('allCourses') || '[]');
      const updatedCourses = allCourses.map(c => 
        c.id === courseId ? { ...c, enrolled: c.enrolled - 1 } : c
      );
      localStorage.setItem('allCourses', JSON.stringify(updatedCourses));
      
      // Update enrolled courses in localStorage
      const updatedEnrolled = enrolledCourses.filter(c => c.id !== courseId);
      localStorage.setItem(`enrolledCourses_${user?.id}`, JSON.stringify(updatedEnrolled));

      alert(`Successfully unenrolled from ${course.title}!`);
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="large" message="Loading your enrolled courses..." overlay={true} />;
  }

  return (
    <div className="enrolled-courses-page">
      <div className="my-courses-section">
        <h2>My Enrolled Courses ({enrolledCourses.length})</h2>
        {enrolledCourses.length > 0 ? (
          <div className="enrolled-courses-grid">
            {enrolledCourses.map(course => (
              <div key={course.id} className="enrolled-course-card">
                <h3>{course.title}</h3>
                <p className="course-code">{course.code}</p>
                <p className="course-category">{course.category}</p>
                <p className="enrollment-date">
                  Enrolled: {new Date(course.enrolledAt).toLocaleDateString()}
                </p>
                <button 
                  type="button"
                  onClick={() => unenrollFromCourse(course.id)}
                  className="unenroll-btn"
                >
                  Unenroll
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-courses">You haven't enrolled in any courses yet.</p>
        )}
      </div>
    </div>
  );
};

export default EnrolledCourses;