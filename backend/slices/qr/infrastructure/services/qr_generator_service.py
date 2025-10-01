"""
QR Code Generation Service
Service for generating QR codes with VitalGo logo embedding
"""
import qrcode
from PIL import Image, ImageDraw
from io import BytesIO
import base64
from uuid import UUID
from typing import Optional
import os
from shared.config.settings import settings


class QRGeneratorService:
    """Service for generating QR codes with logo embedding"""

    def __init__(self):
        self.logo_path = "../frontend/public/assets/images/logos/logos-blue-light-background.png"
        self.logo_size_ratio = 0.2  # Logo will be 20% of QR code size

    def generate_qr_with_logo(self, qr_uuid: UUID) -> str:
        """
        Generate QR code with VitalGo logo embedded in the center

        Args:
            qr_uuid: The UUID for the QR code

        Returns:
            Base64 encoded PNG image of the QR code
        """
        # Create emergency URL
        emergency_url = f"{settings.FRONTEND_URL}/qr/{str(qr_uuid)}"

        # Generate QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,  # High error correction for logo overlay
            box_size=10,
            border=4,
        )
        qr.add_data(emergency_url)
        qr.make(fit=True)

        # Create QR code image
        qr_img = qr.make_image(fill_color="black", back_color="white").convert('RGB')

        # Add logo if it exists
        logo_img = self._load_logo()
        if logo_img:
            qr_img = self._add_logo_to_qr(qr_img, logo_img)

        # Convert to base64
        return self._image_to_base64(qr_img)

    def _load_logo(self) -> Optional[Image.Image]:
        """Load VitalGo logo image"""
        try:
            # Try to load from multiple possible paths
            possible_paths = [
                self.logo_path,
                "frontend/public/assets/images/logos/logos-blue-light-background.png",
                os.path.join(os.path.dirname(__file__), "../../../../../../frontend/public/assets/images/logos/logos-blue-light-background.png")
            ]

            for path in possible_paths:
                if os.path.exists(path):
                    return Image.open(path).convert('RGBA')

            # If no logo found, return None (QR will be generated without logo)
            return None

        except Exception as e:
            print(f"Warning: Could not load logo: {e}")
            return None

    def _add_logo_to_qr(self, qr_img: Image.Image, logo_img: Image.Image) -> Image.Image:
        """Add logo to the center of QR code with white background"""
        qr_width, qr_height = qr_img.size

        # Calculate logo size (20% of QR code)
        logo_size = int(min(qr_width, qr_height) * self.logo_size_ratio)

        # Resize logo
        logo_img = logo_img.resize((logo_size, logo_size), Image.Resampling.LANCZOS)

        # Create white background circle for logo
        background_size = int(logo_size * 1.2)  # 20% larger than logo
        background = Image.new('RGBA', (background_size, background_size), (255, 255, 255, 255))

        # Create circular mask for background
        mask = Image.new('L', (background_size, background_size), 0)
        draw = ImageDraw.Draw(mask)
        draw.ellipse([(0, 0), (background_size, background_size)], fill=255)

        # Apply circular mask to background
        background.putalpha(mask)

        # Calculate positions for centering
        bg_pos = (
            (qr_width - background_size) // 2,
            (qr_height - background_size) // 2
        )

        logo_pos = (
            (qr_width - logo_size) // 2,
            (qr_height - logo_size) // 2
        )

        # Convert QR to RGBA for compositing
        qr_img = qr_img.convert('RGBA')

        # Paste white background first
        qr_img.paste(background, bg_pos, background)

        # Paste logo on top
        qr_img.paste(logo_img, logo_pos, logo_img)

        return qr_img.convert('RGB')

    def _image_to_base64(self, img: Image.Image) -> str:
        """Convert PIL Image to base64 string"""
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        img_bytes = buffer.getvalue()
        return base64.b64encode(img_bytes).decode('utf-8')

    def get_emergency_url(self, qr_uuid: UUID) -> str:
        """Get the emergency URL for a QR code UUID"""
        return f"{settings.FRONTEND_URL}/qr/{str(qr_uuid)}"