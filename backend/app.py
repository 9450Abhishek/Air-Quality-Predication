from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import joblib
import numpy as np
import pandas as pd
from datetime import datetime
import logging

# Import custom modules
from models.air_quality_model import AirQualityModel
from utils.data_preprocessor import DataPreprocessor
from utils.data_downloader import download_dataset

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize model and preprocessor
model = None
preprocessor = None

@app.route('/')
def home():
    return jsonify({
        "message": "Air Quality Prediction API",
        "status": "running",
        "endpoints": {
            "/predict": "POST - Make predictions",
            "/health": "GET - Check API health",
            "/model-info": "GET - Get model information"
        }
    })

@app.route('/health')
def health_check():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "model_loaded": model is not None
    })

@app.route('/model-info')
def model_info():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500
    
    return jsonify({
        "model_type": "XGBoost Regression",
        "features": model.feature_names,
        "targets": model.target_names,
        "model_accuracy": getattr(model, 'accuracy', 'Not available')
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if model is None:
            return jsonify({"error": "Model not loaded. Please train the model first."}), 500
        
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Extract features from request
        features = {
            'Date': data.get('date', datetime.now().strftime('%Y-%m-%d')),
            'Time': data.get('time', datetime.now().strftime('%H:%M:%S')),
            'CO(GT)': data.get('co', None),
            'PT08.S1(CO)': data.get('pt08_s1', None),
            'NMHC(GT)': data.get('nmhc', None),
            'C6H6(GT)': data.get('c6h6', None),
            'PT08.S2(NMHC)': data.get('pt08_s2', None),
            'NOx(GT)': data.get('nox', None),
            'PT08.S3(NOx)': data.get('pt08_s3', None),
            'NO2(GT)': data.get('no2', None),
            'PT08.S4(NO2)': data.get('pt08_s4', None),
            'PT08.S5(O3)': data.get('pt08_s5', None),
            'T': data.get('temperature', None),
            'RH': data.get('humidity', None),
            'AH': data.get('absolute_humidity', None)
        }
        
        # Create DataFrame
        input_df = pd.DataFrame([features])
        
        # Preprocess input data
        processed_data = preprocessor.preprocess_input(input_df)
        
        # Make prediction
        predictions = model.predict(processed_data)
        
        # Format results
        results = {
            "predictions": {
                "CO": float(predictions[0][0]),
                "NO2": float(predictions[0][1]),
                "C6H6": float(predictions[0][2])
            },
            "input_features": features,
            "timestamp": datetime.now().isoformat()
        }
        
        return jsonify(results)
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

@app.route('/train', methods=['POST'])
def train_model():
    try:
        global model, preprocessor
        
        # Download dataset if not exists
        dataset_path = download_dataset()
        
        # Initialize and train model
        model = AirQualityModel()
        model.train(dataset_path)
        
        # Initialize preprocessor
        preprocessor = DataPreprocessor()
        preprocessor.fit(dataset_path)
        
        return jsonify({
            "message": "Model trained successfully",
            "accuracy": getattr(model, 'accuracy', 'Not available'),
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Training error: {str(e)}")
        return jsonify({"error": f"Training failed: {str(e)}"}), 500

@app.route('/download-dataset', methods=['POST'])
def download_dataset_endpoint():
    try:
        dataset_path = download_dataset()
        return jsonify({
            "message": "Dataset downloaded successfully",
            "path": dataset_path,
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Dataset download error: {str(e)}")
        return jsonify({"error": f"Dataset download failed: {str(e)}"}), 500

if __name__ == '__main__':
    # Try to load existing model
    try:
        model_path = 'models/air_quality_model.pkl'
        if os.path.exists(model_path):
            model = joblib.load(model_path)
            logger.info("Loaded existing model")
        
        preprocessor_path = 'models/preprocessor.pkl'
        if os.path.exists(preprocessor_path):
            preprocessor = joblib.load(preprocessor_path)
            logger.info("Loaded existing preprocessor")
            
    except Exception as e:
        logger.warning(f"Could not load existing model: {e}")
    
    app.run(debug=True, host='127.0.0.1', port=8000)

