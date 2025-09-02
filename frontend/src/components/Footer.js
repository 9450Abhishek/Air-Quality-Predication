import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white mt-16">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Project Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">AQ</span>
              </div>
              <h3 className="text-lg font-bold text-white">Air Quality Prediction</h3>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed text-sm">
              A machine learning-powered system for predicting air quality parameters 
              using environmental and sensor data.
            </p>
            <div className="flex space-x-3 text-xs text-gray-400">
              <span className="px-2 py-1 bg-white/10 rounded-full backdrop-blur-sm">v1.0.0</span>
              <span className="px-2 py-1 bg-white/10 rounded-full backdrop-blur-sm">MIT License</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-4 text-base">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
                  className="text-gray-300 hover:text-blue-400 transition-all duration-300 hover:translate-x-1 flex items-center space-x-2 text-sm"
                >
                  <span>📊</span>
                  <span>Dashboard</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('predict')?.scrollIntoView({ behavior: 'smooth' })} 
                  className="text-gray-300 hover:text-blue-400 transition-all duration-300 hover:translate-x-1 flex items-center space-x-2 text-sm"
                >
                  <span>🔮</span>
                  <span>Predictions</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('status')?.scrollIntoView({ behavior: 'smooth' })} 
                  className="text-gray-300 hover:text-blue-400 transition-all duration-300 hover:translate-x-1 flex items-center space-x-2 text-sm"
                >
                  <span>⚙️</span>
                  <span>Status</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 mt-6 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-300 text-xs">
                © 2024 Air Quality Prediction System. Built with ❤️ for environmental monitoring.
              </p>
            </div>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-110 p-1.5 rounded hover:bg-white/10"
              >
                <span className="sr-only">GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href="/docs" 
                className="text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-110 p-1.5 rounded hover:bg-white/10"
              >
                <span className="sr-only">Documentation</span>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </a>
              <a 
                href="/support" 
                className="text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-110 p-1.5 rounded hover:bg-white/10"
              >
                <span className="sr-only">Support</span>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
