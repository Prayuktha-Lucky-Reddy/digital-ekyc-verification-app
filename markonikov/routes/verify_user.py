from fastapi import APIRouter, UploadFile, File, Form
import cv2
import numpy as np
from rapidfuzz import fuzz

from services.ocr_service import extract_text
from services.face_service import (
    get_embedding,
    compare_embeddings
)

router = APIRouter()

@router.post("/verify-user")
async def verify_user(
    name: str = Form(...),
    document_image: UploadFile = File(...),
    selfie_image: UploadFile = File(...)
):
    
    # Read document image
    doc_bytes = await document_image.read()
    doc_array = np.frombuffer(doc_bytes, np.uint8)
    doc_img = cv2.imdecode(doc_array, cv2.IMREAD_COLOR)

    # Read selfie image
    selfie_bytes = await selfie_image.read()
    selfie_array = np.frombuffer(selfie_bytes, np.uint8)
    selfie_img = cv2.imdecode(selfie_array, cv2.IMREAD_COLOR)

    # OCR
    text = extract_text(doc_img)

    best_score = 0

    for line in text:

        score = fuzz.token_sort_ratio(
            name.upper(),
            line.upper()
        )

        best_score = max(best_score, score)

    name_match = best_score > 80

    # Face Verification
    emb1 = get_embedding(doc_img)
    emb2 = get_embedding(selfie_img)

    if emb1 is None:
        return {"error": "No face found in document"}

    if emb2 is None:
        return {"error": "No face found in selfie"}

    score = compare_embeddings(emb1, emb2)

    face_verified = score > 0.45

    verified = (
        name_match and
        face_verified
    )

    return {
        "entered_name": name,
        "name_similarity" : best_score,
        "name_match": name_match,
        "face_score": score,
        "face_verified": face_verified,
        "verified": verified
    }