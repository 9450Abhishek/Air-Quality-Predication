import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import PredictionForm from './components/PredictionForm';
import ModelStatus from './components/ModelStatus';
import Footer from './components/Footer';
import config from './config';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [modelStatus, setModelStatus] = useState({
    isLoaded: false,
    isTraining: false,
    accuracy: null,
    lastTrained: null,
    isConnected: false
  });

  useEffect(() => {
    // Check model status on component mount
    checkModelStatus();
  }, []);

  const checkModelStatus = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.HEALTH}`);
      const data = await response.json();
      setModelStatus(prev => ({
        ...prev,
        isLoaded: data.model_loaded,
        isConnected: true
      }));
    } catch (error) {
      console.error('Error checking model status:', error);
      setModelStatus(prev => ({
        ...prev,
        isConnected: false
      }));
    }
  };

  const handleModelTrained = (accuracy) => {
    setModelStatus(prev => ({
      ...prev,
      isLoaded: true,
      accuracy,
      lastTrained: new Date().toISOString()
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'predict':
        return <PredictionForm onModelTrained={handleModelTrained} />;
      case 'status':
        return <ModelStatus status={modelStatus} onStatusUpdate={checkModelStatus} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
          },
        }}
      />
      
      <Header 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        modelStatus={modelStatus}
      />
      
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
