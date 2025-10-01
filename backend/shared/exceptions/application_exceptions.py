"""
Application-level exceptions
Custom exceptions for business logic and application errors
"""


class ApplicationException(Exception):
    """Base application exception"""
    pass


class NotFoundException(ApplicationException):
    """Exception raised when a requested resource is not found"""
    pass


class ValidationException(ApplicationException):
    """Exception raised when validation fails"""
    pass


class AuthorizationException(ApplicationException):
    """Exception raised when user lacks permissions"""
    pass