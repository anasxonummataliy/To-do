from argon2 import PasswordHasher


ph = PasswordHasher()


def hash_password(password: str):
    return ph.hash(password)


def verify_password(hashed_password: str, password: str):
    return ph.verify(hashed_password, password)
