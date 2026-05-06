import { db, storage } from './firebase';
import { collection, addDoc, getDocs, doc, updateDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

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
    let photoUrl = null;

    // Upload photo to Firebase Storage if it exists
    if (issueData.photo) {
      const storageRef = ref(storage, `issues/${Date.now()}_photo`);
      // issueData.photo is a base64 data URL from FileReader
      await uploadString(storageRef, issueData.photo, 'data_url');
      photoUrl = await getDownloadURL(storageRef);
    }

    const newIssue = {
      title: issueData.title,
      description: issueData.description,
      type: issueData.type,
      location: issueData.location,
      status: 'Pending',
      photo: photoUrl,
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
