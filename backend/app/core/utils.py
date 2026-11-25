from uuid import uuid4
from base64 import b64decode
from Cryptodome.Cipher import PKCS1_OAEP
from Cryptodome.Hash import SHA256
from rgt.security import HashUtils, JWTManager, AESECBManager
from .config import settings


jwt_manager = JWTManager(
    key=settings.jwt_key.get_secret_value(),
    exp_min=settings.access_token_expire_min,
    algorithm=settings.jwt_algorithm
)


# aes加密工具
aes_ecb_manager = AESECBManager(settings.aes_ecb_key.get_secret_value())


class StringUtils:
    @staticmethod
    def normalize_str(value: str | None) -> str | None:
        """去除多余空格, 空白也视为None"""
        if value is None:
            return None
        value = value.strip()
        return value or None


class UUIDGenUtils:
    """UUID生成工具"""
    @staticmethod
    def gen_account() -> str:
        return "acct_"+uuid4().hex


class SecurityUtils:
    @staticmethod
    def req_params_decrypt(encrypted: str) -> str:
        try:
            cipher_text = b64decode(encrypted, validate=True)
            cipher = PKCS1_OAEP.new(settings.private_key, hashAlgo=SHA256)
            password_bytes = cipher.decrypt(cipher_text)
            password_str = password_bytes.decode()
        except Exception as e:
            raise e

        return password_str

    @staticmethod
    def password_hash(plain: str) -> str:
        if plain.strip():
            return HashUtils.hash(plain)
        else:
            return ""

    @staticmethod
    def password_verify(plain: str, hashed: str) -> bool:
        try:
            return HashUtils.verify(plain, hashed)
        except Exception as e:
            # fix这里需要处理异常
            return False

    @staticmethod
    def phone_encrypt(plain: str) -> str:
        """手机号加密"""
        if plain.strip():
            return aes_ecb_manager.phone_encrypt(plain)
        else:
            return ""

    @staticmethod
    def phone_decrypt(encrypted: str, mask: bool = False) -> str:
        """手机号解密"""
        if encrypted.strip():
            return aes_ecb_manager.phone_decrypt(encrypted, mask)
        else:
            return ""
