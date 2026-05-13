# Simple HTTP server for Mission Control dashboard
# Run this script to serve the dashboard, then open http://localhost:8080

import http.server
import socketserver
import os

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

print(f"Starting Mission Control server...")
print(f"Open your browser to: http://localhost:{PORT}")
print(f"Press Ctrl+C to stop")
print()

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")