import React from 'react';
import { Briefcase as BriefcaseBusiness, Github, Linkedin, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <BriefcaseBusiness size={24} />
            <span className="text-xl font-bold">MasterHireX</span>
          </div>
          
          <div className="flex gap-4">
            <a href="#" className="hover:text-blue-400 transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              <Github size={20} />
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} MasterHireX. All rights reserved.
          </p>
          
          <div className="flex gap-4 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;