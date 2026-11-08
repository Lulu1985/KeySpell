# -*- coding: utf-8 -*-
"""KeySpell 桌面版入口。

使用 WebView2（Windows 10/11 自带）渲染本地网页，界面与网页版完全一致。
内置一个仅监听 127.0.0.1 的静态文件服务器，保证 localStorage 统计可以持久保存。
"""

import base64
import ctypes
import json
import os
import socket
import sys
import threading
import urllib.parse
import zlib
from functools import partial
from http.server import BaseHTTPRequestHandler, SimpleHTTPRequestHandler, ThreadingHTTPServer

import webview

APP_TITLE = "KeySpell · 代码打字练习"
PREFERRED_PORT = 51873
PORT_SCAN_COUNT = 20


def bundled_root() -> str:
    """打包成 exe 后返回解压目录，开发时返回脚本所在目录。"""
    if getattr(sys, "frozen", False):
        return getattr(sys, "_MEIPASS", os.path.dirname(os.path.abspath(sys.executable)))
    return os.path.dirname(os.path.abspath(__file__))


def web_root() -> str:
    """定位网页资源目录（仓库中位于 desktop 同级的 web/）。"""
    root = bundled_root()
    parent = os.path.dirname(root)
    candidates = (
        os.path.join(root, "web"),
        root,
        os.path.join(parent, "web"),
        parent,
    )
    for candidate in candidates:
        if os.path.exists(os.path.join(candidate, "index.html")):
            return candidate
    return os.path.join(parent, "web")


class NoCacheHandler(SimpleHTTPRequestHandler):
    """关闭缓存，避免更新网页后仍加载旧文件。"""

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, max-age=0")
        super().end_headers()

    def log_message(self, *args):
        pass


_CONTENT_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".ico": "image/x-icon",
}


class MemoryHandler(BaseHTTPRequestHandler):
    """从内存返回解密后的网页资源，磁盘上不落地。"""

    assets = {}

    def do_GET(self):
        name = urllib.parse.urlparse(self.path).path.lstrip("/") or "index.html"
        body = self.assets.get(name)
        if body is None:
            self.send_response(404)
            self.end_headers()
            return
        data = body.encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", _CONTENT_TYPES.get(os.path.splitext(name)[1].lower(),
                                                           "application/octet-stream"))
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store, max-age=0")
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, *args):
        pass


def rc4(key: bytes, data: bytes) -> bytes:
    box = list(range(256))
    j = 0
    klen = len(key)
    for i in range(256):
        j = (j + box[i] + key[i % klen]) & 0xFF
        box[i], box[j] = box[j], box[i]
    out = bytearray(len(data))
    i = j = 0
    for index, byte in enumerate(data):
        i = (i + 1) & 0xFF
        j = (j + box[i]) & 0xFF
        box[i], box[j] = box[j], box[i]
        out[index] = byte ^ box[(box[i] + box[j]) & 0xFF]
    return bytes(out)


def load_assets():
    """读取编译进 exe 的加密资源；开发模式（无该模块）返回 None。"""
    try:
        import secret_assets
        key = base64.b64decode(secret_assets.KEY)
        payload = zlib.decompress(rc4(key, base64.b64decode(secret_assets.BLOB)))
        return json.loads(payload.decode("utf-8"))
    except Exception:
        return None


def port_available(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        try:
            sock.bind(("127.0.0.1", port))
        except OSError:
            return False
    return True


def pick_port() -> int:
    """优先使用固定端口，保证 localStorage 的源（origin）跨次启动保持一致。"""
    for port in range(PREFERRED_PORT, PREFERRED_PORT + PORT_SCAN_COUNT):
        if port_available(port):
            return port
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]


def start_server(directory: str, port: int, assets=None) -> ThreadingHTTPServer:
    if assets:
        MemoryHandler.assets = assets
        handler = MemoryHandler
    else:
        handler = partial(NoCacheHandler, directory=directory)
    server = ThreadingHTTPServer(("127.0.0.1", port), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server


def show_error(title: str, message: str) -> None:
    try:
        ctypes.windll.user32.MessageBoxW(0, message, title, 0x10)
    except Exception:
        print(message)


class _Rect(ctypes.Structure):
    _fields_ = [("left", ctypes.c_long), ("top", ctypes.c_long),
                ("right", ctypes.c_long), ("bottom", ctypes.c_long)]


def work_area() -> tuple:
    """返回主屏可用工作区（物理像素），用于让窗口适配屏幕。"""
    rect = _Rect()
    try:
        if ctypes.windll.user32.SystemParametersInfoW(0x0030, 0, ctypes.byref(rect), 0):
            width = rect.right - rect.left
            height = rect.bottom - rect.top
            if width > 0 and height > 0:
                return width, height
    except Exception:
        pass
    return 1366, 768


def window_geometry() -> dict:
    work_w, work_h = work_area()
    width = min(1480, max(880, work_w - 40))
    height = min(920, max(640, work_h - 60))
    return {
        "width": width,
        "height": height,
        "x": max(0, (work_w - width) // 2),
        "y": max(0, (work_h - height) // 2),
    }


def main() -> int:
    assets = load_assets()
    directory = web_root()
    if not assets and not os.path.exists(os.path.join(directory, "index.html")):
        show_error(APP_TITLE, "找不到 index.html，程序资源不完整，请重新安装。")
        return 1

    port = pick_port()
    server = start_server(directory, port, assets)
    geometry = window_geometry()

    try:
        webview.create_window(
            APP_TITLE,
            f"http://127.0.0.1:{port}/index.html",
            min_size=(min(900, geometry["width"]), min(620, geometry["height"])),
            background_color="#fdf8f1",
            **geometry
        )
        webview.start()
    except Exception as exc:
        show_error(
            APP_TITLE,
            "程序启动失败，可能是系统缺少 Microsoft Edge WebView2 运行库。\n\n"
            "请下载安装后重试：\n"
            "https://developer.microsoft.com/microsoft-edge/webview2/\n\n"
            f"详细信息：{exc}",
        )
        return 1
    finally:
        server.shutdown()
    return 0


if __name__ == "__main__":
    sys.exit(main())
