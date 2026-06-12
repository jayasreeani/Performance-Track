import hashlib
import secrets

def hash_password(password: str) -> str:
    """Hash a password using PBKDF2 HMAC SHA-256 with a random salt."""
    salt = secrets.token_hex(16)
    pwd_bytes = password.encode('utf-8')
    salt_bytes = salt.encode('utf-8')
    dk = hashlib.pbkdf2_hmac('sha256', pwd_bytes, salt_bytes, 100000)
    hash_hex = dk.hex()
    return f"{salt}:{hash_hex}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against the stored salt and hash."""
    try:
        salt, stored_hash = hashed_password.split(':')
        pwd_bytes = plain_password.encode('utf-8')
        salt_bytes = salt.encode('utf-8')
        dk = hashlib.pbkdf2_hmac('sha256', pwd_bytes, salt_bytes, 100000)
        return dk.hex() == stored_hash
    except Exception:
        return False
