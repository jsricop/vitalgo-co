"""
Password Service for secure password hashing and verification
"""
import bcrypt

from shared.config.settings import settings


class PasswordService:
    """Service for password hashing and verification using bcrypt"""

    def __init__(self):
        self.rounds = settings.BCRYPT_ROUNDS

    def hash_password(self, password: str) -> str:
        """
        Hash a password using bcrypt

        Args:
            password: Plain text password

        Returns:
            Hashed password string
        """
        # Convert password to bytes
        password_bytes = password.encode('utf-8')

        # Generate salt and hash password
        salt = bcrypt.gensalt(rounds=self.rounds)
        hashed = bcrypt.hashpw(password_bytes, salt)

        # Return as string
        return hashed.decode('utf-8')

    def verify_password(self, password: str, hashed_password: str) -> bool:
        """
        Verify a password against its hash

        Args:
            password: Plain text password to verify
            hashed_password: Hashed password from database

        Returns:
            True if password matches, False otherwise
        """
        try:
            # Convert to bytes
            password_bytes = password.encode('utf-8')
            hashed_bytes = hashed_password.encode('utf-8')

            # Verify password
            return bcrypt.checkpw(password_bytes, hashed_bytes)

        except Exception:
            # Return False if any error occurs during verification
            return False

    def is_password_strong(self, password: str) -> tuple[bool, list[str]]:
        """
        Check if password meets security requirements

        Args:
            password: Password to check

        Returns:
            Tuple of (is_strong, list_of_missing_requirements)
        """
        missing_requirements = []

        # Check length
        if len(password) < 8:
            missing_requirements.append("Mínimo 8 caracteres")

        # Check for uppercase
        if not any(c.isupper() for c in password):
            missing_requirements.append("Una letra mayúscula")

        # Check for lowercase
        if not any(c.islower() for c in password):
            missing_requirements.append("Una letra minúscula")

        # Check for digit
        if not any(c.isdigit() for c in password):
            missing_requirements.append("Un número")

        # Check for special character
        special_chars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
        if not any(c in special_chars for c in password):
            missing_requirements.append("Un carácter especial")

        is_strong = len(missing_requirements) == 0

        return is_strong, missing_requirements

    def get_password_strength_score(self, password: str) -> int:
        """
        Get password strength score (0-5)

        Args:
            password: Password to score

        Returns:
            Score from 0 (weakest) to 5 (strongest)
        """
        score = 0

        # Length check
        if len(password) >= 8:
            score += 1

        # Uppercase check
        if any(c.isupper() for c in password):
            score += 1

        # Lowercase check
        if any(c.islower() for c in password):
            score += 1

        # Digit check
        if any(c.isdigit() for c in password):
            score += 1

        # Special character check
        special_chars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
        if any(c in special_chars for c in password):
            score += 1

        return score

    def generate_temporary_password(self, length: int = 12) -> str:
        """
        Generate a temporary password for password reset

        Args:
            length: Length of the password (default 12)

        Returns:
            Generated temporary password
        """
        import secrets
        import string

        # Define character sets
        lowercase = string.ascii_lowercase
        uppercase = string.ascii_uppercase
        digits = string.digits
        special = "!@#$%^&*"

        # Ensure at least one character from each set
        password = [
            secrets.choice(lowercase),
            secrets.choice(uppercase),
            secrets.choice(digits),
            secrets.choice(special)
        ]

        # Fill the rest with random characters
        all_chars = lowercase + uppercase + digits + special
        for _ in range(length - 4):
            password.append(secrets.choice(all_chars))

        # Shuffle the password
        secrets.SystemRandom().shuffle(password)

        return ''.join(password)