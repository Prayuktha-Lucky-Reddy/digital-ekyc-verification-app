import cv2

from services.face_service import (
    get_embedding,
    compare_embeddings
)

img1 = cv2.imread("cropped_face.jpg")
img2 = cv2.imread("unnamed2.jpg")

emb1 = get_embedding(img1)
emb2 = get_embedding(img2)

score = compare_embeddings(emb1, emb2)

print(score)