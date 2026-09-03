from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.audit_log import AuditLog


class AuditRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def log_action(
        self,
        user_id: Optional[str],
        user_email: Optional[str],
        action: str,
        resource: str,
        resource_id: Optional[str] = None,
        ip_address: Optional[str] = None,
        meta_data: Optional[dict] = None,
    ) -> AuditLog:
        audit = AuditLog(
            user_id=user_id,
            user_email=user_email,
            action=action,
            resource=resource,
            resource_id=resource_id,
            ip_address=ip_address,
            meta_data=meta_data or {},
        )
        self.db.add(audit)
        await self.db.flush()
        return audit

    async def get_logs(self, limit: int = 100) -> List[AuditLog]:
        stmt = select(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit)
        result = await self.db.execute(stmt)
        return list(result.scalars().all())
