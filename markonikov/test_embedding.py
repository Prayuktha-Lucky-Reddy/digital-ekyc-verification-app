import cv2

from services.face_service import get_embedding

image = cv2.imread("uploads/documents/test.jpeg")

embedding = get_embedding(image)

print(type(embedding))
print(embedding.shape)