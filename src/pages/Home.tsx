import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/common/Layout';
import { Briefcase as BriefcaseBusiness, Search, FileCheck, BarChart3 } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Smart Recruitment Platform Powered by AI
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Automate your CV screening process and find the best candidates faster with our advanced scoring system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/candidate" 
                  className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-md hover:bg-blue-50 transition-colors text-center"
                >
                  Browse Jobs
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-transparent border-2 border-white text-white font-semibold px-6 py-3 rounded-md hover:bg-white/10 transition-colors text-center"
                >
                  Create Account
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-10">
              <div className="bg-white/10 p-8 rounded-lg backdrop-blur-sm border border-white/20">
                <div className="flex justify-center mb-4">
                  <BriefcaseBusiness size={60} className="text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-center mb-6">
                  Semi-Automated Recruitment Solution
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="bg-white/20 p-2 rounded-full mt-0.5">
                      <Search size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold">Smart CV Parsing</h3>
                      <p className="text-blue-100">Extract text from uploaded CVs and analyze the content automatically</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-white/20 p-2 rounded-full mt-0.5">
                      <BarChart3 size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold">Advanced Scoring</h3>
                      <p className="text-blue-100">Score candidates based on job-specific keywords and requirements</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-white/20 p-2 rounded-full mt-0.5">
                      <FileCheck size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold">Automated Shortlisting</h3>
                      <p className="text-blue-100">Filter candidates easily based on scores and export the results</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Streamline Your Recruitment Process
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 p-3 rounded-full inline-block mb-4">
                <Search size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">For Candidates</h3>
              <p className="text-gray-600 mb-4">
                Browse open positions and apply with your CV. Our system automatically processes your application.
              </p>
              <Link to="/candidate" className="text-blue-600 font-medium hover:underline">
                Find Jobs →
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 p-3 rounded-full inline-block mb-4">
                <BarChart3 size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">For Recruiters</h3>
              <p className="text-gray-600 mb-4">
                Create job listings with custom keywords for scoring. Review applications sorted by relevance.
              </p>
              <Link to="/login" className="text-blue-600 font-medium hover:underline">
                Manage Jobs →
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 p-3 rounded-full inline-block mb-4">
                <FileCheck size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Smart Automation</h3>
              <p className="text-gray-600 mb-4">
                Our AI-powered system scores and ranks candidates based on their CV match with your job keywords.
              </p>
              <Link to="/signup" className="text-blue-600 font-medium hover:underline">
                Get Started →
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Recruitment?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of companies using our platform to find the best talent faster and more efficiently.
          </p>
          <Link 
            to="/signup" 
            className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-md hover:bg-blue-700 transition-colors inline-block"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Home;