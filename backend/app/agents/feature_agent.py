import pandas as pd
import numpy as np
import holidays

class FeatureAgent:
    def __init__(self, country_code='IN'):
        self.country_code = country_code

    def create_features(self, df: pd.DataFrame, target_col: str = 'total') -> pd.DataFrame:
        df = df.copy()
        
        # Ensure index is datetime
        if not isinstance(df.index, pd.DatetimeIndex):
            df['date'] = pd.to_datetime(df['date'])
            df.set_index('date', inplace=True)
        
        # Time features
        df['month'] = df.index.month
        df['day_of_week'] = df.index.dayofweek
        df['quarter'] = df.index.quarter
        df['day_of_year'] = df.index.dayofyear
        
        # Holiday flag (India calendar)
        in_holidays = holidays.country_holidays(self.country_code)
        df['is_holiday'] = df.index.map(lambda x: 1 if x in in_holidays else 0)
        
        # Lag features
        df['lag_1'] = df[target_col].shift(1)
        df['lag_7'] = df[target_col].shift(7)
        df['lag_30'] = df[target_col].shift(30)
        
        # Rolling mean / std
        df['rolling_mean_7'] = df[target_col].shift(1).rolling(window=7).mean()
        df['rolling_std_7'] = df[target_col].shift(1).rolling(window=7).std()
        df['rolling_mean_30'] = df[target_col].shift(1).rolling(window=30).mean()
        
        # Fourier features for seasonality
        # Assuming annual seasonality (approx 52 weeks)
        for k in range(1, 3):
            df[f'sin_{k}'] = np.sin(2 * np.pi * k * df.index.dayofyear / 365.25)
            df[f'cos_{k}'] = np.cos(2 * np.pi * k * df.index.dayofyear / 365.25)
            
        # Drop NaNs created by lagging (or fill them)
        # We will backward fill for simplicity so we don't lose data, but ideally we should drop or model them.
        df.bfill(inplace=True)
        
        return df
