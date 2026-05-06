import { db } from './firebase';
import { collection, addDoc, getDocs, doc, updateDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';

const ISSUES_COLLECTION = 'issues';

export const getIssues = async () => {
  try {
    const issuesRef = collection(db, ISSUES_COLLECTION);
    const q = query(issuesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
    }));
  } catch (error) {
    console.error("Error fetching issues:", error);
    return [];
  }
};

export const addIssue = async (issueData) => {
  try {
    // Plan B: Save the base64 image data directly into Firestore
    // This bypasses the need for Firebase Storage entirely
    const newIssue = {
      title: issueData.title,
      description: issueData.description,
      type: issueData.type,
      location: issueData.location,
      status: 'Pending',
      photo: issueData.photo || null, // Base64 string directly in database
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, ISSUES_COLLECTION), newIssue);
    return { ...newIssue, id: docRef.id, createdAt: new Date().toISOString() };
  } catch (error) {
    console.error("Error adding issue:", error);
    throw error;
  }
};

export const updateIssueStatus = async (id, newStatus) => {
  try {
    const issueRef = doc(db, ISSUES_COLLECTION, id);
    await updateDoc(issueRef, {
      status: newStatus
    });
    return true;
  } catch (error) {
    console.error("Error updating issue status:", error);
    return false;
  }
};
