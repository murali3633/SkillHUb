import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SyllabusDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { course } = location.state || {};

  if (!course) {
    return (
      <div className="syllabus-detail-page">
        <div>
          <h2>Course not found</h2>
          <button onClick={() => navigate(-1)} className="btn btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Function to determine the display label for each module/week
  const getModuleLabel = (moduleData, index) => {
    // If it's a module-based structure (from StudentDashboard)
    if (moduleData.module) {
      return moduleData.module;
    }
    // If it's a week-based structure (from FacultyDashboard)
    else if (moduleData.week) {
      return `Week ${moduleData.week}`;
    }
    // Default fallback
    else {
      return `Module ${index + 1}`;
    }
  };

  return (
    <div className="syllabus-detail-page">
      <div>
        <div className="syllabus-header">
          <button onClick={() => navigate(-1)} className="back-btn">
            ← Back to Dashboard
          </button>
          <h1>{course.title}</h1>
          <p className="course-code">{course.code}</p>
          <p className="course-description">{course.description}</p>
        </div>

        <div className="syllabus-content">
          <h2>Module Wise Syllabus</h2>
          
          {course.syllabus && course.syllabus.length > 0 ? (
            <div className="syllabus-grid">
              {course.syllabus.map((moduleData, index) => (
                <div key={index} className="syllabus-week-card">
                  <div className="week-header">
                    <span className="week-number">{getModuleLabel(moduleData, index)}</span>
                    <h3 className="week-topic">{moduleData.topic}</h3>
                  </div>
                  
                  <div className="tutorials-section">
                    <h4>Tutorials:</h4>
                    <ul className="tutorials-list">
                      {moduleData.tutorials && moduleData.tutorials.map((tutorial, tutIndex) => (
                        <li key={tutIndex} className="tutorial-item">
                          <span className="tutorial-icon">📚</span>
                          <span className="tutorial-name">{tutorial}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {moduleData.youtubeLinks && moduleData.youtubeLinks.length > 0 && (
                      <div className="youtube-links">
                        <h4>Video Tutorials:</h4>
                        <ul className="links-list">
                          {moduleData.youtubeLinks.map((link, linkIndex) => (
                            <li key={linkIndex} className="link-item">
                              <a 
                                href={link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="youtube-link"
                              >
                                🎥 Tutorial Video {linkIndex + 1}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-syllabus">No syllabus available for this course.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SyllabusDetail;