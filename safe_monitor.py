#!/usr/bin/env python3
import urllib.request
import urllib.error
import subprocess
import time
import datetime

URLS_TO_CHECK = [
    ("https://maisoneloria.shop/", 200),
    ("https://maisoneloria.shop/api/health", 200)
]

LOG_FILE = "/var/log/maisoneloria_monitor.log"

def log(msg):
    timestamp = datetime.datetime.now().isoformat()
    line = f"[{timestamp}] {msg}\n"
    print(line, end="")
    with open(LOG_FILE, "a") as f:
        f.write(line)

def check_url(url, expected_status):
    req = urllib.request.Request(url, headers={'User-Agent': 'MaisonEloria-SafeMonitor/1.0'})
    try:
        response = urllib.request.urlopen(req, timeout=15)
        status = response.getcode()
        return status == expected_status, status
    except urllib.error.HTTPError as e:
        return e.code == expected_status, e.code
    except Exception as e:
        return False, str(e)

def safe_restart():
    log("Attempting to safely restart Docker Swarm services for Maison Eloria...")
    # Update via Docker Swarm to prevent VIP corruption
    try:
        log("Restarting backend service...")
        subprocess.call(["docker", "service", "update", "--force", "maisoneloria_backend"])
    except Exception as e:
        log(f"Error restarting backend: {e}")

    try:
        log("Restarting frontend service...")
        subprocess.call(["docker", "service", "update", "--force", "maisoneloria_maisoneloria"])
    except Exception as e:
        log(f"Error restarting frontend: {e}")
    
    log("Restart commands issued. Waiting 45s for recovery...")
    time.sleep(45)

def main():
    failed = False
    for url, expected in URLS_TO_CHECK:
        success, status = check_url(url, expected)
        if not success:
            log(f"CRITICAL: {url} returned {status} (Expected {expected})")
            failed = True
        else:
            # log(f"OK: {url} returned {status}")
            pass
            
    if failed:
        log("Initiating auto-recovery protocol via Swarm update...")
        safe_restart()
        # Verify again
        still_failed = False
        for url, expected in URLS_TO_CHECK:
            success, status = check_url(url, expected)
            if not success:
                log(f"RECOVERY FAILED: {url} still returning {status}")
                still_failed = True
        if not still_failed:
            log("RECOVERY SUCCESSFUL: All services restored.")
    
if __name__ == "__main__":
    main()