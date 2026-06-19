import numpy as np
from insightface.app import FaceAnalysis

_app = None

def get_app():
    global _app
    if _app is None:
        _app = FaceAnalysis()
        _app.prepare(ctx_id=0)
    return _app

def detect_faces(image):
    return get_app().get(image)

def get_embedding(image):
    faces = get_app().get(image)
    if len(faces) == 0:
        return None
    return faces[0].embedding

def compare_embeddings(emb1, emb2):
    similarity = np.dot(emb1, emb2) / (
        np.linalg.norm(emb1) * np.linalg.norm(emb2)
    )
    return float(similarity)
