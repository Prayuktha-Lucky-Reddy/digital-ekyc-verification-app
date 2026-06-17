from fastapi import APIRouter, UploadFile, File
import cv2  # type: ignore
import numpy as np

from services.face_service import (
    get_embedding,
    compare_embeddings
)

router = APIRouter()

@router.post("/verify-face")
async def verify_face(
    document_image: UploadFile = File(...),
    selfie_image: UploadFile = File(...)
):

    doc_bytes = await document_image.read()
    selfie_bytes = await selfie_image.read()

    doc_array = np.frombuffer(doc_bytes, np.uint8)
    selfie_array = np.frombuffer(selfie_bytes, np.uint8)

    doc_img = cv2.imdecode(doc_array, cv2.IMREAD_COLOR)
    selfie_img = cv2.imdecode(selfie_array, cv2.IMREAD_COLOR)

    emb1 = get_embedding(doc_img)
    emb2 = get_embedding(selfie_img)

    if emb1 is None:
        return {
            "error": "No face detected in document image"
        }

    if emb2 is None:
        return {
            "error": "No face detected in selfie image"
        }

    score = compare_embeddings(emb1, emb2)

    return {
        "score": score
    }