class StrategyAgent:
    def generate_strategy(self, pattern_analysis: dict, causality_insights: list):
        """
        Synthesizes patterns and causality into business strategy.
        """
        strategies = []
        
        # Strategy based on trend
        if pattern_analysis.get('trend_direction') == 'increasing':
            strategies.append("Trend is increasing: Consider scaling up inventory and preemptive logistics planning.")
        elif pattern_analysis.get('trend_direction') == 'decreasing':
            strategies.append("Trend is decreasing: Optimize inventory levels to prevent overstock and investigate root causes of demand drop.")
            
        # Strategy based on seasonality
        if pattern_analysis.get('seasonality_strength') == 'strong':
            strategies.append("Strong seasonality detected: Align marketing campaigns heavily with historical peak periods.")
            
        # Strategy based on anomalies
        anomalies = pattern_analysis.get('anomalies', [])
        if len(anomalies) > 3:
            strategies.append("High volatility (multiple anomalies): Increase buffer stock to handle sudden demand shocks.")
            
        # Incorporate causality
        for insight in causality_insights:
            if 'holiday' in insight.lower() and 'spike' in insight.lower():
                strategies.append("Holiday spikes confirmed: Ensure promotional readiness 2 weeks prior to major holidays.")
            
        if not strategies:
            strategies.append("Maintain baseline operations. No severe strategic shifts required currently.")
            
        return strategies
