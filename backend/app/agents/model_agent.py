import os
import joblib
import pandas as pd
import numpy as np
from sklearn.metrics import mean_squared_error, mean_absolute_error, mean_absolute_percentage_error
from statsmodels.tsa.statespace.sarimax import SARIMAX
from prophet import Prophet
import xgboost as xgb
import torch
import torch.nn as nn
from app.core.config import settings
import warnings
warnings.filterwarnings("ignore")

class LSTMForecaster(nn.Module):
    def __init__(self, input_size, hidden_size=64, num_layers=2, output_size=1):
        super().__init__()
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True)
        self.linear = nn.Linear(hidden_size, output_size)

    def forward(self, x):
        lstm_out, _ = self.lstm(x)
        predictions = self.linear(lstm_out[:, -1, :])
        return predictions

class ModelAgent:
    def __init__(self, state: str):
        self.state = state
        self.models_dir = os.path.join(settings.MODELS_DIR, self.state)
        os.makedirs(self.models_dir, exist_ok=True)

    def _split_data(self, df: pd.DataFrame, target_col='total', split_ratio=0.8):
        n = len(df)
        split_idx = int(n * split_ratio)
        train = df.iloc[:split_idx]
        val = df.iloc[split_idx:]
        return train, val

    def calculate_metrics(self, y_true, y_pred):
        return {
            "rmse": np.sqrt(mean_squared_error(y_true, y_pred)),
            "mae": mean_absolute_error(y_true, y_pred),
            "mape": mean_absolute_percentage_error(y_true, y_pred)
        }

    def train_arima(self, df: pd.DataFrame, target_col='total'):
        train, val = self.split_data(df)
        model = SARIMAX(train[target_col], order=(1, 1, 1), seasonal_order=(1, 1, 0, 52))
        results = model.fit(disp=False)
        preds = results.forecast(steps=len(val))
        metrics = self.calculate_metrics(val[target_col], preds)
        path = os.path.join(self.models_dir, 'arima.pkl')
        joblib.dump(results, path)
        return metrics, path

    def train_prophet(self, df: pd.DataFrame, target_col='total'):
        train, val = self.split_data(df)
        pdf = train.reset_index()[['date', target_col]].rename(columns={'date': 'ds', target_col: 'y'})
        model = Prophet()
        model.fit(pdf)
        val_pdf = val.reset_index()[['date']].rename(columns={'date': 'ds'})
        preds = model.predict(val_pdf)['yhat'].values
        metrics = self.calculate_metrics(val[target_col], preds)
        path = os.path.join(self.models_dir, 'prophet.pkl')
        with open(path, 'wb') as f:
            joblib.dump(model, f)
        return metrics, path

    def train_xgboost(self, df: pd.DataFrame, target_col='total'):
        train, val = self.split_data(df)
        features = [c for c in train.columns if c != target_col and c != 'state']
        
        model = xgb.XGBRegressor(n_estimators=100, learning_rate=0.1, max_depth=5)
        model.fit(train[features], train[target_col])
        preds = model.predict(val[features])
        metrics = self.calculate_metrics(val[target_col], preds)
        path = os.path.join(self.models_dir, 'xgboost.pkl')
        joblib.dump(model, path)
        return metrics, path

    def train_lstm(self, df: pd.DataFrame, target_col='total'):
        train, val = self.split_data(df)
        features = [c for c in train.columns if c != target_col and c != 'state']
        
        # Scaling could be added here for LSTM
        X_train = torch.FloatTensor(train[features].values).unsqueeze(1)
        y_train = torch.FloatTensor(train[target_col].values).unsqueeze(1)
        X_val = torch.FloatTensor(val[features].values).unsqueeze(1)
        y_val = val[target_col].values
        
        model = LSTMForecaster(input_size=len(features))
        criterion = nn.MSELoss()
        optimizer = torch.optim.Adam(model.parameters(), lr=0.01)
        
        for epoch in range(100):
            model.train()
            optimizer.zero_grad()
            out = model(X_train)
            loss = criterion(out, y_train)
            loss.backward()
            optimizer.step()
            
        model.eval()
        with torch.no_grad():
            preds = model(X_val).squeeze().numpy()
            
        metrics = self.calculate_metrics(y_val, preds)
        path = os.path.join(self.models_dir, 'lstm.pt')
        torch.save(model.state_dict(), path)
        return metrics, path

    def split_data(self, df):
        return self._split_data(df)

    def train_all(self, df: pd.DataFrame):
        results = {}
        try:
            metrics, path = self.train_arima(df)
            results['ARIMA'] = {'metrics': metrics, 'path': path}
        except Exception as e:
            print(f"ARIMA failed: {e}")
            
        try:
            metrics, path = self.train_prophet(df)
            results['Prophet'] = {'metrics': metrics, 'path': path}
        except Exception as e:
            print(f"Prophet failed: {e}")
            
        try:
            metrics, path = self.train_xgboost(df)
            results['XGBoost'] = {'metrics': metrics, 'path': path}
        except Exception as e:
            print(f"XGB failed: {e}")
            
        try:
            metrics, path = self.train_lstm(df)
            results['LSTM'] = {'metrics': metrics, 'path': path}
        except Exception as e:
            print(f"LSTM failed: {e}")
            
        return results
