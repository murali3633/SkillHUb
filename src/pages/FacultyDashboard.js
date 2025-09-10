import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Analytics from '../components/Analytics';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [showEnrollments, setShowEnrollments] = useState(null);
  const [activeTab, setActiveTab] = useState('courses');
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    category: '',
    description: '',
    capacity: '',
    duration: '',
    level: 'Beginner'
  });
  const [formErrors, setFormErrors] = useState({});

  // Mock enrolled students data (in real app, this would come from API)
  const mockEnrollments = {
    1: [
      { id: 1, name: 'John Student', registrationNumber: 'REG001', enrolledAt: '2024-01-15' },
      { id: 2, name: 'Jane Smith', registrationNumber: 'REG002', enrolledAt: '2024-01-16' },
      { id: 3, name: 'Bob Johnson', registrationNumber: 'REG003', enrolledAt: '2024-01-17' }
    ],
    2: [
      { id: 4, name: 'Alice Brown', registrationNumber: 'REG004', enrolledAt: '2024-01-18' },
      { id: 5, name: 'Charlie Wilson', registrationNumber: 'REG005', enrolledAt: '2024-01-19' }
    ],
    3: [
      { id: 6, name: 'Diana Davis', registrationNumber: 'REG006', enrolledAt: '2024-01-20' },
      { id: 7, name: 'Eve Miller', registrationNumber: 'REG007', enrolledAt: '2024-01-21' },
      { id: 8, name: 'Frank Garcia', registrationNumber: 'REG008', enrolledAt: '2024-01-22' },
      { id: 9, name: 'Grace Lee', registrationNumber: 'REG009', enrolledAt: '2024-01-23' }
    ]
  };

  // Load faculty courses from localStorage
  useEffect(() => {
    const savedCourses = localStorage.getItem(`facultyCourses_${user?.id}`);
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    } else {
      // Initialize with some default courses for the faculty
      const defaultCourses = [
        {
          id: 1,
          title: 'Web Development Fundamentals',
          code: 'WEB101',
          category: 'Programming',
          description: 'Learn HTML, CSS, and JavaScript basics for web development.',
          capacity: 30,
          enrolled: 3,
          duration: '8 weeks',
          level: 'Beginner',
          instructor: user?.name || 'Dr. Smith',
          isActive: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        {
          id: 2,
          title: 'Data Structures and Algorithms',
          code: 'DSA201',
          category: 'Programming',
          description: 'Master fundamental data structures and algorithmic thinking.',
          capacity: 25,
          enrolled: 2,
          duration: '12 weeks',
          level: 'Intermediate',
          instructor: user?.name || 'Dr. Smith',
          isActive: true,
          createdAt: '2024-01-05',
          updatedAt: '2024-01-05'
        },
        {
          id: 3,
          title: 'Digital Marketing Strategy',
          code: 'DIG301',
          category: 'Marketing',
          description: 'Comprehensive course on digital marketing strategies and tools.',
          capacity: 40,
          enrolled: 4,
          duration: '6 weeks',
          level: 'Beginner',
          instructor: user?.name || 'Dr. Smith',
          isActive: true,
          createdAt: '2024-01-10',
          updatedAt: '2024-01-10'
        }
      ];
      setCourses(defaultCourses);
      localStorage.setItem(`facultyCourses_${user?.id}`, JSON.stringify(defaultCourses));
    }
  }, [user?.id, user?.name]);

  // Save courses to localStorage whenever it changes
  useEffect(() => {
    if (user?.id && courses.length > 0) {
      localStorage.setItem(`facultyCourses_${user.id}`, JSON.stringify(courses));
    }
  }, [courses, user?.id]);

  const categories = ['Programming', 'Marketing', 'Data Science', 'Management', 'Design', 'Business', 'Language', 'Other'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!formData.code.trim()) {
      errors.code = 'Code is required';
    } else if (!/^[A-Z]{2,4}\d{3}$/.test(formData.code)) {
      errors.code = 'Code must be in format like WEB101, DSA201, etc.';
    }

    if (!formData.category) {
      errors.category = 'Category is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    if (!formData.capacity || formData.capacity < 1) {
      errors.capacity = 'Capacity must be at least 1';
    }

    if (!formData.duration.trim()) {
      errors.duration = 'Duration is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const courseData = {
      ...formData,
      id: editingCourse ? editingCourse.id : Date.now(),
      enrolled: editingCourse ? editingCourse.enrolled : 0,
      instructor: user?.name || 'Dr. Smith',
      isActive: true,
      createdAt: editingCourse ? editingCourse.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingCourse) {
      setCourses(prev => prev.map(course => 
        course.id === editingCourse.id ? courseData : course
      ));
      alert('Course updated successfully!');
    } else {
      setCourses(prev => [...prev, courseData]);
      alert('Course created successfully!');
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      code: '',
      category: '',
      description: '',
      capacity: '',
      duration: '',
      level: 'Beginner'
    });
    setFormErrors({});
    setShowAddForm(false);
    setEditingCourse(null);
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      code: course.code,
      category: course.category,
      description: course.description,
      capacity: course.capacity.toString(),
      duration: course.duration,
      level: course.level
    });
    setShowAddForm(true);
  };

  const handleSoftDelete = (courseId) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      setCourses(prev => prev.map(course => 
        course.id === courseId ? { ...course, isActive: false } : course
      ));
      alert('Course deleted successfully!');
    }
  };

  const handleRestore = (courseId) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId ? { ...course, isActive: true } : course
    ));
    alert('Course restored successfully!');
  };

  const activeCourses = courses.filter(course => course.isActive);
  const deletedCourses = courses.filter(course => !course.isActive);

  return (
    <div className="faculty-dashboard">
      <div className="dashboard-header">
        <h1>Faculty Dashboard</h1>
        <p>Welcome back, {user?.name}! Manage your courses and students.</p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
        >
          📚 Courses
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Analytics
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'courses' && (
        <>
          {/* Add/Edit Course Form */}
          {showAddForm && (
        <div className="course-form-section">
          <div className="form-container">
            <h2>{editingCourse ? 'Edit Course' : 'Add New Course'}</h2>
            <form onSubmit={handleSubmit} className="course-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">Course Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={formErrors.title ? 'error' : ''}
                    placeholder="Enter course title"
                  />
                  {formErrors.title && <span className="error-message">{formErrors.title}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="code">Course Code *</label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className={formErrors.code ? 'error' : ''}
                    placeholder="e.g., WEB101"
                  />
                  {formErrors.code && <span className="error-message">{formErrors.code}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={formErrors.category ? 'error' : ''}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {formErrors.category && <span className="error-message">{formErrors.category}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="level">Level</label>
                  <select
                    id="level"
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="capacity">Capacity *</label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    className={formErrors.capacity ? 'error' : ''}
                    placeholder="Maximum students"
                    min="1"
                  />
                  {formErrors.capacity && <span className="error-message">{formErrors.capacity}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="duration">Duration *</label>
                  <input
                    type="text"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className={formErrors.duration ? 'error' : ''}
                    placeholder="e.g., 8 weeks"
                  />
                  {formErrors.duration && <span className="error-message">{formErrors.duration}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={formErrors.description ? 'error' : ''}
                  placeholder="Enter course description"
                  rows="4"
                />
                {formErrors.description && <span className="error-message">{formErrors.description}</span>}
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </button>
                <button type="button" onClick={resetForm} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Active Courses Section */}
      <div className="courses-section">
        <div className="section-header">
          <h2>Your Courses ({activeCourses.length})</h2>
          <button 
            onClick={() => setShowAddForm(true)}
            className="add-course-btn"
          >
            + Add New Course
          </button>
        </div>

        {activeCourses.length > 0 ? (
          <div className="courses-grid">
            {activeCourses.map(course => (
              <div key={course.id} className="course-card">
                <div className="course-header">
                  <h3>{course.title}</h3>
                  <span className="course-code">{course.code}</span>
                </div>
                
                <div className="course-category">{course.category}</div>
                <p className="course-description">{course.description}</p>
                
                <div className="course-stats">
                  <div className="stat-item">
                    <span className="label">Enrolled:</span>
                    <span className="value">{course.enrolled}/{course.capacity}</span>
                  </div>
                  <div className="stat-item">
                    <span className="label">Duration:</span>
                    <span className="value">{course.duration}</span>
                  </div>
                  <div className="stat-item">
                    <span className="label">Level:</span>
                    <span className={`value level-${course.level.toLowerCase()}`}>{course.level}</span>
                  </div>
                </div>

                <div className="course-actions">
                  <button 
                    onClick={() => setShowEnrollments(course.id)}
                    className="view-students-btn"
                  >
                    View Students ({course.enrolled})
                  </button>
                  <button 
                    onClick={() => handleEdit(course)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleSoftDelete(course.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-courses">No courses created yet. Click "Add New Course" to get started!</p>
        )}
      </div>

      {/* Deleted Courses Section */}
      {deletedCourses.length > 0 && (
        <div className="deleted-courses-section">
          <h2>Deleted Courses ({deletedCourses.length})</h2>
          <div className="deleted-courses-list">
            {deletedCourses.map(course => (
              <div key={course.id} className="deleted-course-item">
                <div className="course-info">
                  <h4>{course.title} ({course.code})</h4>
                  <p>Deleted on {new Date(course.updatedAt).toLocaleDateString()}</p>
                </div>
                <button 
                  onClick={() => handleRestore(course.id)}
                  className="restore-btn"
                >
                  Restore
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Student Enrollments Modal */}
      {showEnrollments && (
        <div className="enrollments-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Enrolled Students</h3>
              <button 
                onClick={() => setShowEnrollments(null)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            
            <div className="enrollments-table-container">
              <table className="enrollments-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Registration Number</th>
                    <th>Enrolled Date</th>
                  </tr>
                </thead>
                <tbody>
                  {mockEnrollments[showEnrollments]?.map(student => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>{student.registrationNumber}</td>
                      <td>{new Date(student.enrolledAt).toLocaleDateString()}</td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan="3" className="no-enrollments">No students enrolled yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
        </>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <Analytics courses={activeCourses} />
      )}
    </div>
  );
};

export default FacultyDashboard;
