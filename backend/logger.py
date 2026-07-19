import sys
import uuid
import contextvars
from loguru import logger
from config import settings

correlation_id: contextvars.ContextVar[str] = contextvars.ContextVar(
    "correlation_id", default=""
)

def get_correlation_id() -> str:
    val = correlation_id.get()
    if not val:
        return str(uuid.uuid4())
    return val

def setup_logging():
    logger.remove()
    
    # Configure JSON serialization or just structured stdout
    logger.add(
        sys.stdout,
        format="{time:YYYY-MM-DD HH:mm:ss.SSS} | {level: <8} | {name}:{function}:{line} | [{extra[correlation_id]}] | {message}",
        level=settings.log_level,
        colorize=True,
    )
    
    # Ensure correlation_id is present in extra
    logger.configure(patcher=lambda record: record["extra"].update(correlation_id=get_correlation_id()))

setup_logging()
