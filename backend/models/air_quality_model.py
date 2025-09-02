import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.preprocessing import StandardScaler
import xgboost as xgb
import joblib
import os
import logging

logger = logging.getLogger(__name__)

class AirQualityModel:
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.feature_names = []
        self.target_names = ['CO(GT)', 'NO2(GT)', 'C6H6(GT)']
        self.accuracy = {}
        
    def load_data(self, dataset_path):
        """Load and prepare the UCI Air Quality dataset"""
        try:
            # Load the dataset
            df = pd.read_csv(dataset_path, sep=';', decimal=',')
            
            # Clean column names
            df.columns = df.columns.str.strip()
            
            # Handle missing values (-200 indicates missing data in this dataset)
            df = df.replace(-200, np.nan)
            
            # Drop rows with too many missing values
            df = df.dropna(thresh=len(df.columns) * 0.7)
            
            # Convert date and time columns
            df['Date'] = pd.to_datetime(df['Date'], format='%d/%m/%Y', errors='coerce')
            df['Time'] = pd.to_datetime(df['Time'], format='%H.%M.%S', errors='coerce').dt.time
            
            # Extract datetime features
            df['hour'] = df['Time'].apply(lambda x: x.hour if x else 0)
            df['day_of_week'] = df['Date'].dt.dayofweek
            df['month'] = df['Date'].dt.month
            
            # Drop original date and time columns
            df = df.drop(['Date', 'Time'], axis=1)
            
            # Convert all columns to numeric, handling errors
            for col in df.columns:
                if col not in ['hour', 'day_of_week', 'month']:
                    df[col] = pd.to_numeric(df[col], errors='coerce')
            
            # Drop columns with too many missing values
            df = df.dropna(thresh=len(df.columns) * 0.8)
            
            # Fill remaining missing values with median
            df = df.fillna(df.median())
            
            logger.info(f"Dataset loaded successfully. Shape: {df.shape}")
            return df
            
        except Exception as e:
            logger.error(f"Error loading dataset: {e}")
            raise
    
    def prepare_features(self, df):
        """Prepare features for training"""
        # Define feature columns (excluding target variables)
        feature_cols = [col for col in df.columns if col not in self.target_names]
        
        # Ensure all features are numeric
        feature_cols = [col for col in feature_cols if df[col].dtype in ['int64', 'float64']]
        
        self.feature_names = feature_cols
        
        # Prepare X and y
        X = df[feature_cols]
        y = df[self.target_names]
        
        return X, y
    
    def train(self, dataset_path):
        """Train the model on the dataset"""
        try:
            logger.info("Starting model training...")
            
            # Load and prepare data
            df = self.load_data(dataset_path)
            X, y = self.prepare_features(df)
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Train separate models for each target
            for i, target in enumerate(self.target_names):
                logger.info(f"Training model for {target}...")
                
                # Scale features
                scaler = StandardScaler()
                X_train_scaled = scaler.fit_transform(X_train)
                X_test_scaled = scaler.transform(X_test)
                
                # Train XGBoost model
                model = xgb.XGBRegressor(
                    n_estimators=100,
                    learning_rate=0.1,
                    max_depth=6,
                    random_state=42,
                    n_jobs=-1
                )
                
                model.fit(X_train_scaled, y_train[target])
                
                # Make predictions
                y_pred = model.predict(X_test_scaled)
                
                # Calculate metrics
                mse = mean_squared_error(y_test[target], y_pred)
                r2 = r2_score(y_test[target], y_pred)
                mae = mean_absolute_error(y_test[target], y_pred)
                
                # Store model and scaler
                self.models[target] = model
                self.scalers[target] = scaler
                
                # Store accuracy metrics
                self.accuracy[target] = {
                    'mse': mse,
                    'r2': r2,
                    'mae': mae,
                    'rmse': np.sqrt(mse)
                }
                
                logger.info(f"{target} - R²: {r2:.4f}, RMSE: {np.sqrt(mse):.4f}")
            
            # Save models and scalers
            self.save_models()
            
            logger.info("Model training completed successfully!")
            return True
            
        except Exception as e:
            logger.error(f"Error during training: {e}")
            raise
    
    def predict(self, X):
        """Make predictions using trained models"""
        try:
            if not self.models:
                raise ValueError("No trained models available. Please train the model first.")
            
            # Ensure X has the correct features
            if hasattr(X, 'columns'):
                X = X[self.feature_names]
            else:
                X = pd.DataFrame(X, columns=self.feature_names)
            
            predictions = []
            
            for target in self.target_names:
                if target in self.models and target in self.scalers:
                    # Scale features
                    X_scaled = self.scalers[target].transform(X)
                    
                    # Make prediction
                    pred = self.models[target].predict(X_scaled)
                    predictions.append(pred)
                else:
                    logger.warning(f"Model for {target} not found")
                    predictions.append([0] * len(X))
            
            # Transpose to get predictions for each sample
            return np.array(predictions).T
            
        except Exception as e:
            logger.error(f"Error during prediction: {e}")
            raise
    
    def save_models(self):
        """Save trained models and scalers"""
        try:
            os.makedirs('models', exist_ok=True)
            
            # Save models
            for target, model in self.models.items():
                model_path = f'models/{target.replace("(", "").replace(")", "").replace(".", "_")}_model.pkl'
                joblib.dump(model, model_path)
            
            # Save scalers
            for target, scaler in self.scalers.items():
                scaler_path = f'models/{target.replace("(", "").replace(")", "").replace(".", "_")}_scaler.pkl'
                joblib.dump(scaler, scaler_path)
            
            # Save the main model object
            joblib.dump(self, 'models/air_quality_model.pkl')
            
            logger.info("Models saved successfully")
            
        except Exception as e:
            logger.error(f"Error saving models: {e}")
            raise
    
    def load_models(self, model_dir='models'):
        """Load trained models and scalers"""
        try:
            # Load the main model object
            main_model_path = f'{model_dir}/air_quality_model.pkl'
            if os.path.exists(main_model_path):
                loaded_model = joblib.load(main_model_path)
                self.__dict__.update(loaded_model.__dict__)
                logger.info("Models loaded successfully")
                return True
            else:
                logger.warning("No saved models found")
                return False
                
        except Exception as e:
            logger.error(f"Error loading models: {e}")
            return False
    
    def get_feature_importance(self, target):
        """Get feature importance for a specific target"""
        if target in self.models:
            model = self.models[target]
            importance = model.feature_importances_
            feature_importance = dict(zip(self.feature_names, importance))
            return dict(sorted(feature_importance.items(), key=lambda x: x[1], reverse=True))
        else:
            return {}

