import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Check } from 'lucide-react';
import { addIssue } from '../services/storageService';
import './ReportIssue.css';

const ReportIssue = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    type: 'Plumbing',
    location: '',
    description: '',
    photo: null
  });
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to JPEG to ensure it stays well under the Firestore 1MB document limit
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
          setPreview(compressedDataUrl);
          setFormData({ ...formData, photo: compressedDataUrl });
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addIssue(formData);
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error("Submission failed", error);
      alert("Failed to submit report. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="success-state glass-panel">
        <Check size={48} className="text-success" />
        <h2>Report Submitted Successfully!</h2>
        <p className="text-secondary">Maintenance team has been notified.</p>
      </div>
    );
  }

  return (
    <div className="report-container">
      <div className="report-header">
        <h2>Report an Issue</h2>
        <p className="text-secondary">Please provide details about the maintenance issue.</p>
      </div>

      <form className="report-form glass-panel" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Issue Title</label>
          <input 
            type="text" 
            name="title" 
            className="form-control" 
            placeholder="e.g. Broken Window" 
            required 
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group flex-1">
            <label className="form-label">Issue Type</label>
            <select 
              name="type" 
              className="form-control" 
              value={formData.type}
              onChange={handleChange}
            >
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Carpentry">Carpentry</option>
              <option value="HVAC">Heating/Cooling</option>
              <option value="Appliance">Appliance</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group flex-1">
            <label className="form-label">Location / Room Number</label>
            <input 
              type="text" 
              name="location" 
              className="form-control" 
              placeholder="e.g. North Hall, Room 102" 
              required 
              value={formData.location}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea 
            name="description" 
            className="form-control" 
            rows="4" 
            placeholder="Describe the problem in detail..." 
            required
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-group">
          <label className="form-label">Photo (Optional)</label>
          <div className="photo-upload-area">
            {preview ? (
              <div className="photo-preview">
                <img src={preview} alt="Preview" />
                <button type="button" className="remove-photo" onClick={() => { setPreview(null); setFormData({...formData, photo: null}) }}>
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="upload-label">
                <Upload size={24} className="text-secondary" />
                <span>Click to upload photo</span>
                <input type="file" accept="image/*" onChange={handlePhotoChange} hidden />
              </label>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate('/')}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportIssue;
