from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.lead import Lead
from app.schemas.lead import LeadCreateSchema, NewsletterSchema
from app.middleware.rate_limit import RateLimiter

router = APIRouter()

contact_rate_limiter = RateLimiter(max_requests=3, window_seconds=300)


@router.post("/contact")
async def create_contact(
    data: LeadCreateSchema,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    client_ip = request.headers.get("X-Forwarded-For", request.client.host).split(",")[0].strip()

    if not contact_rate_limiter.is_allowed(client_ip):
        raise HTTPException(
            status_code=429,
            detail="لقد تجاوزت الحد المسموح. حاول مرة أخرى لاحقاً",
        )

    lead = Lead(
        name=data.name,
        phone=data.phone,
        message=data.message,
        source="contact",
    )
    db.add(lead)
    await db.commit()

    return {"success": True, "message": "تم إرسال رسالتك بنجاح"}


@router.post("/newsletter")
async def subscribe_newsletter(
    data: NewsletterSchema,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    client_ip = request.headers.get("X-Forwarded-For", request.client.host).split(",")[0].strip()

    if not contact_rate_limiter.is_allowed(client_ip):
        raise HTTPException(
            status_code=429,
            detail="لقد تجاوزت الحد المسموح. حاول مرة أخرى لاحقاً",
        )

    lead = Lead(
        phone=data.phone,
        source="newsletter",
    )
    db.add(lead)
    await db.commit()

    return {"success": True, "message": "تم تسجيلك بنجاح"}
