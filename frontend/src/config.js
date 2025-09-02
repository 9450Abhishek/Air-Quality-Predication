const config = {
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  ENDPOINTS: {
    HEALTH: '/health',
    PREDICT: '/predict',
    TRAIN: '/train',
    MODEL_INFO: '/model-info',
    DOWNLOAD_DATASET: '/download-dataset'
  }
};

export default config;
