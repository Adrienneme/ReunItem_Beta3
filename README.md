# ReunItem_Beta3


Development Guide:
1. after cloning repository do this
  Check and run Frontend
  -cmd: cd client
  -cmd: npm i
  -cmd: npm run dev **check if nagana ang app**

  or 
  Check and run Backend
  -cmd: cd backend
  -cmd: python -m venv .venv
  -cmd: .venv\Scripts\Activate
  -cmd: pip install -r requirements.txt
  -cmd: uvicorn app.main:app --reload **check if nagana ang backned**


  Notes:
  - before merging to main, ignore .env
