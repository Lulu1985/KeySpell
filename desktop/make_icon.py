# -*- coding: utf-8 -*-
"""生成 KeySpell 应用图标 app.ico（与网页吉祥物 Cici 小猫一致）。"""

import os

from PIL import Image, ImageDraw

SIZE = 1024
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "app.ico")


def rounded_gradient(size, radius, top_color, bottom_color):
    img = Image.new("RGB", (size, size), top_color)
    draw = ImageDraw.Draw(img)
    for y in range(size):
        t = y / (size - 1)
        color = tuple(int(top_color[i] + (bottom_color[i] - top_color[i]) * t) for i in range(3))
        draw.line([(0, y), (size, y)], fill=color)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(img, (0, 0), mask)
    return out


def draw_cat(img):
    d = ImageDraw.Draw(img)
    s = img.size[0]

    def p(v):
        return int(v * s)

    ear_outline = (230, 143, 76, 255)
    fur = (255, 196, 138, 255)
    inner_ear = (255, 194, 207, 255)
    ink = (58, 44, 44, 255)
    pink = (255, 143, 163, 255)
    blush = (255, 154, 174, 140)

    # 耳朵
    for sign in (-1, 1):
        base_x = 0.5 + sign * 0.245
        d.polygon(
            [(p(base_x - 0.105 * sign), p(0.40)), (p(base_x + 0.015 * sign), p(0.17)),
             (p(base_x + 0.115 * sign), p(0.36))],
            fill=fur, outline=ear_outline, width=p(0.018),
        )
        d.polygon(
            [(p(base_x - 0.070 * sign), p(0.385)), (p(base_x + 0.010 * sign), p(0.24)),
             (p(base_x + 0.075 * sign), p(0.355))],
            fill=inner_ear,
        )

    # 脑袋
    d.ellipse([p(0.155), p(0.315), p(0.845), p(0.815)], fill=fur, outline=ear_outline, width=p(0.018))

    # 腮红
    d.ellipse([p(0.205), p(0.600), p(0.305), p(0.670)], fill=blush)
    d.ellipse([p(0.695), p(0.600), p(0.795), p(0.670)], fill=blush)

    # 眼睛（弯弯的笑眼）
    eye_w = p(0.020)
    d.arc([p(0.290), p(0.470), p(0.430), p(0.585)], start=200, end=340, fill=ink, width=eye_w)
    d.arc([p(0.570), p(0.470), p(0.710), p(0.585)], start=200, end=340, fill=ink, width=eye_w)

    # 鼻子
    d.polygon([(p(0.462), p(0.600)), (p(0.538), p(0.600)), (p(0.500), p(0.640))], fill=pink)

    # 嘴巴
    d.line([p(0.500), p(0.640), p(0.500), p(0.675)], fill=ink, width=p(0.012))
    d.arc([p(0.400), p(0.640), p(0.505), p(0.730)], start=0, end=80, fill=ink, width=p(0.012))
    d.arc([p(0.495), p(0.640), p(0.600), p(0.730)], start=100, end=180, fill=ink, width=p(0.012))

    # 胡须
    for sign in (-1, 1):
        for dy in (-0.03, 0.03):
            d.line(
                [p(0.175 + (0.0 if sign < 0 else 0.650)), p(0.640 + dy),
                 p(0.175 + (0.100 if sign < 0 else 0.550)), p(0.625 + dy)],
                fill=(120, 90, 70, 150), width=p(0.008),
            )

    # 耳朵上的小星星
    cx, cy, r = p(0.815), p(0.235), p(0.060)
    star = []
    for i in range(10):
        angle = i * 36 - 90
        radius = r if i % 2 == 0 else r * 0.45
        import math
        star.append((cx + radius * math.cos(math.radians(angle)),
                     cy + radius * math.sin(math.radians(angle))))
    d.polygon(star, fill=(255, 210, 63, 255), outline=(244, 185, 61, 255), width=p(0.008))


def main():
    canvas = rounded_gradient(SIZE, int(SIZE * 0.18), (255, 250, 236), (255, 232, 210))
    draw_cat(canvas)
    canvas.resize((256, 256), Image.LANCZOS).save(OUT, format="ICO",
                                                  sizes=[(16, 16), (24, 24), (32, 32),
                                                         (48, 48), (64, 64), (128, 128), (256, 256)])
    print("saved:", OUT)


if __name__ == "__main__":
    main()
