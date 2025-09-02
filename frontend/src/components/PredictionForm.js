import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import config from '../config';

const PredictionForm = ({ onModelTrained }) => {
  const [isTraining, setIsTraining] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictions, setPredictions] = useState(null);
  const [modelAccuracy, setModelAccuracy] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setIsPredicting(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.PREDICT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const result = await response.json();
      setPredictions(result.predictions);
      toast.success('Prediction completed successfully!');
    } catch (error) {
      console.error('Prediction error:', error);
      toast.error('Prediction failed. Please try again.');
    } finally {
      setIsPredicting(false);
    }
  };

  const handleTrainModel = async () => {
    setIsTraining(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.TRAIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Training failed');
      }

      const result = await response.json();
      setModelAccuracy(result.accuracy);
      onModelTrained(result.accuracy);
      toast.success('Model trained successfully!');
    } catch (error) {
      console.error('Training error:', error);
      toast.error('Model training failed. Please try again.');
    } finally {
      setIsTraining(false);
    }
  };

  const handleDownloadDataset = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.DOWNLOAD_DATASET}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Dataset download failed');
      }

      toast.success('Dataset downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Dataset download failed. Please try again.');
    }
  };

  const getPollutantStatus = (value, pollutant) => {
    const thresholds = {
      CO: { good: 2, moderate: 4, poor: 6 },
      NO2: { good: 40, moderate: 80, poor: 120 },
      C6H6: { good: 5, moderate: 10, poor: 15 },

    };

    const threshold = thresholds[pollutant];
    if (value <= threshold.good) return { status: 'Good', color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200' };
    if (value <= threshold.moderate) return { status: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200' };
    return { status: 'Poor', color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200' };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Air Quality Prediction
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Input environmental parameters to predict air quality pollutant levels using our advanced ML model
        </p>
      </div>

      {/* Model Training Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-xl p-8 border border-blue-100">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Model Management</h3>
          <p className="text-gray-600">Train the model and download dataset</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleTrainModel}
            disabled={isTraining}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isTraining ? (
              <span className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Training...</span>
              </span>
            ) : (
              <span className="flex items-center space-x-2">
                <span>🤖</span>
                <span>Train Model</span>
              </span>
            )}
          </button>
          <button
            onClick={handleDownloadDataset}
            className="px-8 py-3 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:border-blue-300"
          >
            <span className="flex items-center space-x-2">
              <span>📥</span>
              <span>Download Dataset</span>
            </span>
          </button>
        </div>
        {modelAccuracy && (
          <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
            <p className="text-green-800 font-semibold">
              <span className="text-lg">🎯</span> Model Accuracy: {JSON.stringify(modelAccuracy, null, 2)}
            </p>
          </div>
        )}
      </div>

      {/* Prediction Form */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Input Parameters</h3>
          <p className="text-gray-600">Enter environmental and sensor data for prediction</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Environmental Parameters */}
            <div className="space-y-6">
              <div className="text-center">
                <h4 className="text-xl font-bold text-gray-800 mb-2">🌡️ Environmental Parameters</h4>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Temperature (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('temperature', { required: 'Temperature is required' })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-400"
                    placeholder="25.5"
                  />
                  {errors.temperature && (
                    <p className="text-red-600 text-sm mt-2">{errors.temperature.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Humidity (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('humidity', { required: 'Humidity is required' })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-400"
                    placeholder="60.0"
                  />
                  {errors.humidity && (
                    <p className="text-red-600 text-sm mt-2">{errors.humidity.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Absolute Humidity (g/m³)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    {...register('absolute_humidity')}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-400"
                    placeholder="0.8"
                  />
                </div>
              </div>
            </div>

            {/* Sensor Parameters */}
            <div className="space-y-6">
              <div className="text-center">
                <h4 className="text-xl font-bold text-gray-800 mb-2">🔬 Sensor Parameters</h4>
                <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto rounded-full"></div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    PT08.S1(CO) - CO Sensor
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('pt08_s1')}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-400"
                    placeholder="1200.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    PT08.S2(NMHC) - NMHC Sensor
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('pt08_s2')}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-400"
                    placeholder="1000.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    PT08.S3(NOx) - NOx Sensor
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('pt08_s3')}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-400"
                    placeholder="1100.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    PT08.S4(NO2) - NO2 Sensor
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('pt08_s4')}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-400"
                    placeholder="1500.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    PT08.S5(O3) - O3 Sensor
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('pt08_s5')}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-400"
                    placeholder="1000.0"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <button
              type="submit"
              disabled={isPredicting}
              className="px-10 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isPredicting ? (
                <span className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Predicting...</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2">
                  <span>🔮</span>
                  <span>Get Prediction</span>
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => reset()}
              className="px-10 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:bg-gray-200 transition-all duration-300 transform hover:-translate-y-1"
            >
              <span className="flex items-center space-x-2">
                <span>🔄</span>
                <span>Reset Form</span>
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Predictions Display */}
      {predictions && (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">🎯 Prediction Results</h3>
            <p className="text-gray-600">Air quality pollutant levels</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(predictions).map(([pollutant, value]) => {
              const status = getPollutantStatus(value, pollutant);
              return (
                <div key={pollutant} className={`text-center p-6 rounded-2xl border-2 ${status.border} ${status.bg} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                  <h4 className="font-bold text-gray-800 mb-3 text-lg">{pollutant}</h4>
                  <div className={`text-3xl font-bold ${status.color} mb-3`}>
                    {value.toFixed(2)}
                  </div>
                  <span className={`inline-block px-4 py-2 text-sm font-bold ${status.bg} ${status.color} rounded-full border ${status.border}`}>
                    {status.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionForm;
