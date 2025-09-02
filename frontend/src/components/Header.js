import React from 'react';

const Header = ({ activeTab, onTabChange, modelStatus }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'predict', label: 'Predict', icon: '🔮' },
    { id: 'status', label: 'Model Status', icon: '⚙️' }
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">AQ</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Air Quality Prediction
              </h1>
              <p className="text-sm text-gray-600 font-medium">ML-powered pollutant forecasting</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 hover:shadow-md'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Model Status Indicator */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  modelStatus.isConnected ? 'bg-green-500' : 'bg-red-500'
                } animate-pulse`}></div>
                <span className="text-sm text-gray-600 font-medium">
                  {modelStatus.isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              
              {/* Model Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  modelStatus.isLoaded ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
                <span className="text-sm text-gray-600 font-medium">
                  {modelStatus.isLoaded ? 'Model Ready' : 'Model Not Ready'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
