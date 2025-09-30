import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSyllabus, setExpandedSyllabus] = useState({}); // Track which syllabus are expanded

  // Toggle syllabus visibility
  const toggleSyllabus = (courseId) => {
    setExpandedSyllabus(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

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
      endDate: '2024-03-28',
      syllabus: [
        { module: 'Module 1', topic: 'Introduction to Web Development', tutorials: ['HTML Basics', 'Setting up Development Environment'] },
        { module: 'Module 2', topic: 'HTML Fundamentals', tutorials: ['HTML Structure', 'Forms and Inputs'] },
        { module: 'Module 3', topic: 'CSS Styling', tutorials: ['CSS Selectors', 'Layout Techniques'] },
        { module: 'Module 4', topic: 'Responsive Design', tutorials: ['Media Queries', 'Flexbox and Grid'] },
        { module: 'Module 5', topic: 'JavaScript Basics', tutorials: ['Variables and Functions', 'DOM Manipulation'] },
        { module: 'Module 6', topic: 'JavaScript Events', tutorials: ['Event Handling', 'Form Validation'] },
        { module: 'Module 7', topic: 'Advanced JavaScript', tutorials: ['ES6 Features', 'Async Programming'] },
        { module: 'Module 8', topic: 'Final Project', tutorials: ['Project Planning', 'Deployment'] }
      ]
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
      endDate: '2024-05-10',
      syllabus: [
        { module: 'Module 1', topic: 'Introduction to DSA', tutorials: ['Complexity Analysis', 'Big O Notation'] },
        { module: 'Module 2', topic: 'Arrays and Strings', tutorials: ['Array Operations', 'String Manipulation'] },
        { module: 'Module 3', topic: 'Linked Lists', tutorials: ['Singly Linked Lists', 'Doubly Linked Lists'] },
        { module: 'Module 4', topic: 'Stacks and Queues', tutorials: ['Stack Implementation', 'Queue Applications'] },
        { module: 'Module 5', topic: 'Trees', tutorials: ['Binary Trees', 'Tree Traversal'] },
        { module: 'Module 6', topic: 'Binary Search Trees', tutorials: ['BST Operations', 'Balanced Trees'] },
        { module: 'Module 7', topic: 'Heaps', tutorials: ['Heap Properties', 'Heap Operations'] },
        { module: 'Module 8', topic: 'Graphs', tutorials: ['Graph Representation', 'Graph Traversal'] },
        { module: 'Module 9', topic: 'Hashing', tutorials: ['Hash Tables', 'Collision Resolution'] },
        { module: 'Module 10', topic: 'Sorting Algorithms', tutorials: ['Quick Sort', 'Merge Sort'] },
        { module: 'Module 11', topic: 'Searching Algorithms', tutorials: ['Binary Search', 'Pattern Searching'] },
        { module: 'Module 12', topic: 'Dynamic Programming', tutorials: ['Memoization', 'Optimization Problems'] }
      ]
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
      endDate: '2024-04-12',
      syllabus: [
        { module: 'Module 1', topic: 'Introduction to Digital Marketing', tutorials: ['Marketing Fundamentals', 'Digital vs Traditional'] },
        { module: 'Module 2', topic: 'SEO and Content Marketing', tutorials: ['Keyword Research', 'Content Strategy'] },
        { module: 'Module 3', topic: 'Social Media Marketing', tutorials: ['Platform Strategies', 'Content Creation'] },
        { module: 'Module 4', topic: 'Email Marketing', tutorials: ['Campaign Design', 'Automation'] },
        { module: 'Module 5', topic: 'PPC and Paid Advertising', tutorials: ['Google Ads', 'Facebook Ads'] },
        { module: 'Module 6', topic: 'Analytics and Reporting', tutorials: ['Google Analytics', 'ROI Measurement'] }
      ]
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
      endDate: '2024-05-01',
      syllabus: [
        { module: 'Module 1', topic: 'Introduction to ML', tutorials: ['Types of Learning', 'Python Setup'] },
        { module: 'Module 2', topic: 'Data Preprocessing', tutorials: ['Data Cleaning', 'Feature Engineering'] },
        { module: 'Module 3', topic: 'Supervised Learning', tutorials: ['Linear Regression', 'Logistic Regression'] },
        { module: 'Module 4', topic: 'Classification Algorithms', tutorials: ['Decision Trees', 'Random Forest'] },
        { module: 'Module 5', topic: 'Clustering', tutorials: ['K-Means Clustering', 'Hierarchical Clustering'] },
        { module: 'Module 6', topic: 'Neural Networks', tutorials: ['Perceptron', 'Activation Functions'] },
        { module: 'Module 7', topic: 'Deep Learning Basics', tutorials: ['TensorFlow Introduction', 'Keras Basics'] },
        { module: 'Module 8', topic: 'Model Evaluation', tutorials: ['Cross Validation', 'Performance Metrics'] },
        { module: 'Module 9', topic: 'Natural Language Processing', tutorials: ['Text Preprocessing', 'Sentiment Analysis'] },
        { module: 'Module 10', topic: 'Project Implementation', tutorials: ['Model Deployment', 'Final Project'] }
      ]
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
      endDate: '2024-05-02',
      syllabus: [
        { module: 'Module 1', topic: 'Introduction to Project Management', tutorials: ['Project Lifecycle', 'Key Concepts'] },
        { module: 'Module 2', topic: 'Project Initiation', tutorials: ['Stakeholder Analysis', 'Project Charter'] },
        { module: 'Module 3', topic: 'Project Planning', tutorials: ['Work Breakdown Structure', 'Scheduling'] },
        { module: 'Module 4', topic: 'Resource Management', tutorials: ['Team Management', 'Budget Planning'] },
        { module: 'Module 5', topic: 'Risk Management', tutorials: ['Risk Identification', 'Mitigation Strategies'] },
        { module: 'Module 6', topic: 'Project Execution', tutorials: ['Team Leadership', 'Quality Control'] },
        { module: 'Module 7', topic: 'Monitoring and Control', tutorials: ['Performance Tracking', 'Change Management'] },
        { module: 'Module 8', topic: 'Project Closure', tutorials: ['Lessons Learned', 'Project Handover'] }
      ]
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
      endDate: '2024-05-03',
      syllabus: [
        { module: 'Module 1', topic: 'Introduction to UX/UI', tutorials: ['Design Thinking', 'User Research'] },
        { module: 'Module 2', topic: 'User Research Methods', tutorials: ['Interviews', 'Surveys'] },
        { module: 'Module 3', topic: 'Information Architecture', tutorials: ['User Flows', 'Wireframing'] },
        { module: 'Module 4', topic: 'Prototyping', tutorials: ['Low-Fidelity Prototypes', 'High-Fidelity Prototypes'] },
        { module: 'Module 5', topic: 'Visual Design Principles', tutorials: ['Color Theory', 'Typography'] },
        { module: 'Module 6', topic: 'Interaction Design', tutorials: ['Microinteractions', 'Animations'] },
        { module: 'Module 7', topic: 'Usability Testing', tutorials: ['A/B Testing', 'User Testing'] }
      ]
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
      endDate: '2024-06-01',
      syllabus: [
        { module: 'Module 1', topic: 'Advanced Python Concepts', tutorials: ['Decorators', 'Generators'] },
        { module: 'Module 2', topic: 'Object-Oriented Programming', tutorials: ['Inheritance', 'Polymorphism'] },
        { module: 'Module 3', topic: 'Functional Programming', tutorials: ['Lambda Functions', 'Map/Filter/Reduce'] },
        { module: 'Module 4', topic: 'Error Handling', tutorials: ['Exception Handling', 'Custom Exceptions'] },
        { module: 'Module 5', topic: 'File Handling', tutorials: ['Reading/Writing Files', 'CSV/JSON Processing'] },
        { module: 'Module 6', topic: 'Database Integration', tutorials: ['SQLite', 'SQLAlchemy'] },
        { module: 'Module 7', topic: 'Web Development with Flask', tutorials: ['Routing', 'Templates'] },
        { module: 'Module 8', topic: 'Testing', tutorials: ['Unit Testing', 'PyTest'] },
        { module: 'Module 9', topic: 'Deployment', tutorials: ['Virtual Environments', 'Package Distribution'] }
      ]
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
      endDate: '2024-06-05',
      syllabus: [
        { module: 'Module 1', topic: 'Introduction to Business Analytics', tutorials: ['Data Types', 'Analytics Process'] },
        { module: 'Module 2', topic: 'Data Collection and Cleaning', tutorials: ['Data Sources', 'Data Cleaning Techniques'] },
        { module: 'Module 3', topic: 'Descriptive Analytics', tutorials: ['Data Visualization', 'Summary Statistics'] },
        { module: 'Module 4', topic: 'Statistical Analysis', tutorials: ['Hypothesis Testing', 'Regression Analysis'] },
        { module: 'Module 5', topic: 'Predictive Analytics', tutorials: ['Forecasting', 'Machine Learning Basics'] },
        { module: 'Module 6', topic: 'Prescriptive Analytics', tutorials: ['Optimization', 'Simulation'] },
        { module: 'Module 7', topic: 'Dashboard Creation', tutorials: ['Tableau Basics', 'Power BI'] },
        { module: 'Module 8', topic: 'Business Intelligence', tutorials: ['KPIs', 'Reporting'] }
      ]
    },
    {
      id: 9,
      title: 'Cloud Computing Fundamentals',
      code: 'CC901',
      category: 'Technology',
      description: 'Introduction to cloud platforms including AWS, Azure, and GCP.',
      instructor: 'Dr. Kumar',
      duration: '10 weeks',
      level: 'Intermediate',
      maxStudents: 28,
      enrolled: 12,
      startDate: '2024-04-15',
      endDate: '2024-06-24',
      syllabus: [
        { module: 'Module 1', topic: 'Introduction to Cloud Computing', tutorials: ['Cloud Models', 'Service Models'] },
        { module: 'Module 2', topic: 'AWS Fundamentals', tutorials: ['EC2', 'S3'] },
        { module: 'Module 3', topic: 'Azure Basics', tutorials: ['Virtual Machines', 'Storage'] },
        { module: 'Module 4', topic: 'Google Cloud Platform', tutorials: ['Compute Engine', 'Cloud Storage'] },
        { module: 'Module 5', topic: 'Networking', tutorials: ['VPC', 'Load Balancing'] },
        { module: 'Module 6', topic: 'Security', tutorials: ['IAM', 'Encryption'] },
        { module: 'Module 7', topic: 'Database Services', tutorials: ['RDS', 'DynamoDB'] },
        { module: 'Module 8', topic: 'Serverless Computing', tutorials: ['Lambda', 'Functions'] },
        { module: 'Module 9', topic: 'Monitoring and Management', tutorials: ['CloudWatch', 'Logging'] },
        { module: 'Module 10', topic: 'Cost Management', tutorials: ['Pricing Models', 'Optimization'] }
      ]
    },
    {
      id: 10,
      title: 'Cybersecurity Essentials',
      code: 'CS1001',
      category: 'Security',
      description: 'Learn fundamental cybersecurity concepts and threat protection.',
      instructor: 'Prof. Anderson',
      duration: '8 weeks',
      level: 'Beginner',
      maxStudents: 32,
      enrolled: 29,
      startDate: '2024-05-01',
      endDate: '2024-06-26',
      syllabus: [
        { module: 'Module 1', topic: 'Introduction to Cybersecurity', tutorials: ['Threat Landscape', 'Security Principles'] },
        { module: 'Module 2', topic: 'Network Security', tutorials: ['Firewalls', 'Intrusion Detection'] },
        { module: 'Module 3', topic: 'Cryptography', tutorials: ['Encryption Basics', 'Digital Signatures'] },
        { module: 'Module 4', topic: 'Identity and Access Management', tutorials: ['Authentication', 'Authorization'] },
        { module: 'Module 5', topic: 'Malware and Threats', tutorials: ['Virus Protection', 'Social Engineering'] },
        { module: 'Module 6', topic: 'Web Application Security', tutorials: ['OWASP Top 10', 'Secure Coding'] },
        { module: 'Module 7', topic: 'Incident Response', tutorials: ['Forensics', 'Recovery'] },
        { module: 'Module 8', topic: 'Compliance and Governance', tutorials: ['Regulations', 'Risk Management'] }
      ]
    },
    {
      id: 11,
      title: 'React & Node.js Development',
      code: 'RN1101',
      category: 'Programming',
      description: 'Full-stack web development with React frontend and Node.js backend.',
      instructor: 'Ms. Chen',
      duration: '14 weeks',
      level: 'Advanced',
      maxStudents: 22,
      enrolled: 8,
      startDate: '2024-05-15',
      endDate: '2024-08-23',
      syllabus: [
        { module: 'Module 1', topic: 'React Fundamentals', tutorials: ['Components', 'Props and State'] },
        { module: 'Module 2', topic: 'React Hooks', tutorials: ['useState', 'useEffect'] },
        { module: 'Module 3', topic: 'React Router', tutorials: ['Navigation', 'Protected Routes'] },
        { module: 'Module 4', topic: 'State Management', tutorials: ['Context API', 'Redux'] },
        { module: 'Module 5', topic: 'Node.js Basics', tutorials: ['Modules', 'NPM'] },
        { module: 'Module 6', topic: 'Express.js', tutorials: ['Routing', 'Middleware'] },
        { module: 'Module 7', topic: 'Database Integration', tutorials: ['MongoDB', 'Mongoose'] },
        { module: 'Module 8', topic: 'RESTful APIs', tutorials: ['CRUD Operations', 'Authentication'] },
        { module: 'Module 9', topic: 'Frontend-Backend Integration', tutorials: ['API Calls', 'Error Handling'] },
        { module: 'Module 10', topic: 'Testing', tutorials: ['Jest', 'React Testing Library'] },
        { module: 'Module 11', topic: 'Deployment', tutorials: ['Heroku', 'Docker'] },
        { module: 'Module 12', topic: 'Performance Optimization', tutorials: ['Code Splitting', 'Caching'] },
        { module: 'Module 13', topic: 'Security Best Practices', tutorials: ['Input Validation', 'JWT'] },
        { module: 'Module 14', topic: 'Final Project', tutorials: ['Project Planning', 'Presentation'] }
      ]
    },
    {
      id: 12,
      title: 'Data Visualization with Python',
      code: 'DV1201',
      category: 'Data Science',
      description: 'Create compelling data visualizations using Python libraries.',
      instructor: 'Dr. Martinez',
      duration: '6 weeks',
      level: 'Intermediate',
      maxStudents: 26,
      enrolled: 19,
      startDate: '2024-05-20',
      endDate: '2024-07-01',
      syllabus: [
        { module: 'Module 1', topic: 'Introduction to Data Visualization', tutorials: ['Visualization Principles', 'Python Setup'] },
        { module: 'Module 2', topic: 'Matplotlib Basics', tutorials: ['Plotting Basics', 'Customization'] },
        { module: 'Module 3', topic: 'Advanced Matplotlib', tutorials: ['Subplots', 'Animations'] },
        { module: 'Module 4', topic: 'Seaborn Library', tutorials: ['Statistical Plots', 'Aesthetics'] },
        { module: 'Module 5', topic: 'Interactive Visualizations', tutorials: ['Plotly', 'Bokeh'] },
        { module: 'Module 6', topic: 'Dashboard Creation', tutorials: ['Dash Framework', 'Final Project'] }
      ]
    },
    {
      id: 13,
      title: 'Mobile App Development',
      code: 'MA1301',
      category: 'Programming',
      description: 'Build native mobile applications for iOS and Android platforms.',
      instructor: 'Prof. Williams',
      duration: '12 weeks',
      level: 'Advanced',
      maxStudents: 20,
      enrolled: 14,
      startDate: '2024-06-01',
      endDate: '2024-08-24',
      syllabus: [
        { module: 'Module 1', topic: 'Introduction to Mobile Development', tutorials: ['Platforms Overview', 'Development Tools'] },
        { module: 'Module 2', topic: 'Android Development Basics', tutorials: ['Android Studio', 'UI Components'] },
        { module: 'Module 3', topic: 'iOS Development Basics', tutorials: ['Xcode', 'Swift Fundamentals'] },
        { module: 'Module 4', topic: 'UI/UX for Mobile', tutorials: ['Responsive Design', 'Navigation Patterns'] },
        { module: 'Module 5', topic: 'Data Management', tutorials: ['Local Storage', 'API Integration'] },
        { module: 'Module 6', topic: 'Navigation', tutorials: ['Screen Navigation', 'Deep Linking'] },
        { module: 'Module 7', topic: 'Networking', tutorials: ['HTTP Requests', 'Offline Support'] },
        { module: 'Module 8', topic: 'Authentication', tutorials: ['User Login', 'Biometric Auth'] },
        { module: 'Module 9', topic: 'Push Notifications', tutorials: ['Firebase', 'APNs'] },
        { module: 'Module 10', topic: 'Testing', tutorials: ['Unit Testing', 'Device Testing'] },
        { module: 'Module 11', topic: 'Publishing', tutorials: ['App Store', 'Google Play'] },
        { module: 'Module 12', topic: 'Advanced Topics', tutorials: ['Performance', 'Security'] }
      ]
    },
    {
      id: 14,
      title: 'Financial Analysis & Modeling',
      code: 'FA1401',
      category: 'Finance',
      description: 'Master financial modeling techniques and investment analysis.',
      instructor: 'Dr. Thompson',
      duration: '9 weeks',
      level: 'Intermediate',
      maxStudents: 24,
      enrolled: 21,
      startDate: '2024-06-10',
      endDate: '2024-08-12',
      syllabus: [
        { module: 'Module 1', topic: 'Financial Statement Analysis', tutorials: ['Balance Sheet', 'Income Statement'] },
        { module: 'Module 2', topic: 'Ratio Analysis', tutorials: ['Profitability Ratios', 'Liquidity Ratios'] },
        { module: 'Module 3', topic: 'Cash Flow Analysis', tutorials: ['Operating Activities', 'Investing Activities'] },
        { module: 'Module 4', topic: 'Valuation Methods', tutorials: ['Discounted Cash Flow', 'Comparables'] },
        { module: 'Module 5', topic: 'Financial Modeling Basics', tutorials: ['Excel Modeling', 'Assumptions'] },
        { module: 'Module 6', topic: 'Three-Statement Modeling', tutorials: ['Income Statement', 'Balance Sheet'] },
        { module: 'Module 7', topic: 'Scenario Analysis', tutorials: ['Sensitivity Analysis', 'Monte Carlo'] },
        { module: 'Module 8', topic: 'M&A Modeling', tutorials: ['Accretion/Dilution', 'LBO Models'] },
        { module: 'Module 9', topic: 'Investment Recommendations', tutorials: ['Portfolio Theory', 'Risk Management'] }
      ]
    },
    {
      id: 15,
      title: 'DevOps & CI/CD Pipeline',
      code: 'DO1501',
      category: 'Technology',
      description: 'Learn DevOps practices, automation, and continuous deployment.',
      instructor: 'Mr. Jackson',
      duration: '8 weeks',
      level: 'Advanced',
      maxStudents: 18,
      enrolled: 11,
      startDate: '2024-06-15',
      endDate: '2024-08-10',
      syllabus: [
        { module: 'Module 1', topic: 'Introduction to DevOps', tutorials: ['DevOps Culture', 'CI/CD Concepts'] },
        { module: 'Module 2', topic: 'Version Control', tutorials: ['Git Advanced', 'Branching Strategies'] },
        { module: 'Module 3', topic: 'Containerization', tutorials: ['Docker Basics', 'Docker Compose'] },
        { module: 'Module 4', topic: 'Container Orchestration', tutorials: ['Kubernetes', 'Helm'] },
        { module: 'Module 5', topic: 'Infrastructure as Code', tutorials: ['Terraform', 'CloudFormation'] },
        { module: 'Module 6', topic: 'CI/CD Tools', tutorials: ['Jenkins', 'GitHub Actions'] },
        { module: 'Module 7', topic: 'Monitoring and Logging', tutorials: ['Prometheus', 'ELK Stack'] },
        { module: 'Module 8', topic: 'Security and Compliance', tutorials: ['DevSecOps', 'Compliance Automation'] }
      ]
    },
    {
      id: 16,
      title: 'Artificial Intelligence Fundamentals',
      code: 'AI1601',
      category: 'Data Science',
      description: 'Introduction to AI concepts, neural networks, and deep learning.',
      instructor: 'Dr. Patel',
      duration: '11 weeks',
      level: 'Advanced',
      maxStudents: 16,
      enrolled: 9,
      startDate: '2024-07-01',
      endDate: '2024-09-16',
      syllabus: [
        { module: 'Module 1', topic: 'Introduction to AI', tutorials: ['AI History', 'Problem Solving'] },
        { module: 'Module 2', topic: 'Search Algorithms', tutorials: ['Uninformed Search', 'Informed Search'] },
        { module: 'Module 3', topic: 'Knowledge Representation', tutorials: ['Logic', 'Semantic Networks'] },
        { module: 'Module 4', topic: 'Machine Learning Review', tutorials: ['Supervised Learning', 'Unsupervised Learning'] },
        { module: 'Module 5', topic: 'Neural Networks', tutorials: ['Perceptron', 'Backpropagation'] },
        { module: 'Module 6', topic: 'Deep Learning', tutorials: ['CNN', 'RNN'] },
        { module: 'Module 7', topic: 'Natural Language Processing', tutorials: ['Text Processing', 'Word Embeddings'] },
        { module: 'Module 8', topic: 'Computer Vision', tutorials: ['Image Classification', 'Object Detection'] },
        { module: 'Module 9', topic: 'Reinforcement Learning', tutorials: ['Q-Learning', 'Policy Gradient'] },
        { module: 'Module 10', topic: 'AI Ethics', tutorials: ['Bias in AI', 'Privacy'] },
        { module: 'Module 11', topic: 'AI Applications', tutorials: ['Chatbots', 'Autonomous Systems'] }
      ]
    },
    {
      id: 17,
      title: 'Content Marketing Mastery',
      code: 'CM1701',
      category: 'Marketing',
      description: 'Create engaging content strategies for digital marketing success.',
      instructor: 'Ms. Rodriguez',
      duration: '7 weeks',
      level: 'Beginner',
      maxStudents: 35,
      enrolled: 31,
      startDate: '2024-07-08',
      endDate: '2024-08-26',
      syllabus: [
        { module: 'Module 1', topic: 'Content Marketing Strategy', tutorials: ['Audience Research', 'Content Goals'] },
        { module: 'Module 2', topic: 'Content Planning', tutorials: ['Editorial Calendar', 'Content Types'] },
        { module: 'Module 3', topic: 'Writing for the Web', tutorials: ['SEO Writing', 'Headlines'] },
        { module: 'Module 4', topic: 'Visual Content Creation', tutorials: ['Infographics', 'Videos'] },
        { module: 'Module 5', topic: 'Social Media Content', tutorials: ['Platform Strategies', 'Engagement'] },
        { module: 'Module 6', topic: 'Email Content', tutorials: ['Newsletters', 'Automation'] },
        { module: 'Module 7', topic: 'Content Distribution', tutorials: ['Amplification', 'Analytics'] }
      ]
    },
    {
      id: 18,
      title: 'Blockchain Technology',
      code: 'BT1801',
      category: 'Technology',
      description: 'Understand blockchain fundamentals and cryptocurrency development.',
      instructor: 'Prof. Kim',
      duration: '10 weeks',
      level: 'Advanced',
      maxStudents: 15,
      enrolled: 7,
      startDate: '2024-07-15',
      endDate: '2024-09-23',
      syllabus: [
        { module: 'Module 1', topic: 'Introduction to Blockchain', tutorials: ['Blockchain Concepts', 'Distributed Ledgers'] },
        { module: 'Module 2', topic: 'Cryptography Basics', tutorials: ['Hash Functions', 'Digital Signatures'] },
        { module: 'Module 3', topic: 'Bitcoin and Cryptocurrencies', tutorials: ['Mining', 'Wallets'] },
        { module: 'Module 4', topic: 'Ethereum and Smart Contracts', tutorials: ['Solidity', 'DApps'] },
        { module: 'Module 5', topic: 'Consensus Mechanisms', tutorials: ['Proof of Work', 'Proof of Stake'] },
        { module: 'Module 6', topic: 'Blockchain Networks', tutorials: ['Public vs Private', 'Permissioned Chains'] },
        { module: 'Module 7', topic: 'Tokenization', tutorials: ['ERC Standards', 'NFTs'] },
        { module: 'Module 8', topic: 'Blockchain Applications', tutorials: ['Supply Chain', 'Healthcare'] },
        { module: 'Module 9', topic: 'Regulation and Compliance', tutorials: ['Legal Framework', 'GDPR'] },
        { module: 'Module 10', topic: 'Future of Blockchain', tutorials: ['Scalability', 'Interoperability'] }
      ]
    },
    {
      id: 19,
      title: 'Game Development with Unity',
      code: 'GD1901',
      category: 'Programming',
      description: 'Learn to create 2D and 3D games using the Unity game engine.',
      instructor: 'Mr. Thompson',
      duration: '12 weeks',
      level: 'Intermediate',
      maxStudents: 25,
      enrolled: 18,
      startDate: '2024-08-01',
      endDate: '2024-10-28',
      syllabus: [
        { module: 'Module 1', topic: 'Introduction to Unity', tutorials: ['Unity Interface', 'Basic Concepts'] },
        { module: 'Module 2', topic: 'C# for Game Development', tutorials: ['Variables and Functions', 'Object-Oriented Programming'] },
        { module: 'Module 3', topic: '2D Game Development', tutorials: ['Sprites and Animation', 'Physics 2D'] },
        { module: 'Module 4', topic: 'UI Systems', tutorials: ['Canvas and Elements', 'Event System'] },
        { module: 'Module 5', topic: '3D Game Development', tutorials: ['3D Models and Textures', 'Lighting'] },
        { module: 'Module 6', topic: 'Animation Systems', tutorials: ['Animator Controller', 'Blend Trees'] },
        { module: 'Module 7', topic: 'Audio in Games', tutorials: ['Sound Effects', 'Background Music'] },
        { module: 'Module 8', topic: 'Input Systems', tutorials: ['Keyboard and Mouse', 'Gamepad Support'] },
        { module: 'Module 9', topic: 'Game AI', tutorials: ['NavMesh Navigation', 'Behavior Trees'] },
        { module: 'Module 10', topic: 'Particle Systems', tutorials: ['Visual Effects', 'Shaders'] },
        { module: 'Module 11', topic: 'Optimization', tutorials: ['Performance Profiling', 'Mobile Optimization'] },
        { module: 'Module 12', topic: 'Publishing', tutorials: ['Build Settings', 'Store Submission'] }
      ]
    },
    {
      id: 20,
      title: 'Internet of Things (IoT)',
      code: 'IOT2001',
      category: 'Technology',
      description: 'Build connected devices and smart systems with IoT technologies.',
      instructor: 'Dr. Roberts',
      duration: '10 weeks',
      level: 'Intermediate',
      maxStudents: 20,
      enrolled: 12,
      startDate: '2024-08-10',
      endDate: '2024-10-22',
      syllabus: [
        { module: 'Module 1', topic: 'IoT Fundamentals', tutorials: ['IoT Architecture', 'Sensors and Actuators'] },
        { module: 'Module 2', topic: 'Embedded Systems', tutorials: ['Microcontrollers', 'Arduino Programming'] },
        { module: 'Module 3', topic: 'Networking Protocols', tutorials: ['MQTT', 'CoAP'] },
        { module: 'Module 4', topic: 'Data Collection', tutorials: ['Sensor Integration', 'Data Logging'] },
        { module: 'Module 5', topic: 'Cloud Integration', tutorials: ['AWS IoT Core', 'Google Cloud IoT'] },
        { module: 'Module 6', topic: 'Edge Computing', tutorials: ['Edge Devices', 'Local Processing'] },
        { module: 'Module 7', topic: 'Security in IoT', tutorials: ['Device Authentication', 'Data Encryption'] },
        { module: 'Module 8', topic: 'Mobile App Integration', tutorials: ['React Native', 'Flutter'] },
        { module: 'Module 9', topic: 'Analytics and Visualization', tutorials: ['Real-time Dashboards', 'Time Series Data'] },
        { module: 'Module 10', topic: 'Smart Home Applications', tutorials: ['Home Automation', 'Voice Control'] }
      ]
    },
    {
      id: 21,
      title: 'Ethical Hacking & Penetration Testing',
      code: 'EH2101',
      category: 'Security',
      description: 'Learn cybersecurity techniques to identify and fix vulnerabilities.',
      instructor: 'Mr. Anderson',
      duration: '14 weeks',
      level: 'Advanced',
      maxStudents: 15,
      enrolled: 8,
      startDate: '2024-09-01',
      endDate: '2024-12-10',
      syllabus: [
        { module: 'Module 1', topic: 'Ethical Hacking Basics', tutorials: ['Hacking Methodology', 'Reconnaissance'] },
        { module: 'Module 2', topic: 'Footprinting and Scanning', tutorials: ['Network Scanning', 'Port Scanning'] },
        { module: 'Module 3', topic: 'Enumeration', tutorials: ['Service Detection', 'Banner Grabbing'] },
        { module: 'Module 4', topic: 'System Hacking', tutorials: ['Password Cracking', 'Privilege Escalation'] },
        { module: 'Module 5', topic: 'Malware Threats', tutorials: ['Trojans and Backdoors', 'Virus Analysis'] },
        { module: 'Module 6', topic: 'Sniffing', tutorials: ['Packet Analysis', 'Wireshark'] },
        { module: 'Module 7', topic: 'Social Engineering', tutorials: ['Phishing', 'Pretexting'] },
        { module: 'Module 8', topic: 'Denial of Service', tutorials: ['DDoS Attacks', 'Botnets'] },
        { module: 'Module 9', topic: 'Session Hijacking', tutorials: ['Application-Level', 'Network-Level'] },
        { module: 'Module 10', topic: 'Web Application Hacking', tutorials: ['OWASP Top 10', 'SQL Injection'] },
        { module: 'Module 11', topic: 'Wireless Hacking', tutorials: ['WiFi Security', 'Bluetooth Attacks'] },
        { module: 'Module 12', topic: 'Mobile Platform Security', tutorials: ['Android Security', 'iOS Security'] },
        { module: 'Module 13', topic: 'Firewall and IDS', tutorials: ['Bypassing Firewalls', 'Evasion Techniques'] },
        { module: 'Module 14', topic: 'Penetration Testing', tutorials: ['Report Writing', 'Certification Preparation'] }
      ]
    },
    {
      id: 22,
      title: 'Data Science with R',
      code: 'DS2201',
      category: 'Data Science',
      description: 'Master data analysis and visualization using the R programming language.',
      instructor: 'Dr. Williams',
      duration: '12 weeks',
      level: 'Intermediate',
      maxStudents: 30,
      enrolled: 22,
      startDate: '2024-09-15',
      endDate: '2024-12-08',
      syllabus: [
        { module: 'Module 1', topic: 'R Programming Basics', tutorials: ['Data Types', 'Control Structures'] },
        { module: 'Module 2', topic: 'Data Import and Export', tutorials: ['CSV and Excel', 'Database Connections'] },
        { module: 'Module 3', topic: 'Data Cleaning', tutorials: ['Missing Values', 'Outliers'] },
        { module: 'Module 4', topic: 'Data Manipulation', tutorials: ['dplyr Package', 'tidyr Package'] },
        { module: 'Module 5', topic: 'Data Visualization', tutorials: ['ggplot2', 'Interactive Plots'] },
        { module: 'Module 6', topic: 'Statistical Analysis', tutorials: ['Hypothesis Testing', 'Regression Models'] },
        { module: 'Module 7', topic: 'Advanced Visualization', tutorials: ['Shiny Apps', 'Dashboard Creation'] },
        { module: 'Module 8', topic: 'Time Series Analysis', tutorials: ['Forecasting', 'ARIMA Models'] },
        { module: 'Module 9', topic: 'Machine Learning in R', tutorials: ['Classification', 'Clustering'] },
        { module: 'Module 10', topic: 'Text Mining', tutorials: ['Natural Language Processing', 'Sentiment Analysis'] },
        { module: 'Module 11', topic: 'Big Data with R', tutorials: ['SparkR', 'Hadoop Integration'] },
        { module: 'Module 12', topic: 'Reporting and Reproducibility', tutorials: ['R Markdown', 'Automated Reports'] }
      ]
    },
    {
      id: 23,
      title: 'Digital Photography & Editing',
      code: 'DP2301',
      category: 'Design',
      description: 'Learn photography techniques and professional photo editing skills.',
      instructor: 'Ms. Clark',
      duration: '8 weeks',
      level: 'Beginner',
      maxStudents: 25,
      enrolled: 19,
      startDate: '2024-10-01',
      endDate: '2024-11-26',
      syllabus: [
        { module: 'Module 1', topic: 'Photography Fundamentals', tutorials: ['Camera Settings', 'Composition Rules'] },
        { module: 'Module 2', topic: 'Lighting Techniques', tutorials: ['Natural Light', 'Artificial Light'] },
        { module: 'Module 3', topic: 'Portrait Photography', tutorials: ['Posing Techniques', 'Background Selection'] },
        { module: 'Module 4', topic: 'Landscape Photography', tutorials: ['Golden Hour', 'Weather Conditions'] },
        { module: 'Module 5', topic: 'Introduction to Lightroom', tutorials: ['Import and Organization', 'Basic Adjustments'] },
        { module: 'Module 6', topic: 'Advanced Lightroom', tutorials: ['Presets', 'Local Adjustments'] },
        { module: 'Module 7', topic: 'Photoshop Basics', tutorials: ['Layers', 'Selection Tools'] },
        { module: 'Module 8', topic: 'Portfolio Creation', tutorials: ['Photo Selection', 'Online Presentation'] }
      ]
    },
    {
      id: 24,
      title: 'Agile Project Management',
      code: 'AP2401',
      category: 'Management',
      description: 'Master Agile methodologies and Scrum framework for project delivery.',
      instructor: 'Mr. Brown',
      duration: '6 weeks',
      level: 'Beginner',
      maxStudents: 35,
      enrolled: 28,
      startDate: '2024-10-15',
      endDate: '2024-11-26',
      syllabus: [
        { module: 'Module 1', topic: 'Agile Principles', tutorials: ['Manifesto Values', 'Agile vs Waterfall'] },
        { module: 'Module 2', topic: 'Scrum Framework', tutorials: ['Roles and Responsibilities', 'Scrum Events'] },
        { module: 'Module 3', topic: 'Product Backlog', tutorials: ['User Stories', 'Story Points'] },
        { module: 'Module 4', topic: 'Sprint Planning', tutorials: ['Task Breakdown', 'Capacity Planning'] },
        { module: 'Module 5', topic: 'Sprint Execution', tutorials: ['Daily Standups', 'Burndown Charts'] },
        { module: 'Module 6', topic: 'Sprint Review and Retrospective', tutorials: ['Demo Presentation', 'Continuous Improvement'] }
      ]
    }
  ], []);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Always use mock courses for consistency
        setCourses(mockCourses);
        // Also save to localStorage for persistence
        localStorage.setItem('allCourses', JSON.stringify(mockCourses));
        console.log('Loaded courses:', mockCourses.length);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [mockCourses]);

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

    console.log('Filtering courses:', {
      totalCourses: courses.length,
      searchTerm,
      selectedCategory,
      filteredCount: filtered.length
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
    const savedEnrolled = localStorage.getItem(`enrolledCourses_${user?.id}`);
    if (savedEnrolled) {
      const enrolledCourses = JSON.parse(savedEnrolled);
      return enrolledCourses.some(course => course.id === courseId);
    }
    return false;
  };

  // Register for a course
  const registerForCourse = (course) => {
    const savedEnrolled = localStorage.getItem(`enrolledCourses_${user?.id}`);
    let enrolledCourses = [];
    if (savedEnrolled) {
      enrolledCourses = JSON.parse(savedEnrolled);
    }

    if (enrolledCourses.some(c => c.id === course.id)) {
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

    enrolledCourses.push(enrollmentData);
    localStorage.setItem(`enrolledCourses_${user.id}`, JSON.stringify(enrolledCourses));
    
    // Update course enrollment count
    setCourses(prev => prev.map(c => 
      c.id === course.id ? { ...c, enrolled: c.enrolled + 1 } : c
    ));

    // Also update in localStorage
    const allCourses = JSON.parse(localStorage.getItem('allCourses') || '[]');
    const updatedCourses = allCourses.map(c => 
      c.id === course.id ? { ...c, enrolled: c.enrolled + 1 } : c
    );
    localStorage.setItem('allCourses', JSON.stringify(updatedCourses));

    alert(`Successfully enrolled in ${course.title}!`);
  };

  if (isLoading) {
    return <LoadingSpinner size="large" message="Loading available courses..." overlay={true} />;
  }

  return (
    <div className="student-dashboard">
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
                  <div className="course-code-row">
                    <span className="course-code">{course.code}</span>
                  </div>
                </div>
              </div>
              
              <div className="course-meta">
                <span className="course-category">{course.category}</span>
                <span className={`course-level level-${course.level.toLowerCase()}`}>{course.level}</span>
                {isEnrolled(course.id) && (
                  <span className="status-badge enrolled">Enrolled</span>
                )}
                {course.enrolled >= course.maxStudents && !isEnrolled(course.id) && (
                  <span className="status-badge full">Full</span>
                )}
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

              {/* Syllabus Section */}
              <div className="syllabus-section">
                <button 
                  className="syllabus-toggle-btn"
                  onClick={() => navigate('/syllabus-detail', { state: { course } })}
                >
                  <span className="toggle-text">View Full Module Syllabus</span>
                  <span className="toggle-icon">↗</span>
                </button>
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
