import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(6);
  const [isLoading, setIsLoading] = useState(true);

  // Mock course data - memoized to prevent unnecessary re-renders
  const mockCourses = useMemo(() => [
    {
      id: 1,
      title: 'Web Development Fundamentals',
      code: 'WEB101',
      category: 'Programming',
      description: 'Learn HTML, CSS, and JavaScript basics for web development.',
      instructor: 'Dr. Smith',
      duration: '8 weeks',
      level: 'Beginner',
      maxStudents: 30,
      enrolled: 15,
      startDate: '2024-02-01',
      endDate: '2024-03-28'
    },
    {
      id: 2,
      title: 'Data Structures and Algorithms',
      code: 'DSA201',
      category: 'Programming',
      description: 'Master fundamental data structures and algorithmic thinking.',
      instructor: 'Prof. Johnson',
      duration: '12 weeks',
      level: 'Intermediate',
      maxStudents: 25,
      enrolled: 20,
      startDate: '2024-02-15',
      endDate: '2024-05-10'
    },
    {
      id: 3,
      title: 'Digital Marketing Strategy',
      code: 'DIG301',
      category: 'Marketing',
      description: 'Comprehensive course on digital marketing strategies and tools.',
      instructor: 'Ms. Davis',
      duration: '6 weeks',
      level: 'Beginner',
      maxStudents: 40,
      enrolled: 35,
      startDate: '2024-03-01',
      endDate: '2024-04-12'
    },
    {
      id: 4,
      title: 'Machine Learning Basics',
      code: 'ML401',
      category: 'Data Science',
      description: 'Introduction to machine learning concepts and applications.',
      instructor: 'Dr. Wilson',
      duration: '10 weeks',
      level: 'Intermediate',
      maxStudents: 20,
      enrolled: 18,
      startDate: '2024-02-20',
      endDate: '2024-05-01'
    },
    {
      id: 5,
      title: 'Project Management',
      code: 'PM501',
      category: 'Management',
      description: 'Learn project management methodologies and best practices.',
      instructor: 'Mr. Brown',
      duration: '8 weeks',
      level: 'Beginner',
      maxStudents: 35,
      enrolled: 28,
      startDate: '2024-03-10',
      endDate: '2024-05-02'
    },
    {
      id: 6,
      title: 'UI/UX Design Principles',
      code: 'UX601',
      category: 'Design',
      description: 'Master user interface and user experience design principles.',
      instructor: 'Ms. Garcia',
      duration: '7 weeks',
      level: 'Beginner',
      maxStudents: 30,
      enrolled: 22,
      startDate: '2024-03-15',
      endDate: '2024-05-03'
    },
    {
      id: 7,
      title: 'Advanced Python Programming',
      code: 'PY701',
      category: 'Programming',
      description: 'Deep dive into advanced Python concepts and frameworks.',
      instructor: 'Dr. Lee',
      duration: '9 weeks',
      level: 'Advanced',
      maxStudents: 25,
      enrolled: 15,
      startDate: '2024-04-01',
      endDate: '2024-06-01'
    },
    {
      id: 8,
      title: 'Business Analytics',
      code: 'BA801',
      category: 'Data Science',
      description: 'Learn to analyze business data and make data-driven decisions.',
      instructor: 'Prof. Taylor',
      duration: '8 weeks',
      level: 'Intermediate',
      maxStudents: 30,
      enrolled: 25,
      startDate: '2024-04-10',
      endDate: '2024-06-05'
    }
  ], []);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setCourses(mockCourses);
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
  }, [user?.id, mockCourses]);

  // Save enrolled courses to localStorage whenever it changes
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`enrolledCourses_${user.id}`, JSON.stringify(enrolledCourses));
    }
  }, [enrolledCourses, user?.id]);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(courses.map(course => course.category))];
    return uniqueCategories;
  }, [courses]);

  // Filter and search courses
  const filteredCourses = useMemo(() => {
    let filtered = courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || course.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'date':
          return new Date(a.startDate) - new Date(b.startDate);
        case 'level':
          const levelOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
          return levelOrder[a.level] - levelOrder[b.level];
        default:
          return 0;
      }
    });

    return filtered;
  }, [courses, searchTerm, selectedCategory, sortBy]);

  // Pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  // Check if student is enrolled in a course
  const isEnrolled = (courseId) => {
    return enrolledCourses.some(course => course.id === courseId);
  };

  // Register for a course
  const registerForCourse = (course) => {
    if (isEnrolled(course.id)) {
      alert('You are already enrolled in this course!');
      return;
    }

    if (course.enrolled >= course.maxStudents) {
      alert('This course is full!');
      return;
    }

    const enrollmentData = {
      ...course,
      enrolledAt: new Date().toISOString(),
      studentName: user.name,
      registrationNumber: user.registrationNumber
    };

    setEnrolledCourses(prev => [...prev, enrollmentData]);
    
    // Update course enrollment count
    setCourses(prev => prev.map(c => 
      c.id === course.id ? { ...c, enrolled: c.enrolled + 1 } : c
    ));

    alert(`Successfully enrolled in ${course.title}!`);
  };

  // Unenroll from a course
  const unenrollFromCourse = (courseId) => {
    const course = enrolledCourses.find(c => c.id === courseId);
    if (course) {
      setEnrolledCourses(prev => prev.filter(c => c.id !== courseId));
      
      // Update course enrollment count
      setCourses(prev => prev.map(c => 
        c.id === courseId ? { ...c, enrolled: c.enrolled - 1 } : c
      ));

      alert(`Successfully unenrolled from ${course.title}!`);
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="large" message="Loading your dashboard..." overlay={true} />;
  }

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1 className="dashboard-title">
            <span className="title-icon">🎓</span>
            Student Dashboard
          </h1>
          <p className="welcome-message">
            Welcome back, <span className="user-name">{user?.name}</span>! 
            <span className="reg-number">({user?.registrationNumber})</span>
          </p>
        </div>
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <div className="stat-number">{enrolledCourses.length}</div>
              <div className="stat-label">Enrolled</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-number">{filteredCourses.length}</div>
              <div className="stat-label">Available</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <div className="stat-number">{Math.round((enrolledCourses.length / (enrolledCourses.length + filteredCourses.length)) * 100) || 0}%</div>
              <div className="stat-label">Progress</div>
            </div>
          </div>
        </div>
      </div>

      {/* My Courses Section */}
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

      {/* Available Courses Section */}
      <div className="available-courses-section">
        <h2>Available Skill Courses</h2>
        
        {/* Search and Filter Controls */}
        <div className="course-controls">
          <div className="search-filter-row">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-controls">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-filter"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="title">Sort by Title</option>
                <option value="date">Sort by Start Date</option>
                <option value="level">Sort by Level</option>
              </select>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="courses-grid">
          {currentCourses.map(course => (
            <div key={course.id} className="course-card">
              <div className="course-header">
                <div className="course-title-section">
                  <h3 className="course-title">{course.title}</h3>
                  <span className="course-code">{course.code}</span>
                </div>
                <div className="course-status">
                  {isEnrolled(course.id) && (
                    <span className="status-badge enrolled">Enrolled</span>
                  )}
                  {course.enrolled >= course.maxStudents && !isEnrolled(course.id) && (
                    <span className="status-badge full">Full</span>
                  )}
                </div>
              </div>
              
              <div className="course-meta">
                <span className="course-category">{course.category}</span>
                <span className={`course-level level-${course.level.toLowerCase()}`}>{course.level}</span>
              </div>
              
              <p className="course-description">{course.description}</p>
              
              <div className="course-details">
                <div className="detail-row">
                  <div className="detail-item">
                    <span className="detail-icon">👨‍🏫</span>
                    <span className="detail-text">{course.instructor}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">⏱️</span>
                    <span className="detail-text">{course.duration}</span>
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-item">
                    <span className="detail-icon">📅</span>
                    <span className="detail-text">{new Date(course.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">👥</span>
                    <span className="detail-text">{course.enrolled}/{course.maxStudents}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar for Enrollment */}
              <div className="enrollment-progress">
                <div className="progress-label">Enrollment Progress</div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(course.enrolled / course.maxStudents) * 100}%` }}
                  ></div>
                </div>
                <div className="progress-text">{course.enrolled}/{course.maxStudents} students</div>
              </div>
              
              <div className="course-actions">
                <button
                  type="button"
                  onClick={() => registerForCourse(course)}
                  disabled={isEnrolled(course.id) || course.enrolled >= course.maxStudents}
                  className={`register-btn ${
                    isEnrolled(course.id) ? 'enrolled' : 
                    course.enrolled >= course.maxStudents ? 'full' : ''
                  }`}
                >
                  <span className="btn-icon">
                    {isEnrolled(course.id) ? '✓' : 
                     course.enrolled >= course.maxStudents ? '🔒' : '📝'}
                  </span>
                  {isEnrolled(course.id) ? 'Enrolled' : 
                   course.enrolled >= course.maxStudents ? 'Full' : 'Register Now'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              type="button"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            
            <div className="pagination-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              type="button"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        )}

        {/* Results Summary */}
        <div className="results-summary">
          Showing {indexOfFirstCourse + 1}-{Math.min(indexOfLastCourse, filteredCourses.length)} of {filteredCourses.length} courses
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
