from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserRegister(BaseModel):
    username: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserLogin(BaseModel):
    account: str = Field(min_length=2)
    password: str = Field(min_length=1)


class UserRead(BaseModel):
    id: str
    username: str
    email: EmailStr

    model_config = ConfigDict(from_attributes=True)


class UserProfileRead(BaseModel):
    id: str
    user_id: str
    target_role: str
    target_level: str
    preparation_days: int
    current_level: str
    progress: dict
    mastery_summary: dict

    model_config = ConfigDict(from_attributes=True)


class UserProfileUpdate(BaseModel):
    target_role: str | None = Field(default=None, max_length=80)
    target_level: str | None = Field(default=None, max_length=40)
    preparation_days: int | None = Field(default=None, ge=1, le=365)
    current_level: str | None = Field(default=None, max_length=40)
    progress: dict | None = None
    mastery_summary: dict | None = None


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead
    profile: UserProfileRead
