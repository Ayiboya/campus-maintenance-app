import React, { useState, useEffect } from 'react';
import { getIssues, updateIssueStatus } from '../services/storageService';
import './MaintenanceDashboard.css';

const MaintenanceDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedIssueId, setExpandedIssueId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedIssueId(expandedIssueId === id ? null : id);
  };

  const fetchIssues = async () => {
    setIsLoading(true);
    const data = await getIssues();
    setIssues(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    // Optimistic update for snappy UI
    setIssues(issues.map(issue => issue.id === id ? { ...issue, status: newStatus } : issue));
    await updateIssueStatus(id, newStatus);
    fetchIssues();
  };

  const filteredIssues = filter === 'All' 
    ? issues 
    : issues.filter(issue => issue.status === filter);

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>Maintenance Administration</h2>
        <div className="filter-group">
          <label className="text-secondary">Filter by status:</label>
          <select 
            className="form-control" 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Issues</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="admin-table-container glass-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Location</th>
              <th>Issue Type & Title</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" className="empty-cell">Loading issues from database...</td>
              </tr>
            ) : filteredIssues.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-cell">No issues found.</td>
              </tr>
            ) : (
              filteredIssues.map(issue => (
                <React.Fragment key={issue.id}>
                  <tr 
                    onClick={() => toggleExpand(issue.id)}
                    className={`clickable-row ${expandedIssueId === issue.id ? 'active-row' : ''}`}
                  >
                    <td>#{issue.id.slice(-4)}</td>
                    <td>{new Date(issue.createdAt).toLocaleDateString()}</td>
                    <td>{issue.location}</td>
                    <td>
                      <div className="cell-title">{issue.title}</div>
                      <div className="cell-subtitle">{issue.type}</div>
                    </td>
                    <td>
                      <span className={`status-pill status-${issue.status.toLowerCase().replace(' ', '-')}`}>
                        {issue.status}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <select 
                        className="status-select"
                        value={issue.status}
                        onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                  </tr>
                  {expandedIssueId === issue.id && (
                    <tr className="detail-row">
                      <td colSpan="6">
                        <div className="admin-detail-content glass-panel">
                          <div className="detail-info">
                            <p className="detail-description">
                              <strong>Description:</strong> {issue.description || 'No description provided.'}
                            </p>
                            {issue.photo && (
                              <div className="detail-photo-container">
                                <img src={issue.photo} alt="Issue detail" className="detail-photo" />
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaintenanceDashboard;
