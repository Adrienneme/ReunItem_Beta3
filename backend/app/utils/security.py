from passlib.context import CryptContext
from app.config import SECRET_KEY, ALGORITHM
from datetime import datetime, timedelta, timezone
import jwt
from jwt.exceptions import InvalidTokenError

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

class Security:
    @staticmethod
    def hash_password(pwd: str) -> str:
        return pwd_context.hash(pwd)

    @staticmethod
    def verify_password(plain_pwd: str, hashed_pwd: str) -> bool:
        return pwd_context.verify(plain_pwd, hashed_pwd)

    @staticmethod
    def create_user_token(data: dict, expires_delta: timedelta | None = None) -> str:
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    @staticmethod
    def verify_user_token(token: str) -> dict:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except InvalidTokenError as e:
            raise InvalidTokenError("Invalid or expired token") from e
