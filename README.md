# Digital e-KYC Verification

A full-stack identity verification app — users verify their identity by submitting a government ID and a live selfie, which are checked via OCR and face recognition.

---

## Flow

| Step | Description |
|------|-------------|
| 1 | Enter phone number → receive OTP |
| 2 | Enter full name + select document type |
| 3 | Upload ID document image |
| 4 | Capture live selfie via webcam |
| 5 | View result — Accepted or Rejected |

---

## Project Structure

```
digital-ekyc-verification-app/
│
├── frontend/                   # React app
│   ├── src/
│   │   ├── App.jsx
│   │   └── App.css
│   ├── package.json
│   └── index.html
│
└── markonikov/                 # FastAPI backend
    ├── main.py
    ├── requirements.txt
    ├── routes/
    │   ├── otp.py              # /send-otp, /verify-otp
    │   ├── document.py         # /upload-document, /process-document
    │   ├── face.py             # /verify-face
    │   └── verify.py           # /verify-user  ← main endpoint
    └── services/
        ├── otp_service.py      # OTP generation & validation
        ├── ocr_service.py      # EasyOCR text extraction
        └── face_service.py     # InsightFace embeddings & comparison
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, react-webcam |
| Backend | FastAPI, Uvicorn |
| OCR | EasyOCR |
| Face Recognition | InsightFace |
| Name Matching | RapidFuzz |

---

## Running Locally

**Backend**
```bash
cd markonikov
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

> Make sure the `API` constant in `App.jsx` points to `http://localhost:8000` (or wherever your backend runs).

---

## Verification Logic

Both checks must pass for a user to be marked **Accepted**.

```
Name match   →  rapidfuzz token_sort_ratio  >  80
Face match   →  InsightFace cosine similarity  >  0.45
```

---

## Notes

- OTPs are stored in-memory — they reset on server restart
- No authentication or session management
