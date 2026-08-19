"""화이트보드 마커 낙서 스타일 라인아트 라이브러리.

레퍼런스 영상의 룩을 따른다:
  - 흰 보드면, 굵은 검정 보드마커 선
  - 표정이 있는 만화풍 인물, 빽빽하게 모인 아이콘 낙서
  - 보드 위 영문 레터링(한글 자막은 편집 오버레이)
  - 강조는 빨강/파랑/초록 마커를 아주 드물게
"""

import math
import os
import random

from PIL import Image, ImageDraw, ImageFont

SS = 2  # 슈퍼샘플링 배율

BOARD = (255, 255, 255)
INK = (26, 26, 28)
RED = (198, 54, 48)
BLUE = (40, 88, 166)
GREEN = (44, 124, 70)

_FONTDIR = "/mnt/skills/examples/canvas-design/canvas-fonts/"
FONT_DISPLAY = _FONTDIR + "Boldonse-Regular.ttf"   # 굵은 콘덴스드 — 책 표지/키워드
FONT_LABEL = _FONTDIR + "BigShoulders-Bold.ttf"    # 작은 라벨


def _lerp(a, b, t):
    return a + (b - a) * t


def _resample(pts, step):
    if len(pts) < 2:
        return list(pts)
    out = [pts[0]]
    carry = 0.0
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        seg = math.hypot(x1 - x0, y1 - y0)
        if seg < 1e-9:
            continue
        t = carry
        while t + step <= seg:
            t += step
            u = t / seg
            out.append((_lerp(x0, x1, u), _lerp(y0, y1, u)))
        carry = t - seg
    out.append(pts[-1])
    return out


def _smooth_noise(rng, n, amp):
    raw = [0.0]
    for _ in range(n - 1):
        raw.append(raw[-1] + rng.uniform(-1.0, 1.0))
    span = max((abs(v) for v in raw), default=1.0) or 1.0
    raw = [v / span for v in raw]
    k = max(2, n // 12)
    return [sum(raw[max(0, i - k):min(n, i + k + 1)])
            / (min(n, i + k + 1) - max(0, i - k)) * amp for i in range(n)]


class Sketch:
    """굵은 마커로 그린 듯한 획을 쌓는 캔버스."""

    def __init__(self, width, height, seed=7):
        self.w, self.h = width, height
        self.img = Image.new("RGB", (width * SS, height * SS), BOARD)
        self.d = ImageDraw.Draw(self.img)
        self.rng = random.Random(seed)

    # --- 획 --------------------------------------------------------------
    def stroke(self, pts, color=INK, width=7, amp=1.4, closed=False):
        pts = [tuple(p) for p in pts]
        if closed and pts[0] != pts[-1]:
            pts = pts + [pts[0]]
        pts = _resample(pts, 5.0)
        if len(pts) < 2:
            return
        nx = _smooth_noise(self.rng, len(pts), amp)
        ny = _smooth_noise(self.rng, len(pts), amp)
        wob = [(x + nx[i], y + ny[i]) for i, (x, y) in enumerate(pts)]
        if closed:
            wob[-1] = wob[0]
        self.d.line([(x * SS, y * SS) for x, y in wob],
                    fill=color, width=int(width * SS), joint="curve")
        r = width * SS / 2.0
        for x, y in (wob[0], wob[-1]):
            self.d.ellipse([x * SS - r, y * SS - r, x * SS + r, y * SS + r], fill=color)

    def line(self, p, q, **kw):
        self.stroke([p, q], **kw)

    def ellipse(self, cx, cy, rx, ry=None, a0=0, a1=360, **kw):
        ry = rx if ry is None else ry
        n = max(16, int(abs(a1 - a0) / 5))
        pts = [(cx + rx * math.cos(math.radians(_lerp(a0, a1, i / n))),
                cy + ry * math.sin(math.radians(_lerp(a0, a1, i / n)))) for i in range(n + 1)]
        closed = abs(a1 - a0) >= 359
        if closed:
            pts = pts[:-1]
        self.stroke(pts, closed=closed, **kw)

    def rect(self, x, y, w, h, r=0, **kw):
        if r <= 0:
            self.stroke([(x, y), (x + w, y), (x + w, y + h), (x, y + h)], closed=True, **kw)
            return
        pts = []
        for cx, cy, a0, a1 in ((x + w - r, y + r, -90, 0), (x + w - r, y + h - r, 0, 90),
                               (x + r, y + h - r, 90, 180), (x + r, y + r, 180, 270)):
            n = 8
            pts += [(cx + r * math.cos(math.radians(_lerp(a0, a1, i / n))),
                     cy + r * math.sin(math.radians(_lerp(a0, a1, i / n)))) for i in range(n + 1)]
        self.stroke(pts, closed=True, **kw)

    def bezier(self, p0, p1, p2, p3, n=44, **kw):
        pts = []
        for i in range(n + 1):
            t = i / n
            m = 1 - t
            pts.append((m ** 3 * p0[0] + 3 * m * m * t * p1[0] + 3 * m * t * t * p2[0] + t ** 3 * p3[0],
                        m ** 3 * p0[1] + 3 * m * m * t * p1[1] + 3 * m * t * t * p2[1] + t ** 3 * p3[1]))
        self.stroke(pts, **kw)

    def dot(self, cx, cy, r=7, color=INK):
        self.d.ellipse([(cx - r) * SS, (cy - r) * SS, (cx + r) * SS, (cy + r) * SS], fill=color)

    def blob(self, pts, color=INK):
        self.d.polygon([(x * SS, y * SS) for x, y in pts], fill=color)

    # --- 레터링 ----------------------------------------------------------
    def text(self, s, cx, cy, size=64, font=FONT_DISPLAY, color=INK, anchor="mm", spacing=6):
        f = ImageFont.truetype(font, int(size * SS))
        self.d.text((cx * SS, cy * SS), s, font=f, fill=color, anchor=anchor,
                    align="center", spacing=int(spacing * SS))

    def text_size(self, s, size=64, font=FONT_DISPLAY):
        f = ImageFont.truetype(font, int(size * SS))
        box = self.d.textbbox((0, 0), s, font=f, align="center")
        return (box[2] - box[0]) / SS, (box[3] - box[1]) / SS

    def save(self, path):
        self.img.resize((self.w, self.h), Image.LANCZOS).save(path)


# --- 표정과 인물 ---------------------------------------------------------

def face(sk, cx, cy, r=54, mood="worried", color=INK):
    """눈·눈썹·입으로 감정을 준다."""
    ex, ey = r * 0.36, cy - r * 0.14
    for s in (-1, 1):
        sk.ellipse(cx + s * ex, ey, r * 0.15, r * 0.19, width=4, color=color)
        sk.dot(cx + s * ex + (r * 0.03 if mood != "meh" else -r * 0.05), ey + r * 0.03,
               r * 0.075, color)
    if mood == "worried":
        for s in (-1, 1):
            sk.stroke([(cx + s * ex - r * 0.22, ey - r * 0.44),
                       (cx + s * ex + r * 0.20, ey - r * 0.30)], width=5, color=color, amp=0.4)
        sk.bezier((cx - r * 0.34, cy + r * 0.52), (cx - r * 0.12, cy + r * 0.30),
                  (cx + r * 0.12, cy + r * 0.30), (cx + r * 0.34, cy + r * 0.52),
                  width=5, color=color)
    elif mood == "meh":
        for s in (-1, 1):
            sk.stroke([(cx + s * ex - r * 0.22, ey - r * 0.36),
                       (cx + s * ex + r * 0.22, ey - r * 0.36)], width=5, color=color, amp=0.4)
        sk.line((cx - r * 0.28, cy + r * 0.44), (cx + r * 0.28, cy + r * 0.40),
                width=5, color=color, amp=0.5)
    elif mood == "happy":
        sk.bezier((cx - r * 0.36, cy + r * 0.30), (cx - r * 0.14, cy + r * 0.62),
                  (cx + r * 0.14, cy + r * 0.62), (cx + r * 0.36, cy + r * 0.30),
                  width=5, color=color)
    else:  # calm
        sk.line((cx - r * 0.26, cy + r * 0.44), (cx + r * 0.26, cy + r * 0.44),
                width=5, color=color, amp=0.5)


def businessman(sk, cx, top, s=1.0, mood="worried", pose="scratch", color=INK):
    """와이셔츠·넥타이 차림의 만화풍 대표."""
    r = 60 * s
    hcx, hcy = cx, top + r
    sk.ellipse(hcx, hcy, r, r * 1.06, width=7, color=color)
    face(sk, hcx, hcy, r, mood, color)
    # 머리카락 몇 가닥
    for dx, dy in ((-0.5, -0.86), (-0.2, -1.0), (0.15, -1.0)):
        sk.stroke([(hcx + dx * r, hcy + dy * r),
                   (hcx + dx * r + 12 * s, hcy + dy * r - 22 * s)], width=5, color=color, amp=0.4)

    neck = hcy + r * 1.06
    sh = neck + 30 * s          # 어깨
    hip = sh + 150 * s
    # 셔츠 몸통
    sk.stroke([(cx - 62 * s, hip), (cx - 58 * s, sh + 6 * s), (cx - 20 * s, neck + 4 * s)],
              width=7, color=color)
    sk.stroke([(cx + 62 * s, hip), (cx + 58 * s, sh + 6 * s), (cx + 20 * s, neck + 4 * s)],
              width=7, color=color)
    sk.line((cx - 62 * s, hip), (cx + 62 * s, hip), width=7, color=color)
    # 카라와 넥타이
    sk.stroke([(cx - 20 * s, neck + 4 * s), (cx, neck + 36 * s), (cx + 20 * s, neck + 4 * s)],
              width=6, color=color)
    sk.stroke([(cx - 12 * s, neck + 30 * s), (cx, neck + 46 * s), (cx + 12 * s, neck + 30 * s)],
              width=5, color=color)
    sk.stroke([(cx - 12 * s, neck + 44 * s), (cx - 15 * s, hip - 24 * s),
               (cx, hip - 6 * s), (cx + 15 * s, hip - 24 * s), (cx + 12 * s, neck + 44 * s)],
              closed=True, width=5, color=color)
    # 팔
    if pose == "scratch":
        sk.stroke([(cx + 58 * s, sh + 16 * s), (cx + 96 * s, sh - 40 * s),
                   (cx + 52 * s, hcy - r * 0.62)], width=7, color=color)
        sk.stroke([(cx + 52 * s, hcy - r * 0.62), (cx + 30 * s, hcy - r * 0.92)],
                  width=6, color=color, amp=0.5)
        sk.stroke([(cx - 58 * s, sh + 16 * s), (cx - 78 * s, hip - 6 * s)], width=7, color=color)
    elif pose == "shrug":
        for d in (-1, 1):
            sk.stroke([(cx + d * 58 * s, sh + 12 * s), (cx + d * 104 * s, sh + 30 * s),
                       (cx + d * 112 * s, sh - 26 * s)], width=7, color=color)
    elif pose == "point":
        sk.stroke([(cx + 58 * s, sh + 16 * s), (cx + 116 * s, sh + 44 * s)], width=7, color=color)
        sk.stroke([(cx + 116 * s, sh + 44 * s), (cx + 152 * s, sh + 40 * s)],
                  width=6, color=color, amp=0.5)
        sk.stroke([(cx - 58 * s, sh + 16 * s), (cx - 78 * s, hip - 6 * s)], width=7, color=color)
    elif pose == "up":
        for d in (-1, 1):
            sk.stroke([(cx + d * 58 * s, sh + 12 * s), (cx + d * 92 * s, sh - 70 * s)],
                      width=7, color=color)
    else:
        for d in (-1, 1):
            sk.stroke([(cx + d * 58 * s, sh + 12 * s), (cx + d * 80 * s, hip - 4 * s)],
                      width=7, color=color)
    # 다리
    sk.stroke([(cx - 34 * s, hip), (cx - 40 * s, hip + 112 * s)], width=7, color=color)
    sk.stroke([(cx + 34 * s, hip), (cx + 40 * s, hip + 112 * s)], width=7, color=color)
    sk.line((cx - 58 * s, hip + 112 * s), (cx - 34 * s, hip + 112 * s), width=6, color=color)
    sk.line((cx + 34 * s, hip + 112 * s), (cx + 58 * s, hip + 112 * s), width=6, color=color)


def crowd(sk, xs, top, s=0.72, moods=None, color=INK):
    moods = moods or ["calm"] * len(xs)
    for x, m in zip(xs, moods):
        businessman(sk, x, top, s, mood=m, pose="down", color=color)


# --- 낙서 아이콘 ---------------------------------------------------------

def buzz(sk, cx, cy, r=40, n=3, side=1, color=INK):
    """물체 옆의 진동선."""
    for i in range(n):
        rr = r + i * 16
        sk.ellipse(cx, cy, rr, rr, a0=-40 * side + (90 if side < 0 else 0),
                   a1=40 * side + (90 if side < 0 else 0), width=4, color=color, amp=0.6)


def phone_social(sk, cx, cy, w=150, color=INK):
    h = w * 1.82
    sk.rect(cx - w / 2, cy - h / 2, w, h, r=18, width=7, color=color)
    sk.line((cx - w * 0.16, cy - h / 2 + 22), (cx + w * 0.16, cy - h / 2 + 22),
            width=5, color=color, amp=0.4)
    sk.ellipse(cx, cy + h / 2 - 24, 12, width=5, color=color)
    # 앱 아이콘 그리드
    gw, gh = w * 0.66, h * 0.46
    x0, y0 = cx - gw / 2, cy - gh / 2 - h * 0.04
    for i in range(2):
        for j in range(2):
            sk.rect(x0 + i * gw * 0.54, y0 + j * gh * 0.54, gw * 0.46, gh * 0.46,
                    r=6, width=5, color=color)
    sk.line((x0 + gw * 0.14, y0 + gh * 0.10), (x0 + gw * 0.14, y0 + gh * 0.36),
            width=5, color=color, amp=0.4)
    sk.stroke([(x0 + gw * 0.62, y0 + gh * 0.34), (x0 + gw * 0.70, y0 + gh * 0.10),
               (x0 + gw * 0.80, y0 + gh * 0.32)], width=4, color=color, amp=0.4)
    sk.ellipse(x0 + gw * 0.22, y0 + gh * 0.76, gw * 0.09, width=5, color=color)
    sk.blob([(x0 + gw * 0.66, y0 + gh * 0.62), (x0 + gw * 0.86, y0 + gh * 0.76),
             (x0 + gw * 0.66, y0 + gh * 0.90)], color)


def play_phone(sk, cx, cy, w=140, color=INK, accent=RED):
    h = w * 1.82
    sk.rect(cx - w / 2, cy - h / 2, w, h, r=18, width=7, color=color)
    sk.line((cx - w * 0.16, cy - h / 2 + 22), (cx + w * 0.16, cy - h / 2 + 22),
            width=5, color=color, amp=0.4)
    sk.ellipse(cx, cy + h / 2 - 24, 12, width=5, color=color)
    sk.stroke([(cx - w * 0.16, cy - w * 0.24), (cx + w * 0.24, cy), (cx - w * 0.16, cy + w * 0.24)],
              closed=True, width=6, color=accent)


def envelope(sk, cx, cy, w=120, color=INK):
    h = w * 0.68
    sk.rect(cx - w / 2, cy - h / 2, w, h, width=7, color=color)
    sk.stroke([(cx - w / 2, cy - h / 2), (cx, cy + h * 0.16), (cx + w / 2, cy - h / 2)],
              width=6, color=color)


def at_sign(sk, cx, cy, r=46, color=INK):
    sk.ellipse(cx, cy, r * 0.42, width=6, color=color)
    sk.ellipse(cx, cy, r, a0=-30, a1=290, width=6, color=color)
    sk.stroke([(cx + r * 0.42, cy - r * 0.30), (cx + r * 0.42, cy + r * 0.30),
               (cx + r * 0.88, cy + r * 0.24)], width=6, color=color)


def bubble_dots(sk, cx, cy, w=140, color=INK, tail="down"):
    h = w * 0.72
    sk.ellipse(cx, cy, w / 2, h / 2, width=7, color=color)
    for d in (-1, 0, 1):
        sk.dot(cx + d * w * 0.20, cy, 8, color)
    if tail == "down":
        sk.stroke([(cx - w * 0.22, cy + h * 0.42), (cx - w * 0.30, cy + h * 0.78),
                   (cx - w * 0.02, cy + h * 0.46)], width=6, color=color)


def thumb_bubble(sk, cx, cy, r=58, color=INK):
    sk.ellipse(cx, cy, r, width=7, color=color)
    sk.stroke([(cx - r * 0.34, cy + r * 0.42), (cx - r * 0.34, cy - r * 0.06),
               (cx - r * 0.10, cy - r * 0.10)], width=6, color=color)
    sk.stroke([(cx - r * 0.10, cy - r * 0.10), (cx - r * 0.04, cy - r * 0.52),
               (cx + r * 0.18, cy - r * 0.44), (cx + r * 0.10, cy - r * 0.08)],
              width=6, color=color)
    sk.rect(cx - r * 0.06, cy - r * 0.10, r * 0.52, r * 0.52, r=8, width=6, color=color)
    sk.stroke([(cx - r * 0.30, cy + r * 0.46), (cx - r * 0.26, cy + r * 0.74),
               (cx + r * 0.24, cy + r * 0.70)], width=5, color=color, amp=0.5)


def thought_cloud(sk, cx, cy, w=250, color=INK, tail="left", bumps=6):
    """뭉게뭉게한 생각 구름 — 바깥 윤곽만 한 획으로."""
    h = w * 0.64
    n = bumps * 14
    pts = []
    for i in range(n):
        a = 2 * math.pi * i / n
        rr = 1.0 + 0.15 * math.sin(a * bumps) ** 3
        pts.append((cx + math.cos(a) * w / 2 * rr, cy + math.sin(a) * h / 2 * rr))
    sk.stroke(pts, closed=True, color=color, width=7, amp=1.0)
    if tail:
        d = -1 if tail == "left" else 1
        sk.ellipse(cx + d * w * 0.40, cy + h * 0.66, 17, width=6, color=color)
        sk.ellipse(cx + d * w * 0.52, cy + h * 0.92, 10, width=5, color=color)


def growth_arrow(sk, x0, y0, x1, y1, color=INK, width=7, zig=3, head=34):
    """꺾이며 올라가는 성장 화살표."""
    pts = [(x0, y0)]
    for i in range(1, zig * 2 + 1):
        t = i / (zig * 2)
        x = _lerp(x0, x1, t)
        y = _lerp(y0, y1, t) + (26 if i % 2 else -10)
        pts.append((x, y))
    pts.append((x1, y1))
    sk.stroke(pts, color=color, width=width)
    ang = math.atan2(y1 - pts[-2][1], x1 - pts[-2][0])
    for s in (+1, -1):
        a = ang + math.pi + s * math.radians(28)
        sk.line((x1, y1), (x1 + head * math.cos(a), y1 + head * math.sin(a)),
                color=color, width=width, amp=0.4)


def arrow(sk, p, q, head=32, color=INK, width=7, curve=0.0):
    (x0, y0), (x1, y1) = p, q
    if curve:
        mx, my = (x0 + x1) / 2, (y0 + y1) / 2
        dx, dy = x1 - x0, y1 - y0
        n = math.hypot(dx, dy) or 1
        cx, cy = mx - dy / n * curve, my + dx / n * curve
        sk.bezier(p, (cx, cy), (cx, cy), q, color=color, width=width)
        ang = math.atan2(y1 - cy, x1 - cx)
    else:
        sk.line(p, q, color=color, width=width)
        ang = math.atan2(y1 - y0, x1 - x0)
    for s in (+1, -1):
        a = ang + math.pi + s * math.radians(27)
        sk.line(q, (x1 + head * math.cos(a), y1 + head * math.sin(a)),
                color=color, width=width, amp=0.4)


def bar_chart(sk, x, base, w=210, h=150, color=INK, rising=True):
    n = 4
    bw = w / (n * 1.6)
    for i in range(n):
        bh = h * (0.32 + 0.22 * i)
        bx = x + i * bw * 1.6
        sk.rect(bx, base - bh, bw, bh, width=6, color=color)
    if rising:
        arrow(sk, (x - 6, base + 14), (x + w + 18, base + 14), color=color, width=6, head=22)
        sk.line((x - 6, base + 14), (x - 6, base - h * 1.05), color=color, width=6)


def dollar(sk, cx, cy, s=54, color=INK):
    sk.bezier((cx + s * 0.42, cy - s * 0.44), (cx - s * 0.44, cy - s * 0.78),
              (cx - s * 0.44, cy - s * 0.02), (cx, cy))
    sk.bezier((cx, cy), (cx + s * 0.46, cy + s * 0.04), (cx + s * 0.44, cy + s * 0.82),
              (cx - s * 0.40, cy + s * 0.46), width=7, color=color)
    sk.line((cx, cy - s * 0.86), (cx, cy + s * 0.86), width=6, color=color)


def lightbulb(sk, cx, cy, r=60, color=INK, rays=True, accent=None):
    sk.ellipse(cx, cy, r, r * 1.06, width=7, color=color)
    sk.stroke([(cx - r * 0.40, cy + r * 0.86), (cx - r * 0.40, cy + r * 1.20),
               (cx + r * 0.40, cy + r * 1.20), (cx + r * 0.40, cy + r * 0.86)],
              width=6, color=color)
    for i in range(2):
        sk.line((cx - r * 0.40, cy + r * (0.96 + i * 0.14)),
                (cx + r * 0.40, cy + r * (0.96 + i * 0.14)), width=5, color=color, amp=0.4)
    sk.stroke([(cx - r * 0.26, cy + r * 0.80), (cx - r * 0.26, cy + r * 0.20),
               (cx - r * 0.10, cy - r * 0.24), (cx + r * 0.10, cy + r * 0.16),
               (cx + r * 0.26, cy - r * 0.24), (cx + r * 0.26, cy + r * 0.80)],
              width=5, color=color)
    if rays:
        for a in (-150, -118, -90, -62, -30):
            ar = math.radians(a)
            sk.line((cx + math.cos(ar) * r * 1.26, cy + math.sin(ar) * r * 1.26),
                    (cx + math.cos(ar) * r * 1.66, cy + math.sin(ar) * r * 1.66),
                    color=accent or color, width=5, amp=0.4)


def ear(sk, cx, cy, r=46, color=INK):
    sk.bezier((cx + r * 0.30, cy - r * 0.86), (cx - r * 0.80, cy - r * 0.90),
              (cx - r * 0.72, cy + r * 0.52), (cx - r * 0.10, cy + r * 0.94), width=7, color=color)
    sk.bezier((cx + r * 0.10, cy - r * 0.44), (cx - r * 0.42, cy - r * 0.42),
              (cx - r * 0.36, cy + r * 0.22), (cx - r * 0.04, cy + r * 0.30), width=6, color=color)


def question_mark(sk, cx, cy, size=140, color=INK, width=9):
    s = size / 140.0
    sk.bezier((cx - 38 * s, cy - 40 * s), (cx - 34 * s, cy - 86 * s),
              (cx + 42 * s, cy - 84 * s), (cx + 34 * s, cy - 32 * s), width=width, color=color)
    sk.bezier((cx + 34 * s, cy - 32 * s), (cx + 28 * s, cy - 4 * s),
              (cx - 2 * s, cy + 4 * s), (cx, cy + 30 * s), width=width, color=color)
    sk.dot(cx, cy + 62 * s, 9 * s, color)


def book(sk, cx, cy, w=280, color=INK, title=None, tsize=48):
    """책 — 표지에 영문 레터링을 넣을 수 있다."""
    h = w * 1.16
    d = w * 0.13
    sk.rect(cx - w / 2, cy - h / 2, w, h, width=7, color=color)
    sk.stroke([(cx - w / 2, cy + h / 2), (cx - w / 2 + d, cy + h / 2 + d),
               (cx + w / 2 + d, cy + h / 2 + d), (cx + w / 2, cy + h / 2)],
              width=6, color=color)
    sk.stroke([(cx + w / 2, cy - h / 2), (cx + w / 2 + d, cy - h / 2 + d),
               (cx + w / 2 + d, cy + h / 2 + d)], width=6, color=color)
    for i in range(3):
        sk.line((cx + w / 2 + 6, cy - h * 0.34 + i * h * 0.30),
                (cx + w / 2 + d - 4, cy - h * 0.34 + i * h * 0.30 + d * 0.7),
                width=4, color=color, amp=0.4)
    if title:
        sk.text(title, cx, cy, tsize, color=color, spacing=tsize * 0.22)


def open_book(sk, cx, cy, w=340, color=INK, lines=4, accent=None):
    h = w * 0.56
    sk.bezier((cx - w / 2, cy - h / 2), (cx - w / 4, cy - h / 2 - 22),
              (cx - w / 8, cy - h / 2 + 8), (cx, cy - h / 2 + 14), width=7, color=color)
    sk.bezier((cx, cy - h / 2 + 14), (cx + w / 8, cy - h / 2 + 8),
              (cx + w / 4, cy - h / 2 - 22), (cx + w / 2, cy - h / 2), width=7, color=color)
    sk.line((cx - w / 2, cy - h / 2), (cx - w / 2 + 20, cy + h / 2), width=7, color=color)
    sk.line((cx + w / 2, cy - h / 2), (cx + w / 2 - 20, cy + h / 2), width=7, color=color)
    sk.bezier((cx - w / 2 + 20, cy + h / 2), (cx - w / 4, cy + h / 2 + 18),
              (cx + w / 4, cy + h / 2 + 18), (cx + w / 2 - 20, cy + h / 2), width=7, color=color)
    sk.line((cx, cy - h / 2 + 14), (cx, cy + h / 2 + 8), width=6, color=color)
    for i in range(lines):
        y = cy - h * 0.22 + i * h * 0.20
        c = accent if (accent and i == 1) else color
        sk.line((cx - w / 2 + 48, y), (cx - 26, y), color=c, width=5, amp=0.5)
        sk.line((cx + 26, y), (cx + w / 2 - 48, y), color=color, width=5, amp=0.5)


def golden_circle(sk, cx, cy, r=280, color=INK, labels=True, accent=RED):
    sk.ellipse(cx, cy, r, width=8, color=color)
    sk.ellipse(cx, cy, r * 0.66, width=8, color=color)
    sk.ellipse(cx, cy, r * 0.33, width=8, color=accent)
    if labels:
        sk.text("WHAT", cx, cy - r * 0.83, r * 0.15, color=color)
        sk.text("HOW", cx, cy - r * 0.50, r * 0.15, color=color)
        sk.text("WHY", cx, cy, r * 0.16, color=accent)


def target(sk, cx, cy, r=84, color=INK, accent=RED):
    sk.ellipse(cx, cy, r, width=7, color=color)
    sk.ellipse(cx, cy, r * 0.62, width=6, color=color)
    sk.ellipse(cx, cy, r * 0.26, width=7, color=accent)


def gear(sk, cx, cy, r=62, teeth=10, color=INK):
    pts = []
    for i in range(teeth * 2):
        a = math.radians(360 * i / (teeth * 2))
        rr = r if i % 2 == 0 else r * 0.80
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    sk.stroke(pts, closed=True, color=color, width=7, amp=0.9)
    sk.ellipse(cx, cy, r * 0.34, width=6, color=color)


def cloud(sk, cx, cy, w=250, color=INK):
    rl, rt = w * 0.20, w * 0.25
    sk.ellipse(cx - w * 0.26, cy, rl, a0=90, a1=272, width=7, color=color)
    sk.ellipse(cx, cy - w * 0.10, rt, a0=196, a1=344, width=7, color=color)
    sk.ellipse(cx + w * 0.26, cy, rl, a0=268, a1=450, width=7, color=color)
    sk.line((cx - w * 0.26, cy + rl), (cx + w * 0.26, cy + rl), width=7, color=color)


def magnifier(sk, cx, cy, r=58, color=INK):
    sk.ellipse(cx, cy, r, width=7, color=color)
    sk.line((cx + r * 0.72, cy + r * 0.72), (cx + r * 1.56, cy + r * 1.56), width=9, color=color)


def paper_stack(sk, cx, cy, w=170, n=3, color=INK, lines=3):
    h = w * 1.24
    for i in range(n - 1, -1, -1):
        o = i * 14
        sk.rect(cx - w / 2 + o, cy - h / 2 - o, w, h, width=7 if i == 0 else 5, color=color)
    for i in range(lines):
        y = cy - h * 0.20 + i * 30
        sk.line((cx - w / 2 + 24, y), (cx + w / 2 - (24 if i % 2 == 0 else 60), y),
                width=5, color=color, amp=0.5)


def checkbox(sk, x, y, size=42, color=INK, checked=True, accent=BLUE):
    sk.rect(x, y, size, size, width=6, color=color)
    if checked:
        sk.stroke([(x + size * 0.18, y + size * 0.54), (x + size * 0.42, y + size * 0.82),
                   (x + size * 0.88, y + size * 0.14)], width=7, color=accent)


def todo_list(sk, x, y, rows=4, gap=96, w=340, color=INK, last_open=True):
    for i in range(rows):
        yy = y + i * gap
        checkbox(sk, x, yy, 42, color, checked=not (last_open and i == rows - 1))
        sk.line((x + 66, yy + 24), (x + w - (0 if i % 2 else 70), yy + 24),
                width=6, color=color, amp=0.6)


def compass(sk, cx, cy, r=88, color=INK, accent=RED):
    sk.ellipse(cx, cy, r, width=8, color=color)
    sk.ellipse(cx, cy, r * 0.80, width=5, color=color, amp=0.8)
    sk.stroke([(cx, cy - r * 0.60), (cx + r * 0.30, cy), (cx, cy + r * 0.60), (cx - r * 0.30, cy)],
              closed=True, width=6, color=color)
    sk.stroke([(cx, cy - r * 0.60), (cx + r * 0.30, cy), (cx - r * 0.30, cy)],
              closed=True, width=7, color=accent)


def anchor(sk, cx, cy, r=80, color=INK):
    sk.ellipse(cx, cy - r * 0.88, r * 0.20, width=7, color=color)
    sk.line((cx, cy - r * 0.68), (cx, cy + r * 0.86), width=8, color=color)
    sk.line((cx - r * 0.44, cy - r * 0.40), (cx + r * 0.44, cy - r * 0.40), width=7, color=color)
    sk.bezier((cx - r * 0.80, cy + r * 0.16), (cx - r * 0.84, cy + r * 0.94),
              (cx + r * 0.84, cy + r * 0.94), (cx + r * 0.80, cy + r * 0.16), width=8, color=color)


def apple_shape(sk, cx, cy, r=84, color=INK, accent=None):
    sk.bezier((cx, cy - r * 0.52), (cx - r * 1.14, cy - r * 0.94),
              (cx - r * 0.94, cy + r * 1.06), (cx, cy + r * 0.96), width=7, color=color)
    sk.bezier((cx, cy - r * 0.52), (cx + r * 1.14, cy - r * 0.94),
              (cx + r * 0.94, cy + r * 1.06), (cx, cy + r * 0.96), width=7, color=color)
    sk.line((cx, cy - r * 0.56), (cx + r * 0.06, cy - r * 1.02), width=6, color=color)
    sk.bezier((cx + r * 0.06, cy - r * 0.94), (cx + r * 0.50, cy - r * 1.32),
              (cx + r * 0.74, cy - r * 0.96), (cx + r * 0.24, cy - r * 0.80),
              width=6, color=accent or color)


def laptop(sk, cx, cy, w=230, color=INK):
    h = w * 0.62
    sk.stroke([(cx - w / 2, cy), (cx - w / 2 + 18, cy - h), (cx + w / 2 - 18, cy - h),
               (cx + w / 2, cy)], closed=True, width=7, color=color)
    sk.line((cx - w / 2 - 24, cy + 20), (cx + w / 2 + 24, cy + 20), width=7, color=color)
    sk.line((cx - w / 2, cy), (cx - w / 2 - 24, cy + 20), width=7, color=color)
    sk.line((cx + w / 2, cy), (cx + w / 2 + 24, cy + 20), width=7, color=color)


def cross_mark(sk, cx, cy, r=76, color=INK, accent=RED):
    sk.ellipse(cx, cy, r, width=7, color=color)
    sk.line((cx - r * 0.48, cy - r * 0.48), (cx + r * 0.48, cy + r * 0.48), width=9, color=accent)
    sk.line((cx + r * 0.48, cy - r * 0.48), (cx - r * 0.48, cy + r * 0.48), width=9, color=accent)


def spark(sk, cx, cy, r=44, color=INK, n=5):
    for i in range(n):
        a = math.radians(360 * i / n - 90)
        sk.line((cx + math.cos(a) * r * 0.34, cy + math.sin(a) * r * 0.34),
                (cx + math.cos(a) * r, cy + math.sin(a) * r), color=color, width=6, amp=0.4)


def scribble_tangle(sk, cx, cy, w=280, h=200, color=INK, seed=3):
    rng = random.Random(seed)
    pts = []
    for i in range(50):
        t = i / 49
        a = t * math.pi * 7.5
        rr = 0.18 + 0.82 * abs(math.sin(a * 0.6))
        pts.append((cx + math.cos(a) * w / 2 * rr + rng.uniform(-9, 9),
                    cy + math.sin(a * 1.35) * h / 2 * rr + rng.uniform(-9, 9)))
    sk.stroke(pts, color=color, width=7, amp=2.0)


def wave_line(sk, x0, x1, y, amp=40, n=4, color=INK):
    pts = [(x0 + (x1 - x0) * i / 80, y + math.sin(i / 80 * math.pi * n) * amp) for i in range(81)]
    sk.stroke(pts, color=color, width=7)


def zigzag_path(sk, x0, y0, x1, y1, steps=5, color=INK):
    pts = [(x0, y0)]
    for i in range(1, steps + 1):
        t = i / steps
        pts.append((_lerp(x0, x1, t), _lerp(y0, y1, t) + (34 if i % 2 else -34)))
    pts.append((x1, y1))
    sk.stroke(pts, color=color, width=7)


def biplane(sk, cx, cy, s=1.0, color=INK):
    sk.bezier((cx - 140 * s, cy), (cx - 46 * s, cy - 30 * s),
              (cx + 70 * s, cy - 26 * s), (cx + 148 * s, cy), width=7, color=color)
    sk.bezier((cx - 140 * s, cy), (cx - 46 * s, cy + 34 * s),
              (cx + 70 * s, cy + 30 * s), (cx + 148 * s, cy), width=7, color=color)
    sk.line((cx - 80 * s, cy - 18 * s), (cx - 80 * s, cy - 72 * s), width=6, color=color)
    sk.line((cx + 70 * s, cy - 16 * s), (cx + 70 * s, cy - 70 * s), width=6, color=color)
    sk.line((cx - 112 * s, cy - 72 * s), (cx + 112 * s, cy - 72 * s), width=7, color=color)
    sk.ellipse(cx + 136 * s, cy + 2 * s, 10 * s, width=5, color=color)


def org_chart(sk, cx, top, bw=170, bh=72, gap=124, color=INK):
    sk.rect(cx - bw / 2, top, bw, bh, width=7, color=color)
    y2 = top + gap
    for dx in (-128, 128):
        sk.rect(cx + dx - bw / 2, y2, bw, bh, width=7, color=color)
        sk.line((cx, top + bh), (cx + dx, y2), width=5, color=color)
    y3 = y2 + gap
    sk.rect(cx - bw / 2, y3, bw, bh, width=7, color=color)
    sk.line((cx - 128, y2 + bh), (cx, y3), width=5, color=color)
    sk.line((cx + 128, y2 + bh), (cx, y3), width=5, color=color)


def product_box(sk, cx, cy, w=210, color=INK):
    h = w * 0.78
    sk.rect(cx - w / 2, cy - h / 2, w, h, width=7, color=color)
    sk.line((cx - w / 2, cy - h / 2 + 38), (cx + w / 2, cy - h / 2 + 38), width=6, color=color)
    sk.line((cx, cy - h / 2), (cx, cy - h / 2 + 38), width=6, color=color)
    gear(sk, cx, cy + 18, r=38, teeth=8, color=color)


def coin_stack(sk, cx, cy, r=84, color=INK):
    for i in range(3):
        sk.ellipse(cx, cy + i * 34, r, r * 0.34, width=7, color=color)
    sk.line((cx - r, cy), (cx - r, cy + 68), width=7, color=color)
    sk.line((cx + r, cy), (cx + r, cy + 68), width=7, color=color)
    dollar(sk, cx, cy - r * 0.30, 40, color)


def link_box(sk, x, y, w, h, color=INK):
    sk.rect(x, y, w, h, r=10, width=7, color=color)
    for i in range(2):
        sk.line((x + 30, y + 34 + i * 36), (x + w - (34 if i == 0 else 140), y + 34 + i * 36),
                width=6, color=color, amp=0.5)
