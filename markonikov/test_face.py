import cv2

from services.face_service import detect_faces

image = cv2.imread("uploads/documents/test.jpeg")

faces = detect_faces(image)

print("Faces detected:", len(faces))

face = faces[0]

bbox = face.bbox.astype(int)

x1, y1, x2, y2 = bbox

cropped_face = image[y1:y2, x1:x2]

cv2.imwrite("cropped_face.jpg", cropped_face)

print("Face saved!")