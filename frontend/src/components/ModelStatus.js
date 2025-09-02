import React, { useState, useEffect } from 'react';
import config from '../config';

const ModelStatus = ({ status, onStatusUpdate }) => {
  const [modelInfo, setModelInfo] = useState(null);

  useEffect(() => {
    if (status.isLoaded) {
      fetchModelInfo();
    }
  }, [status.isLoaded]);

  const fetchModelInfo = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.MODEL_INFO}`);
      if (response.ok) {
        const data = await response.json();
        setModelInfo(data);
      }
    } catch (error) {
      console.error('Error fetching model info:', error);
    }
  };

  const handleRefresh = () => {
    onStatusUpdate();
    if (status.isLoaded) {
      fetchModelInfo();
    }
  };

  const getStatusColor = (isLoaded) => {
    return isLoaded ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (isLoaded) => {
    return isLoaded ? '✅' : '❌';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Model Status
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Monitor the status and performance of your air quality prediction model
        </p>
      </div>

      {/* Status Overview */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">System Status</h3>
          <p className="text-gray-600">Current model and system health</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Model Status */}
          <div className="text-center p-6 border-2 border-gray-200 rounded-2xl hover:shadow-lg transition-all duration-300">
            <div className="text-4xl mb-3">{getStatusIcon(status.isLoaded)}</div>
            <h4 className="font-bold text-gray-800 mb-2 text-lg">Model Status</h4>
            <p className={`font-semibold text-lg ${getStatusColor(status.isLoaded)}`}>
              {status.isLoaded ? 'Ready' : 'Not Ready'}
            </p>
          </div>

          {/* Connection Status */}
          <div className="text-center p-6 border-2 border-gray-200 rounded-2xl hover:shadow-lg transition-all duration-300">
            <div className="text-4xl mb-3">🌐</div>
            <h4 className="font-bold text-gray-800 mb-2 text-lg">Connection</h4>
            <p className={`font-semibold text-lg ${status.isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {status.isConnected ? 'Connected' : 'Disconnected'}
            </p>
          </div>

          {/* Last Training */}
          <div className="text-center p-6 border-2 border-gray-200 rounded-2xl hover:shadow-lg transition-all duration-300">
            <div className="text-4xl mb-3">🕒</div>
            <h4 className="font-bold text-gray-800 mb-2 text-lg">Last Trained</h4>
            <p className="text-gray-600 font-semibold">
              {status.lastTrained 
                ? new Date(status.lastTrained).toLocaleDateString()
                : 'Never'
              }
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleRefresh}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <span className="flex items-center space-x-2">
              <span>🔄</span>
              <span>Refresh Status</span>
            </span>
          </button>
        </div>
      </div>

      {/* Model Information */}
      {status.isLoaded && modelInfo && (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Model Information</h3>
            <p className="text-gray-600">Technical details about the trained model</p>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100">
                <h4 className="font-bold text-gray-800 mb-3 text-lg">Model Type</h4>
                <p className="text-gray-700 font-semibold">{modelInfo.model_type}</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl border border-green-100">
                <h4 className="font-bold text-gray-800 mb-3 text-lg">Target Variables</h4>
                <div className="flex flex-wrap gap-2">
                  {modelInfo.targets?.map((target, index) => (
                    <span key={index} className="px-3 py-2 bg-blue-100 text-blue-800 text-sm font-semibold rounded-lg border border-blue-200">
                      {target}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {modelInfo.features && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
                <h4 className="font-bold text-gray-800 mb-4 text-lg">Input Features</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {modelInfo.features.map((feature, index) => (
                    <span key={index} className="px-3 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-purple-200 shadow-sm">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {modelInfo.model_accuracy && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-100">
                <h4 className="font-bold text-gray-800 mb-4 text-lg">Model Performance</h4>
                <div className="bg-white p-4 rounded-xl border border-yellow-200">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                    {JSON.stringify(modelInfo.model_accuracy, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Model Training History */}
      {status.isLoaded && (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Training History</h3>
            <p className="text-gray-600">Model training and performance metrics</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">ℹ️</span>
                <p className="text-blue-800 font-semibold text-lg">
                  <strong>Note:</strong> The model has been successfully trained and is ready for predictions. 
                  You can view detailed accuracy metrics above and make predictions using the Predict tab.
                </p>
              </div>
            </div>

            {status.accuracy && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
                <h4 className="font-bold text-green-800 mb-4 text-xl">Latest Training Results</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(status.accuracy).map(([target, metrics]) => (
                    <div key={target} className="border-2 border-green-200 rounded-2xl p-6 bg-white shadow-lg">
                      <h5 className="font-bold text-green-800 mb-4 text-lg">{target}</h5>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                          <span className="font-semibold">R² Score:</span>
                          <span className="font-bold text-green-700">{(metrics.r2 * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                          <span className="font-semibold">RMSE:</span>
                          <span className="font-bold text-blue-700">{metrics.rmse.toFixed(3)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                          <span className="font-semibold">MAE:</span>
                          <span className="font-bold text-purple-700">{metrics.mae.toFixed(3)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* System Requirements */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl shadow-xl p-8 border border-gray-200">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">System Requirements</h3>
          <p className="text-gray-600">What you need to run the system</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h4 className="font-bold text-gray-800 mb-4 text-lg">Backend Requirements</h4>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="font-medium">Python 3.8+</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="font-medium">Flask Framework</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="font-medium">XGBoost & Scikit-learn</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="font-medium">UCI Air Quality Dataset</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h4 className="font-bold text-gray-800 mb-4 text-lg">Frontend Requirements</h4>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="font-medium">React 18+</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="font-medium">Node.js 16+</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="font-medium">Modern Web Browser</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="font-medium">Internet Connection</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelStatus;
