from dataclasses import dataclass
from .orm import ORM


@dataclass(slots=True, frozen=True)
class Actor:
    orm: ORM
    account_uuid: str
    data_scopes: list[str] | None

    @property
    def update_kwargs(self) -> dict:
        return {
            "updated_by": self.account_uuid
        }

    @property
    def create_kwargs(self) -> dict:
        return {
            "created_by": self.account_uuid
        } | self.update_kwargs
