const STORAGE_KEY = 'campus_maintenance_issues';

// Initialize with some mock data if empty
const initializeStorage = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    const mockData = [
      {
        id: '1',
        title: 'Leaking Faucet in Bathroom',
        description: 'The cold water faucet is leaking continuously, wasting water.',
        type: 'Plumbing',
        location: 'Room 204, North Hall',
        photo: null,
        status: 'Pending',
        createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      },
      {
        id: '2',
        title: 'Flickering Lights',
        description: 'Overhead light in the main corridor is flickering and buzzing.',
        type: 'Electrical',
        location: 'Corridor, South Hall 1st Floor',
        photo: null,
        status: 'In Progress',
        createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
  }
};

export const getIssues = () => {
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const addIssue = (issueData) => {
  const issues = getIssues();
  const newIssue = {
    ...issueData,
    id: Date.now().toString(),
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  issues.unshift(newIssue);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
  return newIssue;
};

export const updateIssueStatus = (id, newStatus) => {
  const issues = getIssues();
  const index = issues.findIndex(issue => issue.id === id);
  if (index !== -1) {
    issues[index].status = newStatus;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
    return issues[index];
  }
  return null;
};
