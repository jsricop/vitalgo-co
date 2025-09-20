"""
Login Request Data Transfer Object
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class LoginRequestDto(BaseModel):
    """DTO for login request data"""

    email: EmailStr = Field(
        ...,
        description="User's email address",
        example="usuario@example.com"
    )

    password: str = Field(
        ...,
        min_length=1,
        description="User's password",
        example="MySecurePassword123!"
    )

    remember_me: Optional[bool] = Field(
        default=False,
        description="Whether to extend session duration for 'remember me' functionality",
        example=False
    )

    class Config:
        """Pydantic configuration"""
        json_schema_extra = {
            "example": {
                "email": "paciente@vitalgo.com",
                "password": "MiPassword123!",
                "remember_me": False
            }
        }