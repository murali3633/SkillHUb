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
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Course Enrollment Analytics',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Most Popular Courses',
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
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>Course Analytics</h2>
        <p>Track enrollment trends and course performance</p>
      </div>

      {/* Controls */}
      <div className="analytics-controls">
        <div className="filter-controls">
          <label htmlFor="timeFilter">Time Period:</label>
          <select
            id="timeFilter"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Time</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="semester">Last Semester</option>
          </select>
        </div>

        <div className="chart-controls">
          <label htmlFor="chartType">Chart Type:</label>
          <select
            id="chartType"
            value={selectedChart}
            onChange={(e) => setSelectedChart(e.target.value)}
            className="filter-select"
          >
            <option value="enrollments">Enrollments per Course</option>
            <option value="popular">Most Popular Courses</option>
          </select>
        </div>

        <button onClick={exportToCSV} className="export-btn">
          📊 Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Enrollments</h3>
          <p className="summary-number">{totalEnrollments}</p>
          <p className="summary-label">across all courses</p>
        </div>
        <div className="summary-card">
          <h3>Active Courses</h3>
          <p className="summary-number">{courses.length}</p>
          <p className="summary-label">courses available</p>
        </div>
        <div className="summary-card">
          <h3>Avg. Enrollment Rate</h3>
          <p className="summary-number">{averageEnrollmentRate.toFixed(1)}%</p>
          <p className="summary-label">capacity utilization</p>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-container">
        <div className="chart-wrapper">
          {selectedChart === 'enrollments' ? (
            <Bar data={enrollmentChartData} options={chartOptions} />
          ) : (
            <Doughnut data={popularCoursesData} options={doughnutOptions} />
          )}
        </div>
      </div>

      {/* Detailed Table */}
      <div className="analytics-table-section">
        <h3>Detailed Course Statistics</h3>
        <div className="table-container">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Title</th>
                <th>Category</th>
                <th>Enrollments</th>
                <th>Capacity</th>
                <th>Enrollment Rate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {enrollmentStats.map(stat => (
                <tr key={stat.id}>
                  <td className="course-code">{stat.code}</td>
                  <td className="course-title">{stat.title}</td>
                  <td className="course-category">{stat.category}</td>
                  <td className="enrollments">{stat.totalEnrollments}</td>
                  <td className="capacity">{stat.capacity}</td>
                  <td className="enrollment-rate">
                    <div className="rate-bar">
                      <div 
                        className="rate-fill" 
                        style={{ width: `${Math.min(stat.enrollmentRate, 100)}%` }}
                      ></div>
                      <span className="rate-text">{stat.enrollmentRate.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="status">
                    <span className={`status-badge ${
                      stat.enrollmentRate >= 80 ? 'high' : 
                      stat.enrollmentRate >= 50 ? 'medium' : 'low'
                    }`}>
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

