import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Calendar, Clock, Users } from 'lucide-react';
import { Job } from '../../types';
import { apiUrl, endpoints } from '../../config/constants';

interface JobCardProps {
  job: Job;
  isAdmin?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, isAdmin = false }) => {
  const formattedDate = new Date(job.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleApplyClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const formData = new FormData();
    formData.append('cv', e.target.files[0]);

    try {
    const res = await fetch(`${apiUrl}${endpoints.applyJob(job._id)}`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    if (!res.ok) {
      const data = await res.json();
      alert(data.message || 'Failed to apply');
    } else {
      alert('Application submitted!');
    }
  } catch (err) {
    alert('Error submitting application');
  }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${job.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {job.isActive ? 'Active' : 'Closed'}
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-600 line-clamp-2">
          {job.description}
        </p>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {job.keywords?.map((keyword, index) => (
          <span key={index} className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs">
            {keyword}
          </span>
        ))}
      </div>
      
      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <Calendar size={16} />
          <span>Posted: {formattedDate}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users size={16} />
          <span>Limit: {job.maxApplications}</span>
        </div>
      </div>
      
      <div className="mt-4">
        {isAdmin ? (
          <div className="flex gap-3">
            <Link 
              to={`/admin/jobs/${job._id}`} 
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all flex-1 text-center"
            >
              Manage Applications
            </Link>
            <Link 
              to={`/admin/jobs/${job._id}/edit`} 
              className="border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-all flex-1 text-center"
            >
              Edit Job
            </Link>
          </div>
        ) : (
          <>
            <button
              onClick={handleApplyClick}
              className="block w-full bg-blue-600 text-white text-center px-4 py-2 rounded-md hover:bg-blue-700 transition-all"
              disabled={!job.isActive}
            >
              Apply
            </button>
            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default JobCard;