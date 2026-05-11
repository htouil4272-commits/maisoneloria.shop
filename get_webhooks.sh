#!/bin/bash
docker run --rm -v /root/data.sdb:/data.sdb alpine sh -c 'apk add --no-cache sqlite && sqlite3 /data.sdb ".tables"'
