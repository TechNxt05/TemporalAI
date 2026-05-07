import pandas as pd
import numpy as np

class CausalityAgent:
    def analyze_causality(self, df: pd.DataFrame, target_col: str = 'total'):
        """
        Analyzes correlation between features (like holidays, lags) and target.
        Returns natural language insights about causality.
        """
        insights = []
        
        # We need variance to compute correlation
        if len(df) < 2 or df[target_col].std() == 0:
            return ["Not enough variance to determine causality."]
            
        correlations = df.corr()[target_col].drop(target_col)
        
        # Analyze Holiday Impact
        if 'is_holiday' in correlations and not pd.isna(correlations['is_holiday']):
            if correlations['is_holiday'] > 0.3:
                insights.append("Sales typically spike during holidays (strong positive correlation).")
            elif correlations['is_holiday'] < -0.3:
                insights.append("Sales generally drop during holidays (strong negative correlation).")
                
        # Analyze Lag Impact (Autocorrelation)
        if 'lag_1' in correlations and not pd.isna(correlations['lag_1']):
            if correlations['lag_1'] > 0.5:
                insights.append("Recent past performance heavily dictates current sales (strong momentum).")
                
        # Analyze Seasonality (Monthly)
        if 'month' in df.columns:
            monthly_avg = df.groupby('month')[target_col].mean()
            best_month = monthly_avg.idxmax()
            worst_month = monthly_avg.idxmin()
            
            # map month numbers to names
            month_names = {1:'Jan', 2:'Feb', 3:'Mar', 4:'Apr', 5:'May', 6:'Jun', 
                           7:'Jul', 8:'Aug', 9:'Sep', 10:'Oct', 11:'Nov', 12:'Dec'}
                           
            insights.append(f"Historically, {month_names.get(best_month, best_month)} is the strongest month, while {month_names.get(worst_month, worst_month)} is the weakest.")
            
        if not insights:
            insights.append("No strong causal correlations found with external features.")
            
        return insights
