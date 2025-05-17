import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, FileCheck, BarChart3 } from 'lucide-react';
import { useJobsStore } from '../../store/jobsStore';

const HomePage = () => {
  const { fetchPublicJobs, publicJobs, loading } = useJobsStore();

  useEffect(() => {
    fetchPublicJobs();
  }, [fetchPublicJobs]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              Find Your Next Career Opportunity
            </h1>
            <p className="text-xl mb-8">
              Our AI-powered platform helps match your skills with the perfect job. Upload your CV once and let our technology do the rest.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/candidate/jobs"
                className="btn btn-accent px-8 py-3 text-lg"
              >
                Browse Jobs
              </Link>
              <Link
                to="/signup"
                className="btn bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Job Openings</h2>
            <p className="mt-4 text-xl text-gray-600">
              Discover our latest job opportunities across various industries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))
            ) : (
              publicJobs.slice(0, 3).map((job) => (
                <div key={job._id} className="card hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                    <p className="text-gray-500 mb-1">{job.company}</p>
                    <p className="text-gray-500 mb-1">{job.location}</p>
                    <p className="text-gray-700 mb-4 line-clamp-2">
                      {job.description.slice(0, 120)}...
                    </p>
                    <Link
                      to={`/candidate/jobs/${job._id}`}
                      className="btn btn-primary w-full flex justify-center items-center"
                    >
                      Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/candidate/jobs"
              className="btn btn-outline text-primary border-primary hover:bg-primary/5 inline-flex items-center"
            >
              View All Jobs <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600">
              Our AI-powered recruitment platform simplifies your job search
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary text-white rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Jobs</h3>
              <p className="text-gray-600">
                Explore our curated list of job openings from top companies
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary text-white rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <FileCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Your CV</h3>
              <p className="text-gray-600">
                Submit your CV once and our AI will match your skills to the right jobs
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary text-white rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Matched</h3>
              <p className="text-gray-600">
                Our advanced scoring system helps employers find the perfect candidates
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Next Job?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have already found their dream jobs through our platform
          </p>
          <Link
            to="/candidate/jobs"
            className="btn bg-white text-secondary hover:bg-gray-100 px-8 py-3 text-lg"
          >
            Search Jobs Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;