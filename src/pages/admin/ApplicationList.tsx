import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getJob } from '../../services/jobService';
import { getApplications, addToFiltered } from '../../services/applicationService';
import { Job, Application } from '../../types';
import { jsPDF } from 'jspdf';
import { AlertCircle, Download, ExternalLink, UserCheck, ArrowUp, ArrowDown, CheckCircle, Clock, Briefcase } from 'lucide-react';
import * as XLSX from 'xlsx'; // Import library to handle CSV export
import emailjs from 'emailjs-com';  // Import EmailJS library
import { toast } from 'react-toastify';


const ApplicationList: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplications, setSelectedApplications] = useState<Set<string>>(new Set());  // Track selected applications
  const [sortField, setSortField] = useState<'score' | 'createdAt'>('score');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<'all' | 'filtered'>('all');
  const [filteredIds, setFilteredIds] = useState<string[]>([]);
  const [updatingApplication, setUpdatingApplication] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<'reject' | 'moveForward'>('reject');
  const [emailContent, setEmailContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applicationId, setApplicationId] = useState<string>(''); // Track the application ID for email

  // Fetch job and applications data
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const [jobData, applicationsData] = await Promise.all([getJob(id), getApplications(id)]);

        setJob(jobData);
        setApplications(applicationsData);

        const filtered = applicationsData
          .filter(app => app.filtered)
          .map(app => app._id);

        setFilteredIds(filtered);
      } catch (err) {
        console.error(err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const newSelectedApplications = new Set<string>();
    if (checked) {
      applications.forEach(app => newSelectedApplications.add(app._id));
    }
    setSelectedApplications(newSelectedApplications);
  };

  const handleSelectApplication = (e: React.ChangeEvent<HTMLInputElement>, applicationId: string) => {
    const checked = e.target.checked;
    const newSelectedApplications = new Set(selectedApplications);
    if (checked) {
      newSelectedApplications.add(applicationId);
    } else {
      newSelectedApplications.delete(applicationId);
    }
    setSelectedApplications(newSelectedApplications);
  };

  const handleSort = (field: 'score' | 'createdAt') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleExportJson = () => {
    const selectedData = applications.filter(app => selectedApplications.has(app._id));
    const jsonBlob = new Blob([JSON.stringify(selectedData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(jsonBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'applications.json';
    a.click();
  };

  const handleExportCsv = () => {
    const selectedData = applications.filter(app => selectedApplications.has(app._id));
    const csvData = selectedData.map(app => ({
      name: app.name,
      email: app.email,
      score: app.score,
      date: new Date(app.createdAt).toLocaleDateString(),
    }));

    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Applications');
    XLSX.writeFile(wb, 'applications.csv');
  };

  const handleFilterToggle = async (applicationId: string) => {
    try {
      setUpdatingApplication(applicationId);

      if (filteredIds.includes(applicationId)) {
        console.warn('Removing from filtered list not implemented in backend');
      } else {
        await addToFiltered(applicationId);
        setFilteredIds(prev => [...prev, applicationId]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingApplication(null);
    }
  };

  const downloadPdf = async (application: Application) => {
    const doc = new jsPDF();
    doc.setFont("helvetica");

    doc.setFontSize(22);
    doc.text("Candidate Application", 20, 20);

    doc.setFontSize(16);
    doc.text("Job Details", 20, 35);
    doc.setFontSize(12);
    doc.text(`Title: ${job?.title || ''}`, 20, 45);
    doc.text(`Application Date: ${new Date(application.createdAt).toLocaleDateString()}`, 20, 55);

    doc.setFontSize(16);
    doc.text("Candidate Details", 20, 70);
    doc.setFontSize(12);
    doc.text(`Email: ${application.email}`, 20, 80);
    doc.text(`Score: ${application.score}`, 20, 90);

    doc.setFontSize(16);
    doc.text("CV Content", 20, 110);
    doc.setFontSize(10);

    const textLines = doc.splitTextToSize(application.extractedText || 'No CV text available', 170);
    doc.text(textLines, 20, 120);

    doc.save(`application_${application._id}.pdf`);
  };

  const getSortedApplications = () => {
    const filtered = filterStatus === 'filtered'
      ? applications.filter(app => filteredIds.includes(app._id))
      : applications;

    return filtered.sort((a, b) => {
      if (sortField === 'score') {
        return sortDirection === 'asc' ? a.score - b.score : b.score - a.score;
      } else {
        return sortDirection === 'asc'
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  };

  const sortedApplications = getSortedApplications();

  const handleOpenModal = (template: 'reject' | 'moveForward', applicationId: string) => {
    setSelectedTemplate(template);
    setApplicationId(applicationId);
    setEmailContent(template === 'reject'
      ? 'We regret to inform you that you have not been selected for this position.'
      : 'We are pleased to inform you that you have been selected to move forward in the process.');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSendEmail = async () => {
    try {
      const application = applications.find((app) => app._id === applicationId);
      if (!application) {
        console.error('Application not found');
        return;
      }

      const subject = selectedTemplate === 'reject' ? 'Application Rejection' : 'Application Update';
      const content = selectedTemplate === 'reject'
        ? 'We regret to inform you that you have not been selected for this position.'
        : 'We are pleased to inform you that you have been selected to move forward in the process.';

      const templateParams = {
        to_email: application.email,
        subject: subject,
        message: content,
        applicant_name: application.name,
      };

      const serviceID = 'service_646455e';
      const templateID = 'template_3goq5j8';
      const userID = 'Eap1RQikGh-pnsovv';

      emailjs.send(serviceID, templateID, templateParams, userID)
        .then((response) => {
          console.log('Email sent successfully', response);
          toast.success('Email sent successfully!');
          setIsModalOpen(false);
        })
        .catch((error) => {
          console.error('Failed to send email:', error);
          alert('Failed to send email. Please try again later.');
        });
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email. Please try again later.!');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex justify-center items-center">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-10 text-center">
          <div className="bg-red-50 text-red-700 p-6 rounded-lg inline-block">
            <AlertCircle size={40} className="mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error Loading Data</h2>
            <p>{error || 'Job not found'}</p>
            <button
              onClick={() => navigate('/admin')}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin')}
            className="text-blue-600 hover:underline flex items-center gap-1"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Job Info */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <div className="bg-blue-700 text-white p-6">
            <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
            <div className="flex items-center gap-2 text-blue-100">
              <Briefcase size={16} />
              <span>{applications.length} application{applications.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
            </div>

            {job.keywords && job.keywords.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Scoring Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {job.keywords.map((keyword, index) => (
                    <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Export Section */}
        <div className="mb-6">
          <button
            onClick={handleExportJson}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Export as JSON
          </button>
          <button
            onClick={handleExportCsv}
            className="ml-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Export as CSV
          </button>
        </div>

        {/* Applications List */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Applications</h2>
          </div>

          <div className="p-4 bg-gray-50 border-b flex flex-col md:flex-row justify-between gap-4">
            <div className="flex gap-4">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-md ${filterStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
              >
                All Applications
              </button>
              <button
                onClick={() => setFilterStatus('filtered')}
                className={`px-4 py-2 rounded-md ${filterStatus === 'filtered' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
              >
                Filtered Only
              </button>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => handleSort('score')}
                className="flex items-center gap-1 px-4 py-2 rounded-md bg-white text-gray-700 border border-gray-300"
              >
                Sort by Score
                {sortField === 'score' && (sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />)}
              </button>
              <button
                onClick={() => handleSort('createdAt')}
                className="flex items-center gap-1 px-4 py-2 rounded-md bg-white text-gray-700 border border-gray-300"
              >
                Sort by Date
                {sortField === 'createdAt' && (sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />)}
              </button>
            </div>
          </div>

          {/* Applications Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedApplications.size === applications.length}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied On</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedApplications.map(application => (
                  <tr key={application._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedApplications.has(application._id)}
                        onChange={(e) => handleSelectApplication(e, application._id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        <span className="block">{application.name}</span>
                        <span className="block">{application.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{application.score}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(application.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {filteredIds.includes(application._id) ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle size={12} className="mr-1" /> Filtered
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <Clock size={12} className="mr-1" /> Reviewing
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => window.open(application.cvUrl, '_blank')}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Original CV"
                        >
                          <ExternalLink size={18} />
                        </button>
                        <button
                          onClick={() => downloadPdf(application)}
                          className="text-green-600 hover:text-green-800"
                          title="Download Application"
                        >
                          <Download size={18} />
                        </button>
                        <button
                          onClick={() => handleFilterToggle(application._id)}
                          className={filteredIds.includes(application._id) ? 'text-green-600 hover:text-green-800' : 'text-gray-600 hover:text-gray-800'}
                          title={filteredIds.includes(application._id) ? 'Remove from Filtered' : 'Add to Filtered'}
                        >
                          <UserCheck size={18} />
                        </button>
                        <button
                          onClick={() => handleOpenModal('reject', application._id)} // Open the modal to send reject email
                          className="text-red-600 hover:text-red-800"
                          title="Send Reject Email"
                        >
                          <AlertCircle size={18} />
                        </button>
                        <button
                          onClick={() => handleOpenModal('moveForward', application._id)} // Open the modal to send move forward email
                          className="text-green-600 hover:text-green-800"
                          title="Send Move Forward Email"
                        >
                          <CheckCircle size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Send Email</h2>
            <textarea
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              rows={5}
              className="w-full p-2 border rounded-md"
            />
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleSendEmail}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Send Email
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ApplicationList;
