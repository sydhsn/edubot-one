# This file makes the routers directory a Python package
from .admissions import router as admissions_router

__all__ = ["admissions_router"]