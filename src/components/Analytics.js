import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = ({ courses }) => {
  const [timeFilter, setTimeFilter] = useState('all');
  const [selectedChart, setSelectedChart] = useState('enrollments');

  // Mock enrollment data with timestamps for filtering
  const mockEnrollmentData = useMemo(() => ({
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
  }), []);

  // Filter enrollments based on time period
  const filteredEnrollments = useMemo(() => {
    const now = new Date();
    let startDate;

    switch (timeFilter) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'semester':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(0); // All time
    }

    const filtered = {};
    Object.keys(mockEnrollmentData).forEach(courseId => {
      filtered[courseId] = mockEnrollmentData[courseId].filter(enrollment => 
        new Date(enrollment.enrolledAt) >= startDate
      );
    });

    return filtered;
  }, [timeFilter, mockEnrollmentData]);

  // Calculate enrollment statistics
  const enrollmentStats = useMemo(() => {
    return courses.map(course => {
      const enrollments = filteredEnrollments[course.id] || [];
      return {
        id: course.id,
        title: course.title,
        code: course.code,
        category: course.category,
        totalEnrollments: enrollments.length,
        capacity: course.capacity,
        enrollmentRate: course.capacity > 0 ? (enrollments.length / course.capacity) * 100 : 0
      };
    });
  }, [courses, filteredEnrollments]);

  // Prepare data for charts
  const enrollmentChartData = {
    labels: enrollmentStats.map(stat => stat.code),
    datasets: [
      {
        label: 'Enrollments',
        data: enrollmentStats.map(stat => stat.totalEnrollments),
        barThickness: 20,
        maxBarThickness: 22,
        categoryPercentage: 0.5,
        barPercentage: 0.6,
        borderRadius: 6,
        backgroundColor: [
          'rgba(102, 126, 234, 0.8)',
          'rgba(40, 167, 69, 0.8)',
          'rgba(255, 193, 7, 0.8)',
          'rgba(220, 53, 69, 0.8)',
          'rgba(23, 162, 184, 0.8)',
          'rgba(111, 66, 193, 0.8)',
          'rgba(253, 126, 20, 0.8)',
          'rgba(32, 201, 151, 0.8)',
        ],
        borderColor: [
          'rgba(102, 126, 234, 1)',
          'rgba(40, 167, 69, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(220, 53, 69, 1)',
          'rgba(23, 162, 184, 1)',
          'rgba(111, 66, 193, 1)',
          'rgba(253, 126, 20, 1)',
          'rgba(32, 201, 151, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const popularCoursesData = {
    labels: enrollmentStats
      .sort((a, b) => b.totalEnrollments - a.totalEnrollments)
      .slice(0, 5)
      .map(stat => stat.title),
    datasets: [
      {
        data: enrollmentStats
          .sort((a, b) => b.totalEnrollments - a.totalEnrollments)
          .slice(0, 5)
          .map(stat => stat.totalEnrollments),
        backgroundColor: [
          'rgba(102, 126, 234, 0.8)',
          'rgba(40, 167, 69, 0.8)',
          'rgba(255, 193, 7, 0.8)',
          'rgba(220, 53, 69, 0.8)',
          'rgba(23, 162, 184, 0.8)',
        ],
        borderColor: [
          'rgba(102, 126, 234, 1)',
          'rgba(40, 167, 69, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(220, 53, 69, 1)',
          'rgba(23, 162, 184, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#111827',
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      title: {
        display: true,
        text: 'Course Enrollment Analytics',
        color: '#111827',
        font: {
          size: 16,
          weight: '600'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: Math.max(10, Math.max(...enrollmentStats.map(stat => stat.totalEnrollments)) + 2),
        ticks: {
          stepSize: 1,
          color: '#111827',
          font: {
            size: 11
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        border: {
          display: false
        }
      },
      x: {
        ticks: {
          color: '#111827',
          font: {
            size: 11
          }
        },
        grid: {
          display: false
        },
        border: {
          display: false
        }
      }
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#111827'
        }
      },
      title: {
        display: true,
        text: 'Most Popular Courses',
        color: '#111827'
      },
    },
  };

  // Export to CSV function
  const exportToCSV = () => {
    const csvData = [];
    
    // Add header
    csvData.push(['Course Code', 'Course Title', 'Category', 'Enrollments', 'Capacity', 'Enrollment Rate (%)']);
    
    // Add data rows
    enrollmentStats.forEach(stat => {
      csvData.push([
        stat.code,
        stat.title,
        stat.category,
        stat.totalEnrollments,
        stat.capacity,
        stat.enrollmentRate.toFixed(1)
      ]);
    });

    // Convert to CSV string
    const csvString = csvData.map(row => row.join(',')).join('\n');
    
    // Create and download file
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `course_analytics_${timeFilter}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const totalEnrollments = enrollmentStats.reduce((sum, stat) => sum + stat.totalEnrollments, 0);
  const averageEnrollmentRate = enrollmentStats.length > 0 
    ? enrollmentStats.reduce((sum, stat) => sum + stat.enrollmentRate, 0) / enrollmentStats.length 
    : 0;

  return (
    <div
      className="analytics-container"
      style={{
        background: '#ffffff',
        color: '#111827',
        marginLeft: 'calc(50% - 50vw)',
        marginRight: 'calc(50% - 50vw)',
        padding: '24px 24px',
        width: '100vw'
      }}
    >
      <div className="analytics-header" style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0, color: '#0f172a' }}>Course Analytics</h2>
        <p style={{ marginTop: 6, color: 'rgba(17,24,39,0.7)' }}>Track enrollment trends and course performance</p>
      </div>

      {/* Controls */}
      <div className="analytics-controls" style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="filter-controls">
          <label htmlFor="timeFilter" style={{ marginRight: 8 }}>Time Period:</label>
          <select
            id="timeFilter"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="filter-select"
            style={{
              background: '#ffffff',
              color: '#111827',
              border: '1px solid rgba(0,0,0,0.12)',
              borderRadius: 8,
              padding: '8px 10px'
            }}
          >
            <option value="all">All Time</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="semester">Last Semester</option>
          </select>
        </div>

        <div className="chart-controls">
          <label htmlFor="chartType" style={{ marginRight: 8 }}>Chart Type:</label>
          <select
            id="chartType"
            value={selectedChart}
            onChange={(e) => setSelectedChart(e.target.value)}
            className="filter-select"
            style={{
              background: '#ffffff',
              color: '#111827',
              border: '1px solid rgba(0,0,0,0.12)',
              borderRadius: 8,
              padding: '8px 10px'
            }}
          >
            <option value="enrollments">Enrollments per Course</option>
            <option value="popular">Most Popular Courses</option>
          </select>
        </div>

        <button
          onClick={exportToCSV}
          className="export-btn"
          style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 10,
            padding: '10px 14px',
            cursor: 'pointer',
            boxShadow: '0 6px 16px rgba(124,58,237,0.25)'
          }}
        >
          📊 Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards" style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', marginTop: 16 }}>
        <div style={{
          background: 'linear-gradient(135deg, #93c5fd 0%, #c084fc 50%, #fda4af 100%)',
          padding: 2,
          borderRadius: 18
        }}>
          <div className="summary-card" style={{
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.06)',
            borderRadius: 16,
            padding: 20,
            boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)'
          }}>
            <h3 style={{ margin: 0, color: '#0f172a', opacity: 0.9 }}>Total Enrollments</h3>
            <p className="summary-number" style={{ fontSize: 36, fontWeight: 800, margin: '10px 0 6px', color: '#0b1220' }}>{totalEnrollments}</p>
            <p className="summary-label" style={{ color: '#6b7280', margin: 0 }}>across all courses</p>
          </div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #a7f3d0 0%, #93c5fd 50%, #c4b5fd 100%)',
          padding: 2,
          borderRadius: 18
        }}>
          <div className="summary-card" style={{
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.06)',
            borderRadius: 16,
            padding: 20,
            boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)'
          }}>
            <h3 style={{ margin: 0, color: '#0f172a', opacity: 0.9 }}>Active Courses</h3>
            <p className="summary-number" style={{ fontSize: 36, fontWeight: 800, margin: '10px 0 6px', color: '#0b1220' }}>{courses.length}</p>
            <p className="summary-label" style={{ color: '#6b7280', margin: 0 }}>courses available</p>
          </div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #fde68a 0%, #fca5a5 50%, #c4b5fd 100%)',
          padding: 2,
          borderRadius: 18
        }}>
          <div className="summary-card" style={{
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.06)',
            borderRadius: 16,
            padding: 20,
            boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)'
          }}>
            <h3 style={{ margin: 0, color: '#0f172a', opacity: 0.9 }}>Avg. Enrollment Rate</h3>
            <p className="summary-number" style={{ fontSize: 36, fontWeight: 800, margin: '10px 0 6px', color: '#0b1220' }}>{averageEnrollmentRate.toFixed(1)}%</p>
            <p className="summary-label" style={{ color: '#6b7280', margin: 0 }}>capacity utilization</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-container" style={{ marginTop: 16 }}>
        <div className="chart-wrapper" style={{
          background: '#ffffff',
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: 16,
          padding: 20,
          height: 400,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          {selectedChart === 'enrollments' ? (
            <Bar data={enrollmentChartData} options={chartOptions} />
          ) : (
            <Doughnut data={popularCoursesData} options={doughnutOptions} />
          )}
        </div>
      </div>

      {/* Detailed Table */}
      <div className="analytics-table-section" style={{ marginTop: 20 }}>
        <h3 style={{ margin: '0 0 12px', color: '#0f172a' }}>Detailed Course Statistics</h3>
        <div className="table-container" style={{
          background: '#ffffff',
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: 16,
          padding: 12,
          overflowX: 'auto',
          boxShadow: '0 8px 24px rgba(15,23,42,0.06)'
        }}>
          <table className="analytics-table" style={{ width: '100%', borderCollapse: 'collapse', color: '#111827' }}>
            <thead>
              <tr style={{ position: 'sticky', top: 0, background: '#f9fafb', zIndex: 1 }}>
                <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid rgba(0,0,0,0.08)', color: '#0f172a', fontWeight: 600 }}>Course Code</th>
                <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid rgba(0,0,0,0.08)', color: '#0f172a', fontWeight: 600 }}>Course Title</th>
                <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid rgba(0,0,0,0.08)', color: '#0f172a', fontWeight: 600 }}>Category</th>
                <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid rgba(0,0,0,0.08)', color: '#0f172a', fontWeight: 600 }}>Enrollments</th>
                <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid rgba(0,0,0,0.08)', color: '#0f172a', fontWeight: 600 }}>Capacity</th>
                <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid rgba(0,0,0,0.08)', color: '#0f172a', fontWeight: 600 }}>Enrollment Rate</th>
                <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid rgba(0,0,0,0.08)', color: '#0f172a', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {enrollmentStats.map((stat, rowIndex) => (
                <tr key={stat.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', background: rowIndex % 2 === 0 ? '#ffffff' : '#fbfbfb' }}>
                  <td className="course-code" style={{ padding: 12 }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '6px 10px',
                      borderRadius: 999,
                      background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: 13,
                      letterSpacing: 0.3
                    }}>{stat.code}</span>
                  </td>
                  <td className="course-title" style={{ padding: 12, color: '#0b1220', fontWeight: 600, minWidth: 260 }}>{stat.title}</td>
                  <td className="course-category" style={{ padding: 12, minWidth: 160 }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '6px 10px',
                      borderRadius: 10,
                      background: 'rgba(99,102,241,0.08)',
                      color: '#4f46e5',
                      fontWeight: 600,
                      fontSize: 12,
                      letterSpacing: 0.4,
                      textTransform: 'uppercase'
                    }}>{stat.category}</span>
                  </td>
                  <td className="enrollments" style={{ padding: 12, fontWeight: 600, color: '#111827', minWidth: 100 }}>{stat.totalEnrollments}</td>
                  <td className="capacity" style={{ padding: 12, color: '#374151', minWidth: 100 }}>{stat.capacity}</td>
                  <td className="enrollment-rate" style={{ padding: 12, minWidth: 220 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="rate-bar" style={{
                        background: 'rgba(0,0,0,0.06)',
                        borderRadius: 999,
                        position: 'relative',
                        height: 12,
                        overflow: 'hidden',
                        flex: 1
                      }}>
                        <div 
                          className="rate-fill"
                          style={{
                            width: `${Math.min(stat.enrollmentRate, 100)}%`,
                            background: 'linear-gradient(90deg, #34d399, #22d3ee)',
                            height: '100%'
                          }}
                        />
                      </div>
                      <span style={{ fontSize: 13, color: '#0f172a', fontWeight: 700 }}>
                        {stat.enrollmentRate.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="status" style={{ padding: 12, minWidth: 120 }}>
                    <span
                      className={`status-badge ${
                        stat.enrollmentRate >= 80 ? 'high' : 
                        stat.enrollmentRate >= 50 ? 'medium' : 'low'
                      }`}
                      style={{
                        display: 'inline-block',
                        padding: '6px 10px',
                        borderRadius: 999,
                        background: stat.enrollmentRate >= 80
                          ? 'rgba(16,185,129,0.15)'
                          : stat.enrollmentRate >= 50
                          ? 'rgba(245,158,11,0.15)'
                          : 'rgba(239,68,68,0.15)',
                        color: stat.enrollmentRate >= 80
                          ? '#34d399'
                          : stat.enrollmentRate >= 50
                          ? '#f59e0b'
                          : '#ef4444',
                        border: '1px solid rgba(0,0,0,0.06)',
                        fontWeight: 700,
                        letterSpacing: 0.4
                      }}
                    >
                      {stat.enrollmentRate >= 80 ? 'High' : 
                       stat.enrollmentRate >= 50 ? 'Medium' : 'Low'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

