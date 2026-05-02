import time
from collections import defaultdict
from threading import Lock


class RateLimiter:
    """In-memory per-IP rate limiter with sliding window."""

    def __init__(self, max_requests: int = 5, window_seconds: int = 600):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._requests: dict[str, list[float]] = defaultdict(list)
        self._lock = Lock()

    def is_allowed(self, ip: str) -> bool:
        now = time.time()
        cutoff = now - self.window_seconds

        with self._lock:
            self._requests[ip] = [t for t in self._requests[ip] if t > cutoff]

            if len(self._requests[ip]) >= self.max_requests:
                return False

            self._requests[ip].append(now)
            return True

    def reset(self, ip: str):
        with self._lock:
            self._requests.pop(ip, None)
