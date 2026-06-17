import easyocr

reader = easyocr.Reader(['en'])

def extract_text(image):

    results = reader.readtext(image)

    text = []

    for result in results:
        text.append(result[1])

    return text