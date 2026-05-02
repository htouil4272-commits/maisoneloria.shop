"""Download MaxMind GeoLite2-City database."""
import os
import sys
import tarfile
import io
from pathlib import Path

import httpx


def download_maxmind_db():
    license_key = os.environ.get("MAXMIND_LICENSE_KEY")
    if not license_key:
        print("ERROR: MAXMIND_LICENSE_KEY environment variable not set")
        sys.exit(1)

    output_path = Path(os.environ.get("MAXMIND_DB_PATH", "data/GeoLite2-City.mmdb"))
    output_path.parent.mkdir(parents=True, exist_ok=True)

    url = (
        f"https://download.maxmind.com/app/geoip_download?"
        f"edition_id=GeoLite2-City&license_key={license_key}&suffix=tar.gz"
    )

    print(f"Downloading MaxMind GeoLite2-City database...")

    with httpx.Client(timeout=60) as client:
        response = client.get(url)

        if response.status_code != 200:
            print(f"ERROR: Download failed with status {response.status_code}")
            sys.exit(1)

        tar = tarfile.open(fileobj=io.BytesIO(response.content), mode="r:gz")
        for member in tar.getmembers():
            if member.name.endswith(".mmdb"):
                f = tar.extractfile(member)
                if f:
                    output_path.write_bytes(f.read())
                    print(f"Database saved to {output_path}")
                    return
        tar.close()

    print("ERROR: .mmdb file not found in archive")
    sys.exit(1)


if __name__ == "__main__":
    download_maxmind_db()
