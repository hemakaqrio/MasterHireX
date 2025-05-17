import { Briefcase, Github, Mail, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Briefcase className="h-6 w-6 mr-2" />
              <span className="text-xl font-bold">MasterHireX</span>
            </div>
            <p className="text-sm text-gray-300">
              Transforming recruitment with intelligent automation. Our platform helps you find the best candidates faster.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/candidate" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/candidate/jobs" className="text-gray-300 hover:text-white transition-colors">
                  Job Openings
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                  Log In
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-300 hover:text-white transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <span className="text-gray-300">hello@MasterHireX.com</span>
              </li>
              <li className="flex items-center">
                <PhoneCall className="h-5 w-5 mr-2" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Github className="h-5 w-5 mr-2" />
                <a 
                  href="https://github.com/MasterHireX"
                  className="text-gray-300 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/MasterHireX
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-600">
          <p className="text-center text-sm text-gray-300">
            &copy; {new Date().getFullYear()} MasterHireX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;