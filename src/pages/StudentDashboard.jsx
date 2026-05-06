import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { getIssues } from '../services/storageService';
import IssueCard from '../components/IssueCard';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const [issues, setIssues] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      setIsLoading(true);
      const data = await getIssues();
      setIssues(data);
      setIsLoading(false);
    };
    fetchIssues();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2>My Reported Issues</h2>
          <p className="text-secondary">Track the status of your maintenance requests.</p>
        </div>
        <Link to="/report" className="btn-primary flex-btn">
          <PlusCircle size={20} />
          <span>New Report</span>
        </Link>
      </div>
      
      <div className="issues-list">
        {isLoading ? (
          <div className="empty-state glass-panel">
            <p>Loading issues...</p>
          </div>
        ) : issues.length === 0 ? (
          <div className="empty-state glass-panel">
            <p>You haven't reported any issues yet.</p>
          </div>
        ) : (
          issues.map(issue => (
            <IssueCard key={issue.id} issue={issue} />
          ))
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
