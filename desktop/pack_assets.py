# -*- coding: utf-8 -*-
"""把网页资源加密打包成 secret_assets.py（编译进 exe，磁盘上不留原始文件）。"""

import base64
import json
import os
import secrets
import zlib

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(os.path.dirname(HERE), "web")
FILES = ("index.html", "style.css", "app.js", "data.js")
OUT = os.path.join(HERE, "secret_assets.py")


def rc4(key, data):
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


def main():
    bundle = {}
    for name in FILES:
        path = os.path.join(ROOT, name)
        with open(path, "rb") as handle:
            bundle[name] = handle.read().decode("utf-8")

    payload = zlib.compress(json.dumps(bundle, ensure_ascii=False).encode("utf-8"), 9)
    key = secrets.token_bytes(32)
    encrypted = base64.b64encode(rc4(key, payload)).decode("ascii")
    key_b64 = base64.b64encode(key).decode("ascii")

    lines = [
        "# -*- coding: utf-8 -*-",
        '"""自动生成：加密的网页资源包。请勿手工修改。"""',
        "",
        'BLOB = "%s"' % encrypted,
        'KEY = "%s"' % key_b64,
        "",
    ]
    with open(OUT, "w", encoding="utf-8") as handle:
        handle.write("\n".join(lines))
    print("written:", OUT, len(encrypted), "bytes")


if __name__ == "__main__":
    main()
