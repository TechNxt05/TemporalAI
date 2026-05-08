import pandas as pd
import numpy as np

class DataAgent:
    def __init__(self, data_path: str):
        self.data_path = data_path

    def load_and_clean(self) -> pd.DataFrame:
        # Load data
        if self.data_path.lower().endswith('.csv'):
            df = pd.read_csv(self.data_path)
        else:
            df = pd.read_excel(self.data_path)
        
        # Standardize column names
        df.columns = [col.lower() for col in df.columns]
        
        # Ensure date is datetime
        df['date'] = pd.to_datetime(df['date'])
        
        # Aggregate by state and date (summing up totals across categories)
        agg_df = df.groupby(['state', 'date'])['total'].sum().reset_index()
        
        # Process each state individually to ensure full date ranges
        state_dfs = []
        for state in agg_df['state'].unique():
            state_df = agg_df[agg_df['state'] == state].copy()
            state_df.set_index('date', inplace=True)
            state_df.sort_index(inplace=True)
            
            # Find frequency (assuming weekly as per typical case studies, but infer if possible)
            # We'll resample to weekly ('W') to ensure uniform gaps
            state_df = state_df.resample('W').sum() # Sum up if there are multiple entries per week
            state_df['state'] = state
            
            # Handle missing values via interpolation
            state_df['total'] = state_df['total'].replace(0, np.nan)
            state_df['total'] = state_df['total'].interpolate(method='time')
            
            # Fill any remaining NaNs (e.g. at the beginning)
            state_df['total'] = state_df['total'].bfill().ffill()
            
            state_dfs.append(state_df.reset_index())
            
        final_df = pd.concat(state_dfs, ignore_index=True)
        return final_df

    def get_state_data(self, df: pd.DataFrame, state: str) -> pd.Series:
        state_df = df[df['state'] == state].copy()
        state_df.set_index('date', inplace=True)
        state_df.sort_index(inplace=True)
        return state_df['total']
