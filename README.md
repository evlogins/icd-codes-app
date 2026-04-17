# ICD Code Explorer

A simple, user-friendly web application for searching and understanding **ICD (International Classification of Diseases)** diagnosis and procedure codes, with context-aware explanations for different professional use cases.

## Features

- **Search** ICD-10-CM codes by keyword or code number (e.g. "diabetes" or "E11.9")
- **Context-aware** explanations: Billing, Clinical, Research, and Public Health
- **Contextual tips** for each use case (billing specificity rules, research notes, etc.)
- **Copy codes** to clipboard with one click
- **External links** to ICD-10 reference resources
- **Cached results** for fast repeat lookups (1-hour server-side cache)
- **Free API** — uses NLM Clinical Tables (no API key required)
- **Docker support** for easy deployment

## Quick Start

### Prerequisites
- Node.js 18+
- npm

### Run Locally

```bash
# Clone the repo
git clone https://github.com/evlogins/icd-codes-app.git
cd icd-codes-app

# Start the backend (Terminal 1)
cd backend
npm install
npm run dev
# API runs on http://localhost:5000

# Start the frontend (Terminal 2)
cd frontend
npm install
npm start
# App opens at http://localhost:3000
```

### Run with Docker

```bash
docker-compose up --build
# App available at http://localhost:3000
```

## Project Structure

```
icd-codes-app/
├── backend/
│   ├── src/
│   │   ├── controllers/icdController.js   # Search & lookup logic + caching
│   │   ├── routes/icd.js                  # API route definitions
│   │   └── server.js                      # Express server
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── public/index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js/.css             # App header with nav links
│   │   │   ├── ContextSelector.js/.css    # Purpose selector (billing/clinical/etc)
│   │   │   ├── SearchBar.js/.css          # Search input with version picker
│   │   │   ├── ResultsList.js/.css        # List of search results
│   │   │   └── CodeDetail.js/.css         # Detailed code view with context panel
│   │   ├── App.js / App.css               # Main app component
│   │   ├── index.js / index.css           # React entry point + global styles
│   └── package.json
└── docker-compose.yml
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/icd/search?q=diabetes&context=billing` | Search codes by keyword |
| GET | `/api/icd/:code?context=research` | Get details for a specific code |
| GET | `/health` | Health check |

### Context Options
- `clinical` — Patient care and EHR documentation
- `billing` — Insurance claims and reimbursement
- `research` — Scientific studies and cohort definitions
- `public_health` — Disease surveillance and statistics

## Data Source

Uses the free **NLM Clinical Tables ICD-10-CM API** (no API key required):
- https://clinicaltables.nlm.nih.gov/

## Roadmap

- [ ] ICD-11 support via WHO API
- [ ] ICD-10-PCS procedure codes
- [ ] Export search results to CSV/JSON
- [ ] Code hierarchy browser (parent/child relationships)
- [ ] Billing crosswalk (ICD to CPT mapping)
- [ ] Saved code lists / favorites
- [ ] Dark mode

## License

MIT
