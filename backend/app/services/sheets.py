import asyncio
import json
import logging
from typing import Optional

from app.config import settings

logger = logging.getLogger(__name__)


class GoogleSheetsService:
    def __init__(self):
        self._client = None
        self._sheet = None

    def _get_client(self):
        if self._client:
            return self._client

        if not settings.GOOGLE_SHEETS_CREDENTIALS or not settings.GOOGLE_SHEETS_SPREADSHEET_ID:
            return None

        try:
            import gspread
            from google.oauth2.service_account import Credentials

            scopes = [
                "https://www.googleapis.com/auth/spreadsheets",
                "https://www.googleapis.com/auth/drive",
            ]

            creds_data = json.loads(settings.GOOGLE_SHEETS_CREDENTIALS)
            credentials = Credentials.from_service_account_info(creds_data, scopes=scopes)
            self._client = gspread.authorize(credentials)
            return self._client
        except Exception as e:
            logger.error(f"Failed to initialize Google Sheets client: {e}")
            return None

    def _get_sheet(self):
        if self._sheet:
            return self._sheet

        client = self._get_client()
        if not client:
            return None

        try:
            spreadsheet = client.open_by_key(settings.GOOGLE_SHEETS_SPREADSHEET_ID)
            self._sheet = spreadsheet.sheet1
            return self._sheet
        except Exception as e:
            logger.error(f"Failed to open spreadsheet: {e}")
            return None

    async def append_order(self, order, max_retries: int = 3):
        for attempt in range(max_retries):
            try:
                sheet = self._get_sheet()
                if not sheet:
                    logger.warning("Google Sheets not configured, skipping")
                    return

                row = [
                    order.order_number,
                    order.customer_name,
                    order.customer_phone,
                    str(order.total),
                    order.status,
                    order.city or "",
                    order.country or "",
                    order.created_at.isoformat(),
                    json.dumps(order.items, ensure_ascii=False),
                    order.utm_source or "",
                    order.utm_medium or "",
                    order.utm_campaign or "",
                ]

                await asyncio.to_thread(sheet.append_row, row)
                logger.info(f"Order {order.order_number} appended to Google Sheets")
                return

            except Exception as e:
                logger.error(f"Google Sheets append attempt {attempt + 1} failed: {e}")
                if attempt < max_retries - 1:
                    await asyncio.sleep(2 ** attempt)
                else:
                    self._client = None
                    self._sheet = None
                    raise


sheets_service = GoogleSheetsService()
