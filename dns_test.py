import socket
try:
    print(socket.gethostbyname("maisoneloria_database"))
except Exception as e:
    print("FAILED maisoneloria_database:", e)

try:
    print(socket.gethostbyname("database"))
except Exception as e:
    print("FAILED database:", e)