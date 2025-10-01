"""
QR Use Cases
Application use cases for QR code functionality
"""
from .generate_qr_code import GenerateQRCodeUseCase
from .get_emergency_data import GetEmergencyDataUseCase

__all__ = [
    "GenerateQRCodeUseCase",
    "GetEmergencyDataUseCase"
]