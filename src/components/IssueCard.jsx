import React from 'react';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';
import './IssueCard.css';

const IssueCard = ({ issue }) => {
  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pending': return <Clock className="status-icon text-warning" />;
      case 'In Progress': return <AlertCircle className="status-icon text-primary" />;
      case 'Resolved': return <CheckCircle className="status-icon text-success" />;
      default: return null;
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Pending': return 'status-badge warning';
      case 'In Progress': return 'status-badge primary';
      case 'Resolved': return 'status-badge success';
      default: return '';
    }
  };

  return (
    <div className="issue-card glass-panel">
      <div className="issue-header">
        <h3 className="issue-title">{issue.title}</h3>
        <span className={`status-badge ${getStatusClass(issue.status)}`}>
          {getStatusIcon(issue.status)}
          {issue.status}
        </span>
      </div>
      <div className="issue-meta">
        <span className="issue-type">{issue.type}</span>
        <span className="issue-location">{issue.location}</span>
      </div>
      <p className="issue-description">{issue.description}</p>
      {issue.photo && (
        <div className="issue-photo-container">
          <img src={issue.photo} alt="Issue" className="issue-photo" />
        </div>
      )}
      <div className="issue-footer">
        <span className="issue-date">Reported: {new Date(issue.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default IssueCard;
