import easyocr

_reader = None

def get_reader():
    global _reader
    if _reader is None:
        _reader = easyocr.Reader(['en'])
    return _reader

def extract_text(image):
    results = get_reader().readtext(image)
    return [result[1] for result in results]
