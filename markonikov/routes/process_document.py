from fastapi import APIRouter, UploadFile, File
import cv2
import numpy as np

from services.ocr_service import extract_text
from services.face_service import detect_faces

router = APIRouter()

@router.post("/process-document")
async def process_document(file: UploadFile = File(...)):

    contents = await file.read()

    image_array = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    text = extract_text(image)

    faces = detect_faces(image)

    return {
        "text": text,
        "faces_detected": len(faces)
    }