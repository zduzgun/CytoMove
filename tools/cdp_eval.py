import base64
import hashlib
import json
import os
import socket
import struct
import sys
import urllib.request
from urllib.parse import urlparse


def ws_recv(sock):
    b1, b2 = sock.recv(2)
    length = b2 & 0x7F
    if length == 126:
        length = struct.unpack(">H", sock.recv(2))[0]
    elif length == 127:
        length = struct.unpack(">Q", sock.recv(8))[0]
    masked = b2 & 0x80
    mask = sock.recv(4) if masked else b""
    data = b""
    while len(data) < length:
        data += sock.recv(length - len(data))
    if masked:
        data = bytes(c ^ mask[i % 4] for i, c in enumerate(data))
    opcode = b1 & 0x0F
    if opcode == 8:
        return None
    return data.decode("utf-8", errors="replace")


def ws_send(sock, text):
    payload = text.encode("utf-8")
    header = bytearray([0x81])
    length = len(payload)
    if length < 126:
        header.append(0x80 | length)
    elif length < 65536:
        header.append(0x80 | 126)
        header.extend(struct.pack(">H", length))
    else:
        header.append(0x80 | 127)
        header.extend(struct.pack(">Q", length))
    mask = os.urandom(4)
    header.extend(mask)
    masked = bytes(b ^ mask[i % 4] for i, b in enumerate(payload))
    sock.sendall(header + masked)


class CDP:
    def __init__(self, ws_url):
        self.ws_url = ws_url
        self.next_id = 1
        self.sock = self._connect()

    def _connect(self):
        parsed = urlparse(self.ws_url)
        sock = socket.create_connection((parsed.hostname, parsed.port), timeout=10)
        key = base64.b64encode(os.urandom(16)).decode("ascii")
        req = (
            f"GET {parsed.path} HTTP/1.1\r\n"
            f"Host: {parsed.hostname}:{parsed.port}\r\n"
            "Upgrade: websocket\r\n"
            "Connection: Upgrade\r\n"
            f"Sec-WebSocket-Key: {key}\r\n"
            "Sec-WebSocket-Version: 13\r\n\r\n"
        )
        sock.sendall(req.encode("ascii"))
        resp = sock.recv(4096)
        if b" 101 " not in resp:
            raise RuntimeError(resp.decode("latin1", errors="replace"))
        return sock

    def call(self, method, params=None):
        msg_id = self.next_id
        self.next_id += 1
        ws_send(self.sock, json.dumps({"id": msg_id, "method": method, "params": params or {}}))
        while True:
            raw = ws_recv(self.sock)
            if raw is None:
                raise RuntimeError("websocket closed")
            msg = json.loads(raw)
            if msg.get("id") == msg_id:
                return msg


def get_page_ws():
    pages = json.load(urllib.request.urlopen("http://127.0.0.1:9222/json", timeout=10))
    pages = [p for p in pages if p.get("type") == "page"]
    if not pages:
        raise RuntimeError("no page targets")
    return pages[0]["webSocketDebuggerUrl"]


def main():
    expr = sys.stdin.read()
    cdp = CDP(get_page_ws())
    cdp.call("Runtime.enable")
    res = cdp.call("Runtime.evaluate", {"expression": expr, "awaitPromise": True, "returnByValue": True})
    print(json.dumps(res, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
