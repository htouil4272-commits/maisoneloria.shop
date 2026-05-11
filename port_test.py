import socket
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.settimeout(5)
try:
    s.connect(("maisoneloria_database", 5432))
    print("SUCCESS: maisoneloria_database:5432 is open")
    s.close()
except Exception as e:
    print("FAILED:", e)