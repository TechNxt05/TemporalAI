import pandas as pd
from statsmodels.tsa.seasonal import STL

def decompose_time_series(series: pd.Series, period: int = 52):
    """
    Perform STL decomposition on a time series.
    Assumes series has a DateTimeIndex.
    """
    try:
        # Handle missing values if any
        series = series.interpolate(method='time').bfill().ffill()
        
        # We need at least 2 full periods for STL
        if len(series) < 2 * period:
            # Fallback to smaller period if necessary, e.g. 4 for monthly data inside a year
            period = min(len(series) // 2, period)
            if period < 2:
                raise ValueError("Series too short for decomposition.")
                
        stl = STL(series, period=period, robust=True)
        result = stl.fit()
        
        return {
            "trend": result.trend,
            "seasonal": result.seasonal,
            "resid": result.resid,
            "weights": result.weights
        }
    except Exception as e:
        print(f"STL Decomposition failed: {e}")
        return None
