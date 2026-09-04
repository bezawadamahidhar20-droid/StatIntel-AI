"""Vercel serverless entrypoint for the StatIntel AI FastAPI backend.

Vercel detects the `app` FastAPI instance exported here and serves it as a
single Vercel Function (Python runtime, Fluid compute). The backend package
lives under `backend/`, so we add it to sys.path before importing.
"""
import os
import sys

_BACKEND_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "backend")
if _BACKEND_DIR not in sys.path:
    sys.path.insert(0, _BACKEND_DIR)

from app.main import app  # noqa: E402