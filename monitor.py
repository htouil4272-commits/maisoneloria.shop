#!/usr/bin/env python3
import urllib.request
import urllib.error
import json
import subprocess
import time
import datetime
import os

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
    req = urllib.request.Request(url, headers={'User-Agent': 'MaisonEloria-Monitor/1.0'})
    try:
        response = urllib.request.urlopen(req, timeout=15)
        status = response.getcode()
        return status == expected_status, status
    except urllib.error.HTTPError as e:
        return e.code == expected_status, e.code
    except Exception as e:
        return False, str(e)

def restart_containers():
    log("Attempting to restart EasyPanel containers for Maison Eloria...")
    # Restart the backend
    try:
        # Find backend container ID
        out = subprocess.check_output(["docker", "ps", "-q", "-f", "name=maisoneloria_backend"]).decode('utf-8').strip()
        if out:
            for cid in out.split('\n'):
                log(f"Restarting backend container {cid}...")
                subprocess.call(["docker", "restart", cid])
    except Exception as e:
        log(f"Error restarting backend: {e}")

    try:
        # Find frontend container ID
        out = subprocess.check_output(["docker", "ps", "-q", "-f", "name=maisoneloria_maisoneloria"]).decode('utf-8').strip()
        if out:
            for cid in out.split('\n'):
                log(f"Restarting frontend container {cid}...")
                subprocess.call(["docker", "restart", cid])
    except Exception as e:
        log(f"Error restarting frontend: {e}")
    
    log("Restart commands issued. Waiting 30s for recovery...")
    time.sleep(30)

def main():
    failed = False
    for url, expected in URLS_TO_CHECK:
        success, status = check_url(url, expected)
        if not success:
            log(f"CRITICAL: {url} returned {status} (Expected {expected})")
            failed = True
        else:
            log(f"OK: {url} returned {status}")
            
    if failed:
        log("Initiating auto-recovery protocol...")
        restart_containers()
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