import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Paperclip } from 'lucide-react';
import { Job } from '../../types';
import api from '../../config/axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface JobCardProps {
  job: Job;
  isAdmin?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, isAdmin = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    cv: null as File | null,
  });

  const formattedDate = new Date(job.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const handleApplyClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', email: '', contact: '', cv: null });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData({ ...formData, cv: e.target.files[0] });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, contact, cv } = formData;
    if (!cv || !name || !email || !contact) {
      toast.error('All fields are required');
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('cv', cv);
    formDataToSubmit.append('name', name);
    formDataToSubmit.append('email', email);
    formDataToSubmit.append('contact', contact);

    try {
      const res = await fetch(`/apply/${job._id}`, {
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
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            job.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {job.isActive ? 'Active' : 'Closed'}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-600 line-clamp-2">{job.description}</p>
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
          <button
            onClick={handleApplyClick}
            className="block w-full bg-blue-600 text-white text-center px-4 py-2 rounded-md hover:bg-blue-700 transition-all"
            disabled={!job.isActive}
          >
            Apply
          </button>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg transform transition-all">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Apply for {job.title}</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact Number</label>
                <input
                  type="text"
                  name="contact"
                  id="contact"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.contact}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="cv" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Paperclip size={16} />
                  Upload CV
                </label>
                <input
                  type="file"
                  id="cv"
                  accept="application/pdf"
                  className="w-full bg-gray-100 py-2 px-4 border border-gray-300 rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-all"
                  onChange={handleFileChange}
                  required
                />
                {formData.cv && (
                  <div className="mt-2 text-sm text-gray-500">
                    <strong>Selected File: </strong> {formData.cv.name}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-all flex-1"
                >
                  Submit Application
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-all flex-1"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCard;
