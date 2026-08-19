"""화이트보드 세트 배경을 만든다.

레퍼런스 영상처럼 따뜻한 회색 벽 앞에 놓인 알루미늄 프레임 화이트보드.
장면 애니메이션은 이 보드의 흰 면 안쪽에 합성된다(merge_video.py --stage).

보드 안쪽 흰 면: BOARD_RECT = (168, 74, 1584, 891)
"""

import math
import os
import sys

from PIL import Image, ImageDraw, ImageFilter

W, H = 1920, 1080
BOARD_RECT = (168, 74, 1584, 891)          # x, y, w, h — 16:9, 장면이 합성되는 영역
FRAME = 26                                  # 알루미늄 테두리 두께


def _vgrad(size, top, bottom):
    w, h = size
    g = Image.new("RGB", (1, h))
    px = g.load()
    for y in range(h):
        t = y / max(1, h - 1)
        px[0, y] = tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3))
    return g.resize((w, h), Image.BILINEAR)


def _marker(d, x, y, w, h, cap):
    """트레이에 놓인 보드마커 하나."""
    body = (248, 248, 246)
    d.rounded_rectangle([x, y, x + w, y + h], radius=h // 2, fill=body,
                        outline=(196, 194, 190), width=2)
    d.rounded_rectangle([x + w * 0.62, y, x + w, y + h], radius=h // 2, fill=cap)
    d.rounded_rectangle([x + w * 0.30, y + h * 0.28, x + w * 0.58, y + h * 0.72],
                        radius=3, fill=cap)


def build(path):
    # --- 벽 -------------------------------------------------------------
    img = _vgrad((W, H), (150, 141, 132), (108, 100, 93))
    d = ImageDraw.Draw(img)

    # 벽의 부드러운 조명 얼룩
    glow = Image.new("L", (W, H), 0)
    ImageDraw.Draw(glow).ellipse([W * 0.18, -H * 0.35, W * 0.86, H * 0.75], fill=64)
    img = Image.composite(Image.new("RGB", (W, H), (176, 168, 158)), img,
                          glow.filter(ImageFilter.GaussianBlur(190)))
    d = ImageDraw.Draw(img)

    bx, by, bw, bh = BOARD_RECT
    ox, oy = bx - FRAME, by - FRAME
    ow, oh = bw + FRAME * 2, bh + FRAME * 2

    # --- 보드 그림자 ----------------------------------------------------
    sh = Image.new("L", (W, H), 0)
    ImageDraw.Draw(sh).rounded_rectangle([ox + 10, oy + 18, ox + ow + 16, oy + oh + 26],
                                         radius=18, fill=120)
    img = Image.composite(Image.new("RGB", (W, H), (66, 60, 55)), img,
                          sh.filter(ImageFilter.GaussianBlur(26)))
    d = ImageDraw.Draw(img)

    # --- 알루미늄 프레임 -------------------------------------------------
    d.rounded_rectangle([ox, oy, ox + ow, oy + oh], radius=16, fill=(178, 180, 183))
    d.rounded_rectangle([ox + 3, oy + 3, ox + ow - 3, oy + oh - 3], radius=13,
                        outline=(232, 233, 235), width=3)
    d.rounded_rectangle([ox + 9, oy + 9, ox + ow - 9, oy + oh - 9], radius=9,
                        outline=(140, 142, 146), width=2)

    # 모서리 코너 캡
    for cx, cy in ((ox, oy), (ox + ow, oy), (ox, oy + oh), (ox + ow, oy + oh)):
        d.rounded_rectangle([cx - 30, cy - 30, cx + 30, cy + 30], radius=14,
                            fill=(160, 162, 166))
    d.rounded_rectangle([ox, oy, ox + ow, oy + oh], radius=16, outline=(126, 128, 132), width=2)

    # --- 흰 판면 --------------------------------------------------------
    board = _vgrad((bw, bh), (255, 255, 255), (243, 244, 246))
    img.paste(board, (bx, by))
    d = ImageDraw.Draw(img)
    # 비스듬한 반사 하이라이트
    sheen = Image.new("L", (bw, bh), 0)
    ImageDraw.Draw(sheen).polygon(
        [(0, bh * 0.10), (bw * 0.42, 0), (bw * 0.60, 0), (0, bh * 0.52)], fill=30)
    ImageDraw.Draw(sheen).polygon(
        [(bw * 0.70, 0), (bw * 0.80, 0), (bw * 0.20, bh), (bw * 0.08, bh)], fill=16)
    sheen = sheen.filter(ImageFilter.GaussianBlur(40))
    img.paste(Image.new("RGB", (bw, bh), (255, 255, 255)), (bx, by), sheen)
    d = ImageDraw.Draw(img)
    d.rectangle([bx, by, bx + bw, by + bh], outline=(214, 215, 218), width=2)

    # --- 상단 걸이 고리 --------------------------------------------------
    for hx in (ox + ow * 0.16, ox + ow * 0.84):
        d.line([(hx - 22, oy - 2), (hx, oy - 26), (hx + 22, oy - 2)],
               fill=(120, 120, 124), width=6)
        d.ellipse([hx - 7, oy - 34, hx + 7, oy - 20], outline=(120, 120, 124), width=5)

    # --- 마커 트레이 ----------------------------------------------------
    ty = oy + oh - 6
    d.rounded_rectangle([ox + ow * 0.20, ty, ox + ow * 0.80, ty + 26], radius=8,
                        fill=(196, 198, 201), outline=(150, 152, 156), width=2)
    for i, cap in enumerate(((196, 58, 52), (46, 128, 72), (32, 32, 34))):
        _marker(d, ox + ow * (0.28 + i * 0.15), ty - 12, ow * 0.115, 26, cap)

    # --- 다리 ----------------------------------------------------------
    d.polygon([(ox + ow * 0.30, ty + 24), (ox + ow * 0.34, ty + 24),
               (ox + ow * 0.26, H), (ox + ow * 0.20, H)], fill=(120, 121, 125))
    d.polygon([(ox + ow * 0.66, ty + 24), (ox + ow * 0.70, ty + 24),
               (ox + ow * 0.80, H), (ox + ow * 0.74, H)], fill=(120, 121, 125))

    # --- 벽 비네트 ------------------------------------------------------
    vig = Image.new("L", (W, H), 0)
    ImageDraw.Draw(vig).ellipse([-W * 0.30, -H * 0.42, W * 1.30, H * 1.42], fill=255)
    vig = vig.filter(ImageFilter.GaussianBlur(150)).point(lambda v: 255 - v)
    img = Image.composite(Image.new("RGB", (W, H), (58, 52, 47)), img, vig.point(lambda v: v // 2))

    img.save(path)
    print("보드 배경 저장: %s  (합성 영역 %s)" % (path, BOARD_RECT))


if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "assets/whiteboard/board-stage.png"
    os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
    build(out)
