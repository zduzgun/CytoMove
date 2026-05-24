from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse


ROOT = Path(__file__).resolve().parents[1]
SITE_INDEX = ROOT / "index.html"
DESKTOP_MANIFEST = ROOT / "desktop-manifest.json"
PROTOTYPE = ROOT / "prototype_refactor"
PROTOTYPE_REDIRECT = ROOT / "prototype"
ALLOW_PREFIXES = [
    PROTOTYPE,
    PROTOTYPE_REDIRECT,
    ROOT / "wound healing",
    ROOT / "validation_ref_sets",
    ROOT / "validation_sets",
    ROOT / "assets",
]
ALLOW_FILES = [SITE_INDEX, DESKTOP_MANIFEST]


class PrototypeHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        parsed = urlparse(path)
        request_path = unquote(parsed.path).replace("\\", "/")
        if request_path in ("", "/", "/index.html"):
            target = SITE_INDEX
        elif request_path == "/desktop-manifest.json":
            target = DESKTOP_MANIFEST
        elif request_path.startswith(("/prototype_refactor/", "/prototype/")):
            target = ROOT / request_path.lstrip("/")
        elif request_path.startswith(("/wound healing/", "/validation_ref_sets/", "/validation_sets/", "/assets/")):
            target = ROOT / request_path.lstrip("/")
        else:
            target = PROTOTYPE / request_path.lstrip("/")

        resolved = target.resolve()
        if any(resolved == file.resolve() for file in ALLOW_FILES):
            return str(resolved)
        if any(resolved == base.resolve() or base.resolve() in resolved.parents for base in ALLOW_PREFIXES):
            return str(resolved)
        return str(PROTOTYPE / "__blocked__")

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, format, *args):
        return


def main():
    server = ThreadingHTTPServer(("127.0.0.1", 8768), PrototypeHandler)
    server.serve_forever()


if __name__ == "__main__":
    main()
