import pandas as pd
from app.utils.decomposition import decompose_time_series
from app.utils.anomaly import detect_anomalies_iqr

class PatternAgent:
    def analyze_patterns(self, series: pd.Series):
        """
        Analyzes a time series to detect trends, seasonality strength, and anomalies.
        """
        analysis = {
            "trend_direction": "flat",
            "seasonality_strength": "weak",
            "anomalies": []
        }
        
        # Trend detection via simple linear fit or first/last comparison
        if len(series) > 1:
            first_half = series.iloc[:len(series)//2].mean()
            second_half = series.iloc[len(series)//2:].mean()
            
            if second_half > first_half * 1.05:
                analysis["trend_direction"] = "increasing"
            elif second_half < first_half * 0.95:
                analysis["trend_direction"] = "decreasing"

        # Decomposition
        decomp = decompose_time_series(series)
        if decomp is not None:
            # Check variance of seasonal component vs residual
            var_seasonal = decomp["seasonal"].var()
            var_resid = decomp["resid"].var()
            if var_seasonal > 2 * var_resid:
                analysis["seasonality_strength"] = "strong"
                
        # Anomaly detection
        # We prefer IQR for robust detection without assuming normality
        anomalies = detect_anomalies_iqr(series)
        anomaly_dates = series[anomalies].index
        
        for date in anomaly_dates:
            val = series.loc[date]
            mean_val = series.mean()
            type_str = "spike" if val > mean_val else "drop"
            analysis["anomalies"].append({
                "date": date.strftime('%Y-%m-%d'),
                "value": float(val),
                "type": type_str
            })
            
        return analysis
