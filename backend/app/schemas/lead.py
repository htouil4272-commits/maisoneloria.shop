import re

from pydantic import BaseModel, field_validator

MOROCCAN_PHONE_REGEX = re.compile(r"^(06|07)\d{8}$")


class LeadCreateSchema(BaseModel):
    name: str
    phone: str
    message: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 3:
            raise ValueError("الاسم يجب أن يكون 3 أحرف على الأقل")
        return v

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        v = v.strip().replace(" ", "")
        if not MOROCCAN_PHONE_REGEX.match(v):
            raise ValueError("رقم الهاتف غير صالح")
        return v

    @field_validator("message")
    @classmethod
    def validate_message(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 5:
            raise ValueError("الرسالة يجب أن تكون 5 أحرف على الأقل")
        return v


class NewsletterSchema(BaseModel):
    phone: str

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        v = v.strip().replace(" ", "")
        if not MOROCCAN_PHONE_REGEX.match(v):
            raise ValueError("رقم الهاتف غير صالح")
        return v
