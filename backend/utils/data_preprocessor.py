import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
import logging

logger = logging.getLogger(__name__)

class DataPreprocessor:
    def __init__(self):
        self.scalers = {}
        self.feature_names = []
        self.target_names = ['CO(GT)', 'NO2(GT)', 'C6H6(GT)', 'PM10']
        self.is_fitted = False
        
    def fit(self, dataset_path):
        """Fit the preprocessor on the training dataset"""
        try:
            logger.info("Fitting data preprocessor...")
            
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
            
            # Define feature columns (excluding target variables)
            self.feature_names = [col for col in df.columns if col not in self.target_names]
            
            # Ensure all features are numeric
            self.feature_names = [col for col in self.feature_names if df[col].dtype in ['int64', 'float64']]
            
            # Prepare features
            X = df[self.feature_names]
            
            # Fit scaler for features
            self.feature_scaler = StandardScaler()
            self.feature_scaler.fit(X)
            
            self.is_fitted = True
            logger.info(f"Data preprocessor fitted successfully. Features: {len(self.feature_names)}")
            
        except Exception as e:
            logger.error(f"Error fitting data preprocessor: {e}")
            raise
    
    def preprocess_input(self, input_df):
        """Preprocess input data for prediction"""
        try:
            if not self.is_fitted:
                raise ValueError("Preprocessor not fitted. Please call fit() first.")
            
            # Ensure input has the correct features
            if not all(col in input_df.columns for col in self.feature_names):
                missing_cols = [col for col in self.feature_names if col not in input_df.columns]
                logger.warning(f"Missing columns: {missing_cols}")
                
                # Add missing columns with default values
                for col in missing_cols:
                    input_df[col] = 0
            
            # Select only the required features
            input_df = input_df[self.feature_names]
            
            # Handle missing values
            input_df = input_df.fillna(0)
            
            # Ensure all values are numeric
            for col in input_df.columns:
                input_df[col] = pd.to_numeric(input_df[col], errors='coerce')
            
            # Fill any remaining NaN values
            input_df = input_df.fillna(0)
            
            # Scale features
            scaled_features = self.feature_scaler.transform(input_df)
            
            return scaled_features
            
        except Exception as e:
            logger.error(f"Error preprocessing input data: {e}")
            raise
    
    def preprocess_training_data(self, df):
        """Preprocess training data"""
        try:
            if not self.is_fitted:
                raise ValueError("Preprocessor not fitted. Please call fit() first.")
            
            # Apply the same preprocessing steps as in fit
            processed_df = df.copy()
            
            # Handle missing values
            processed_df = processed_df.replace(-200, np.nan)
            processed_df = processed_df.fillna(processed_df.median())
            
            # Extract features
            X = processed_df[self.feature_names]
            y = processed_df[self.target_names]
            
            # Scale features
            X_scaled = self.feature_scaler.transform(X)
            
            return X_scaled, y
            
        except Exception as e:
            logger.error(f"Error preprocessing training data: {e}")
            raise
    
    def get_feature_names(self):
        """Get the list of feature names"""
        return self.feature_names.copy()
    
    def get_target_names(self):
        """Get the list of target names"""
        return self.target_names.copy()
    
    def inverse_transform_features(self, scaled_features):
        """Transform scaled features back to original scale"""
        try:
            if not self.is_fitted:
                raise ValueError("Preprocessor not fitted. Please call fit() first.")
            
            return self.feature_scaler.inverse_transform(scaled_features)
            
        except Exception as e:
            logger.error(f"Error in inverse transform: {e}")
            raise

