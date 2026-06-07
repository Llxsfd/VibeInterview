import hashlib
import math


def deterministic_embedding(text: str, dimensions: int = 16) -> list[float]:
    vector = [0.0] * dimensions
    for token in text.split():
        digest = hashlib.sha256(token.encode("utf-8")).digest()
        index = digest[0] % dimensions
        vector[index] += (int.from_bytes(digest[1:3], "big") % 1000) / 1000.0
    norm = math.sqrt(sum(value * value for value in vector)) or 1.0
    return [round(value / norm, 6) for value in vector]
