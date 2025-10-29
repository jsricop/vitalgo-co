"""Country application service."""
from typing import List
from slices.countries.domain.country import Country
from slices.countries.infrastructure.database.country_repository import CountryRepository


class CountryService:
    """Service for country business logic."""

    def __init__(self, repository: CountryRepository):
        self.repository = repository

    def get_all_countries(self) -> List[dict]:
        """
        Get all active countries.
        Returns countries ordered by ID (Colombia first, then neighbors, etc.)
        """
        countries = self.repository.get_all_active()
        return [country.to_dict() for country in countries]

    def get_country_by_code(self, code: str) -> dict | None:
        """Get a specific country by its ISO code."""
        country = self.repository.get_by_code(code)
        if not country:
            return None
        return country.to_dict()
