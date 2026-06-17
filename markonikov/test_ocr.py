from services.ocr_service import extract_text

result = extract_text("uploads/documents/test.jpeg")

print(result)