import pandas as pd
import numpy as np

def detect_anomalies_zscore(series: pd.Series, threshold: float = 3.0):
    """
    Detect anomalies using the Z-score method.
    Returns a boolean Series where True indicates an anomaly.
    """
    mean = series.mean()
    std = series.std()
    
    if std == 0:
        return pd.Series(False, index=series.index)
        
    z_scores = np.abs((series - mean) / std)
    return z_scores > threshold

def detect_anomalies_iqr(series: pd.Series, multiplier: float = 1.5):
    """
    Detect anomalies using the Interquartile Range (IQR) method.
    """
    q1 = series.quantile(0.25)
    q3 = series.quantile(0.75)
    iqr = q3 - q1
    
    lower_bound = q1 - (multiplier * iqr)
    upper_bound = q3 + (multiplier * iqr)
    
    return (series < lower_bound) | (series > upper_bound)
