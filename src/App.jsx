import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import StudentDashboard from './pages/StudentDashboard';
import ReportIssue from './pages/ReportIssue';
import MaintenanceDashboard from './pages/MaintenanceDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="report" element={<ReportIssue />} />
          <Route path="maintenance" element={<MaintenanceDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
