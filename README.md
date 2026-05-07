# TemporalAI – Autonomous Forecasting & Intelligence Platform

A production-grade, end-to-end AI system for time-series forecasting across multiple states using a multi-model agentic approach.

## 🌟 Features
- **Agent-Based Architecture**: 
  - `DataAgent` for data ingestion and cleaning
  - `FeatureAgent` for advanced feature engineering (lags, rolling stats, holidays)
  - `ModelAgent` for training ARIMA, Prophet, XGBoost, and PyTorch LSTM
  - `SelectorAgent` for selecting the best performing model
  - `InsightAgent` for generating natural-language business insights via LLM
- **Full-stack Application**: FastAPI Backend + Next.js App Router Frontend
- **Database Integrated**: Ready for PostgreSQL via SQLAlchemy
- **Modern UI**: TailwindCSS and Recharts

## 🚀 Quickstart

### Backend Setup

1. Navigate to the `backend` directory.
2. Install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   pip install -r requirements.txt
   ```
3. Create a `.env` file in `backend/` (optional for local SQLite):
   ```env
   DATABASE_URL=sqlite:///./temporalai.db
   LLM_API_KEY=your_gemini_or_openai_key
   DATA_PATH=../Forecasting Case- Study.xlsx
   ```
4. Run the API:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   API Docs available at `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧠 Architecture Overview
- The system ingests Excel data and processes missing values.
- Advanced features are dynamically created (t-1, t-7, t-30 lags, 7/30 rolling means, holiday flags, Fourier seasonality).
- 4 models are trained competitively. The best model is evaluated via RMSE and saved in the Database.
- The UI allows one-click training and visualization of 8-week forecasts.
