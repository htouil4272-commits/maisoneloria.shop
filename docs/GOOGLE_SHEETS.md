# GOOGLE SHEETS INTEGRATION — Maison Eloria

## Overview

Every order is sent to Google Sheets as a backup/CRM system. This runs async (non-blocking) so it doesn't slow down the checkout flow.

---

## Setup Steps

### 1. Create Google Cloud Service Account
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project: `maisoneloria`
3. Enable **Google Sheets API**
4. Create a **Service Account**:
   - Name: `maisoneloria-sheets`
   - Role: Editor
5. Create a JSON key → Download it
6. Copy the JSON content to `GOOGLE_SHEETS_CREDENTIALS_JSON` env var

### 2. Create the Spreadsheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create new spreadsheet: "Maison Eloria — Commandes"
3. **Share** it with the service account email (found in the JSON key)
4. Copy the spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
   ```
5. Set `GOOGLE_SHEETS_SPREADSHEET_ID` env var

### 3. Set Up Sheet Columns
Name the first sheet "Commandes" with these columns in Row 1:

| Column | Header |
|--------|--------|
| A | Date |
| B | Heure |
| C | N° Commande |
| D | Nom Client |
| E | Téléphone |
| F | Pack |
| G | Couleur(s) |
| H | Quantité |
| I | Total (DH) |
| J | Statut |
| K | Ville (IP) |
| L | Source UTM |
| M | Medium UTM |
| N | Campaign UTM |
| O | fbclid |
| P | ttclid |
| Q | Score Fraude |
| R | IP |
| S | VPN |

---

## Backend Implementation

```python
# backend/app/services/sheets.py

import json
import logging
from datetime import datetime
from typing import Optional

import gspread
from google.oauth2.service_account import Credentials

from app.config import settings

logger = logging.getLogger(__name__)

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]

class SheetsService:
    def __init__(self):
        self.client = None
        self.sheet = None
        self._init_client()
    
    def _init_client(self):
        try:
            creds_json = settings.GOOGLE_SHEETS_CREDENTIALS_JSON
            if not creds_json or creds_json == "{}":
                logger.warning("Google Sheets credentials not configured")
                return
            
            creds_dict = json.loads(creds_json)
            credentials = Credentials.from_service_account_info(
                creds_dict, scopes=SCOPES
            )
            self.client = gspread.authorize(credentials)
            self.sheet = self.client.open_by_key(
                settings.GOOGLE_SHEETS_SPREADSHEET_ID
            ).worksheet("Commandes")
            
            logger.info("Google Sheets connected successfully")
        except Exception as e:
            logger.error(f"Failed to init Google Sheets: {e}")
    
    async def append_order(self, order: dict) -> bool:
        """Append order to Google Sheets. Non-blocking."""
        if not self.sheet:
            logger.warning("Google Sheets not configured — skipping")
            return False
        
        try:
            now = datetime.utcnow()
            
            colors = ", ".join([
                item.get("color_name", item.get("color_id", ""))
                for item in order.get("items", [])
            ])
            
            packs = ", ".join([
                item.get("pack_id", "")
                for item in order.get("items", [])
            ])
            
            total_qty = sum(
                item.get("quantity", 1) * item.get("pieces", 1)
                for item in order.get("items", [])
            )
            
            row = [
                now.strftime("%Y-%m-%d"),           # Date
                now.strftime("%H:%M:%S"),            # Heure
                order.get("order_number", ""),       # N° Commande
                order.get("customer_name", ""),      # Nom Client
                order.get("customer_phone", ""),     # Téléphone
                packs,                               # Pack
                colors,                              # Couleur(s)
                total_qty,                           # Quantité
                order.get("total", 0),               # Total (DH)
                "pending",                           # Statut
                order.get("city", ""),               # Ville (IP)
                order.get("utm_source", ""),         # Source UTM
                order.get("utm_medium", ""),         # Medium UTM
                order.get("utm_campaign", ""),       # Campaign UTM
                order.get("fbclid", ""),             # fbclid
                order.get("ttclid", ""),             # ttclid
                order.get("fraud_score", 0),         # Score Fraude
                order.get("ip_address", ""),         # IP
                str(order.get("is_vpn", False)),     # VPN
            ]
            
            self.sheet.append_row(row, value_input_option="USER_ENTERED")
            logger.info(f"Order {order.get('order_number')} sent to Sheets")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send to Sheets: {e}")
            return False


sheets_service = SheetsService()
```

---

## CSV Template

For manual import/export, use this CSV template:

### File: `orders_template.csv`
```csv
Date,Heure,N° Commande,Nom Client,Téléphone,Pack,Couleur(s),Quantité,Total (DH),Statut,Ville (IP),Source UTM,Medium UTM,Campaign UTM,fbclid,ttclid,Score Fraude,IP,VPN
2026-05-02,16:00:00,ELO-0001,سارة الحسني,0661234567,pack_6,بيج,6,330,pending,Casablanca,facebook,cpc,pack-famille,abc123,,0.1,105.159.xxx.xxx,False
```

### Column Definitions

| Column | Type | Description |
|--------|------|-------------|
| Date | DATE | Order date (YYYY-MM-DD) |
| Heure | TIME | Order time (HH:MM:SS) |
| N° Commande | TEXT | Order number (ELO-XXXX) |
| Nom Client | TEXT | Customer full name |
| Téléphone | TEXT | Phone number (06/07XXXXXXXX) |
| Pack | TEXT | Pack ID(s) ordered |
| Couleur(s) | TEXT | Color name(s) in Arabic |
| Quantité | NUMBER | Total pieces |
| Total (DH) | NUMBER | Order total in MAD |
| Statut | TEXT | pending/confirmed/shipped/delivered/cancelled |
| Ville (IP) | TEXT | City from MaxMind lookup |
| Source UTM | TEXT | utm_source parameter |
| Medium UTM | TEXT | utm_medium parameter |
| Campaign UTM | TEXT | utm_campaign parameter |
| fbclid | TEXT | Facebook click ID |
| ttclid | TEXT | TikTok click ID |
| Score Fraude | NUMBER | Fraud score (0.0-1.0) |
| IP | TEXT | Client IP address |
| VPN | TEXT | VPN detected (True/False) |

---

## Standalone JS for Google Sheets (Alternative)

If you want a pure JS webhook without the Python backend:

```javascript
// google-sheets-webhook.js
// Deploy as Google Apps Script

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Commandes");
  const data = JSON.parse(e.postData.contents);
  
  const colors = data.items.map(i => i.color_name || i.color_id).join(", ");
  const packs = data.items.map(i => i.pack_id).join(", ");
  const totalQty = data.items.reduce((sum, i) => sum + (i.quantity * i.pieces), 0);
  
  sheet.appendRow([
    new Date().toISOString().split('T')[0],
    new Date().toTimeString().split(' ')[0],
    data.order_number || "",
    data.customer_name || "",
    data.customer_phone || "",
    packs,
    colors,
    totalQty,
    data.total || 0,
    "pending",
    data.city || "",
    data.utm_source || "",
    data.utm_medium || "",
    data.utm_campaign || "",
    data.fbclid || "",
    data.ttclid || "",
    data.fraud_score || 0,
    data.ip_address || "",
    String(data.is_vpn || false)
  ]);
  
  return ContentService.createTextOutput(
    JSON.stringify({ success: true })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService.createTextOutput("Maison Eloria Webhook Active");
}
```

### Deploying the Apps Script
1. Go to [script.google.com](https://script.google.com)
2. Create new project: "Maison Eloria Webhook"
3. Paste the code above
4. Click Deploy → New Deployment → Web App
5. Execute as: Me
6. Access: Anyone
7. Copy the webhook URL
8. Use it as `GOOGLE_SHEETS_WEBHOOK_URL` in your backend

---

## Error Handling

- Google Sheets operations are **non-blocking**
- If Sheets fails, the order is still saved to PostgreSQL
- Log all Sheets errors for debugging
- Retry mechanism: 3 attempts with exponential backoff

```python
import asyncio

async def send_to_sheets_with_retry(order: dict, max_retries: int = 3):
    for attempt in range(max_retries):
        try:
            result = await sheets_service.append_order(order)
            if result:
                return True
        except Exception as e:
            logger.warning(f"Sheets attempt {attempt + 1} failed: {e}")
            await asyncio.sleep(2 ** attempt)
    
    logger.error(f"All Sheets attempts failed for order {order.get('order_number')}")
    return False
```
