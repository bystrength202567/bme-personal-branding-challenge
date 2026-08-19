"""손그림 화이트보드 라인아트 생성 라이브러리.

srt-whiteboard-animation 스킬의 출도 규범을 따른다:
  - 미색 종이 배경 #F5EBD7, 짙은 회색 스케치 선
  - 강조색은 빨강/주황/파랑만 소량
  - 화면 안에 문자/숫자/라벨 없음
  - 여백을 넉넉히 두어 영역 분할이 쉽도록 배치
"""

import math
import random

from PIL import Image, ImageDraw

SS = 2  # 슈퍼샘플링 배율

PAPER = (245, 235, 215)
INK = (58, 58, 58)
RED = (200, 78, 68)
ORANGE = (226, 130, 58)
BLUE = (74, 127, 181)


def _lerp(a, b, t):
    return a + (b - a) * t


def _resample(pts, step):
    """폴리라인을 일정 간격으로 다시 샘플링한다."""
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
    """누적 랜덤워크를 이동평균으로 부드럽게 만든 노이즈."""
    raw = [0.0]
    for _ in range(n - 1):
        raw.append(raw[-1] + rng.uniform(-1.0, 1.0))
    if not raw:
        return raw
    span = max(abs(v) for v in raw) or 1.0
    raw = [v / span for v in raw]
    k = max(2, n // 12)
    out = []
    for i in range(n):
        lo, hi = max(0, i - k), min(n, i + k + 1)
        out.append(sum(raw[lo:hi]) / (hi - lo) * amp)
    return out


class Sketch:
    def __init__(self, width, height, seed=7):
        self.w, self.h = width, height
        self.img = Image.new("RGB", (width * SS, height * SS), PAPER)
        self.d = ImageDraw.Draw(self.img)
        self.rng = random.Random(seed)

    # --- 기본 획 ---------------------------------------------------------
    def stroke(self, pts, color=INK, width=3, amp=1.5, closed=False):
        """손으로 그은 듯 미세하게 흔들리는 획."""
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
        n = max(16, int(abs(a1 - a0) / 6))
        pts = []
        for i in range(n + 1):
            a = math.radians(_lerp(a0, a1, i / n))
            pts.append((cx + rx * math.cos(a), cy + ry * math.sin(a)))
        closed = abs(a1 - a0) >= 359
        if closed:
            pts = pts[:-1]
        self.stroke(pts, closed=closed, **kw)

    def rect(self, x, y, w, h, **kw):
        self.stroke([(x, y), (x + w, y), (x + w, y + h), (x, y + h)], closed=True, **kw)

    def bezier(self, p0, p1, p2, p3, n=40, **kw):
        pts = []
        for i in range(n + 1):
            t = i / n
            mt = 1 - t
            x = (mt ** 3 * p0[0] + 3 * mt * mt * t * p1[0]
                 + 3 * mt * t * t * p2[0] + t ** 3 * p3[0])
            y = (mt ** 3 * p0[1] + 3 * mt * mt * t * p1[1]
                 + 3 * mt * t * t * p2[1] + t ** 3 * p3[1])
            pts.append((x, y))
        self.stroke(pts, **kw)

    def fill_poly(self, pts, color):
        self.d.polygon([(x * SS, y * SS) for x, y in pts], fill=color)

    def save(self, path):
        self.img.resize((self.w, self.h), Image.LANCZOS).save(path)


# --- 도형 프리미티브 -----------------------------------------------------

def arrow(sk, p, q, head=22, color=INK, width=3, curve=0.0):
    """직선 또는 살짝 휜 화살표."""
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
        a = ang + math.pi + s * math.radians(26)
        sk.line(q, (x1 + head * math.cos(a), y1 + head * math.sin(a)),
                color=color, width=width, amp=0.6)


def person_bust(sk, cx, top, scale=1.0, color=INK, width=3):
    """머리 + 어깨 상반신."""
    hr = 34 * scale
    sk.ellipse(cx, top + hr, hr, color=color, width=width)
    chin = top + 2 * hr
    sk.line((cx - 11 * scale, chin - 4 * scale), (cx - 13 * scale, chin + 12 * scale),
            color=color, width=width, amp=0.4)
    sk.line((cx + 11 * scale, chin - 4 * scale), (cx + 13 * scale, chin + 12 * scale),
            color=color, width=width, amp=0.4)
    sk.bezier((cx - 74 * scale, chin + 82 * scale), (cx - 66 * scale, chin + 10 * scale),
              (cx + 66 * scale, chin + 10 * scale), (cx + 74 * scale, chin + 82 * scale),
              color=color, width=width)


def person_standing(sk, cx, top, scale=1.0, color=INK, width=3, arms="down"):
    hr = 26 * scale
    sk.ellipse(cx, top + hr, hr, color=color, width=width)
    neck = top + 2 * hr
    hip = neck + 78 * scale
    sk.line((cx, neck), (cx, hip), color=color, width=width)
    if arms == "up":
        sk.line((cx, neck + 16 * scale), (cx - 44 * scale, neck - 6 * scale), color=color, width=width)
        sk.line((cx, neck + 16 * scale), (cx + 44 * scale, neck - 6 * scale), color=color, width=width)
    elif arms == "shrug":
        sk.stroke([(cx, neck + 14 * scale), (cx - 38 * scale, neck + 22 * scale), (cx - 44 * scale, neck - 2 * scale)],
                  color=color, width=width)
        sk.stroke([(cx, neck + 14 * scale), (cx + 38 * scale, neck + 22 * scale), (cx + 44 * scale, neck - 2 * scale)],
                  color=color, width=width)
    else:
        sk.line((cx, neck + 14 * scale), (cx - 38 * scale, neck + 58 * scale), color=color, width=width)
        sk.line((cx, neck + 14 * scale), (cx + 38 * scale, neck + 58 * scale), color=color, width=width)
    sk.line((cx, hip), (cx - 30 * scale, hip + 74 * scale), color=color, width=width)
    sk.line((cx, hip), (cx + 30 * scale, hip + 74 * scale), color=color, width=width)


def laptop(sk, cx, cy, w=190, color=INK, width=3):
    h = w * 0.62
    sk.stroke([(cx - w / 2, cy), (cx - w / 2 + 14, cy - h), (cx + w / 2 - 14, cy - h), (cx + w / 2, cy)],
              closed=True, color=color, width=width)
    sk.line((cx - w / 2 - 18, cy + 16), (cx + w / 2 + 18, cy + 16), color=color, width=width)
    sk.line((cx - w / 2, cy), (cx - w / 2 - 18, cy + 16), color=color, width=width)
    sk.line((cx + w / 2, cy), (cx + w / 2 + 18, cy + 16), color=color, width=width)


def phone(sk, cx, cy, w=78, color=INK, width=3):
    h = w * 1.95
    sk.rect(cx - w / 2, cy - h / 2, w, h, color=color, width=width)
    sk.line((cx - w * 0.18, cy - h / 2 + 12), (cx + w * 0.18, cy - h / 2 + 12), color=color, width=2)
    sk.ellipse(cx, cy + h / 2 - 14, 7, color=color, width=2)


def play_triangle(sk, cx, cy, r=26, color=RED, width=3):
    sk.stroke([(cx - r * 0.55, cy - r * 0.8), (cx + r * 0.8, cy), (cx - r * 0.55, cy + r * 0.8)],
              closed=True, color=color, width=width)


def book_closed(sk, cx, cy, w=150, color=INK, width=3, accent=None):
    h = w * 1.35
    sk.rect(cx - w / 2, cy - h / 2, w, h, color=color, width=width)
    sk.line((cx - w / 2 + 18, cy - h / 2), (cx - w / 2 + 18, cy + h / 2), color=color, width=2)
    if accent:
        sk.line((cx - w / 2 + 42, cy - h * 0.12), (cx + w / 2 - 26, cy - h * 0.12), color=accent, width=4)
        sk.line((cx - w / 2 + 42, cy + h * 0.04), (cx + w / 2 - 52, cy + h * 0.04), color=accent, width=4)


def book_open(sk, cx, cy, w=280, color=INK, width=3, lines=3, accent=None):
    h = w * 0.52
    sk.bezier((cx - w / 2, cy - h / 2), (cx - w / 4, cy - h / 2 - 16),
              (cx - w / 8, cy - h / 2 + 6), (cx, cy - h / 2 + 10), color=color, width=width)
    sk.bezier((cx, cy - h / 2 + 10), (cx + w / 8, cy - h / 2 + 6),
              (cx + w / 4, cy - h / 2 - 16), (cx + w / 2, cy - h / 2), color=color, width=width)
    sk.line((cx - w / 2, cy - h / 2), (cx - w / 2 + 16, cy + h / 2), color=color, width=width)
    sk.line((cx + w / 2, cy - h / 2), (cx + w / 2 - 16, cy + h / 2), color=color, width=width)
    sk.bezier((cx - w / 2 + 16, cy + h / 2), (cx - w / 4, cy + h / 2 + 14),
              (cx + w / 4, cy + h / 2 + 14), (cx + w / 2 - 16, cy + h / 2), color=color, width=width)
    sk.line((cx, cy - h / 2 + 10), (cx, cy + h / 2 + 6), color=color, width=2)
    for i in range(lines):
        y = cy - h / 6 + i * 22
        c = accent if (accent and i == 1) else color
        sk.line((cx - w / 2 + 42, y), (cx - 22, y), color=c, width=3 if c == color else 4, amp=0.8)
        sk.line((cx + 22, y), (cx + w / 2 - 42, y), color=color, width=3, amp=0.8)


def question_mark(sk, cx, cy, size=90, color=INK, width=4):
    s = size / 90.0
    sk.bezier((cx - 24 * s, cy - 26 * s), (cx - 22 * s, cy - 52 * s),
              (cx + 26 * s, cy - 52 * s), (cx + 22 * s, cy - 22 * s), color=color, width=width)
    sk.bezier((cx + 22 * s, cy - 22 * s), (cx + 18 * s, cy - 4 * s),
              (cx, cy + 2 * s), (cx, cy + 18 * s), color=color, width=width)
    sk.ellipse(cx, cy + 38 * s, 4 * s, color=color, width=width)


def lightbulb(sk, cx, cy, r=44, color=INK, width=3, rays=True, accent=ORANGE):
    sk.ellipse(cx, cy, r, color=color, width=width)
    sk.line((cx - r * 0.42, cy + r * 0.86), (cx - r * 0.42, cy + r * 1.25), color=color, width=width)
    sk.line((cx + r * 0.42, cy + r * 0.86), (cx + r * 0.42, cy + r * 1.25), color=color, width=width)
    sk.line((cx - r * 0.42, cy + r * 1.25), (cx + r * 0.42, cy + r * 1.25), color=color, width=width)
    sk.stroke([(cx - r * 0.3, cy + r * 0.4), (cx - r * 0.1, cy - r * 0.1),
               (cx + r * 0.1, cy + r * 0.3), (cx + r * 0.3, cy - r * 0.2)], color=color, width=2)
    if rays:
        for a in (-115, -90, -65, -25, -155):
            ar = math.radians(a)
            sk.line((cx + math.cos(ar) * r * 1.35, cy + math.sin(ar) * r * 1.35),
                    (cx + math.cos(ar) * r * 1.75, cy + math.sin(ar) * r * 1.75),
                    color=accent, width=3, amp=0.5)


def checkbox(sk, x, y, size=34, color=INK, width=3, checked=True, accent=BLUE):
    sk.rect(x, y, size, size, color=color, width=width)
    if checked:
        sk.stroke([(x + size * 0.2, y + size * 0.55), (x + size * 0.44, y + size * 0.8),
                   (x + size * 0.86, y + size * 0.18)], color=accent, width=4)


def compass(sk, cx, cy, r=64, color=INK, width=3, accent=RED):
    sk.ellipse(cx, cy, r, color=color, width=width)
    sk.ellipse(cx, cy, r * 0.82, color=color, width=2, amp=1.0)
    sk.stroke([(cx, cy - r * 0.62), (cx + r * 0.3, cy), (cx, cy + r * 0.62), (cx - r * 0.3, cy)],
              closed=True, color=color, width=2)
    sk.stroke([(cx, cy - r * 0.62), (cx + r * 0.3, cy), (cx - r * 0.3, cy)],
              closed=True, color=accent, width=3)
    sk.ellipse(cx, cy, 5, color=color, width=2)


def anchor(sk, cx, cy, r=62, color=INK, width=3):
    sk.ellipse(cx, cy - r * 0.9, r * 0.2, color=color, width=width)
    sk.line((cx, cy - r * 0.7), (cx, cy + r * 0.85), color=color, width=width)
    sk.line((cx - r * 0.42, cy - r * 0.42), (cx + r * 0.42, cy - r * 0.42), color=color, width=width)
    sk.bezier((cx - r * 0.78, cy + r * 0.18), (cx - r * 0.8, cy + r * 0.9),
              (cx + r * 0.8, cy + r * 0.9), (cx + r * 0.78, cy + r * 0.18), color=color, width=width)


def apple_shape(sk, cx, cy, r=66, color=INK, width=3, accent=RED):
    sk.bezier((cx, cy - r * 0.55), (cx - r * 1.15, cy - r * 0.95),
              (cx - r * 0.95, cy + r * 1.05), (cx, cy + r * 0.95), color=color, width=width)
    sk.bezier((cx, cy - r * 0.55), (cx + r * 1.15, cy - r * 0.95),
              (cx + r * 0.95, cy + r * 1.05), (cx, cy + r * 0.95), color=color, width=width)
    sk.line((cx, cy - r * 0.58), (cx + r * 0.06, cy - r * 1.0), color=color, width=width)
    sk.bezier((cx + r * 0.06, cy - r * 0.92), (cx + r * 0.5, cy - r * 1.3),
              (cx + r * 0.72, cy - r * 0.95), (cx + r * 0.24, cy - r * 0.78), color=accent, width=3)


def speech_bubble(sk, cx, cy, w=230, h=130, color=INK, width=3, tail="left", lines=2):
    sk.stroke([(cx - w / 2, cy - h / 2), (cx + w / 2, cy - h / 2),
               (cx + w / 2, cy + h / 2), (cx - w / 2, cy + h / 2)], closed=True, color=color, width=width)
    if tail == "left":
        sk.stroke([(cx - w / 2 + 30, cy + h / 2), (cx - w / 2 + 8, cy + h / 2 + 34),
                   (cx - w / 2 + 62, cy + h / 2)], color=color, width=width)
    else:
        sk.stroke([(cx + w / 2 - 30, cy + h / 2), (cx + w / 2 - 8, cy + h / 2 + 34),
                   (cx + w / 2 - 62, cy + h / 2)], color=color, width=width)
    for i in range(lines):
        y = cy - h / 2 + 38 + i * 30
        sk.line((cx - w / 2 + 26, y), (cx + w / 2 - (26 if i == 0 else 70), y), color=color, width=3, amp=0.7)


def cloud(sk, cx, cy, w=220, color=INK, width=3):
    rl = w * 0.20
    rt = w * 0.25
    base = cy + rl
    sk.ellipse(cx - w * 0.26, cy, rl, a0=90, a1=272, color=color, width=width)
    sk.ellipse(cx, cy - w * 0.10, rt, a0=196, a1=344, color=color, width=width)
    sk.ellipse(cx + w * 0.26, cy, rl, a0=268, a1=450, color=color, width=width)
    sk.line((cx - w * 0.26, base), (cx + w * 0.26, base), color=color, width=width)


def gear(sk, cx, cy, r=52, teeth=10, color=INK, width=3):
    pts = []
    for i in range(teeth * 2):
        a = math.radians(360 * i / (teeth * 2))
        rr = r if i % 2 == 0 else r * 0.84
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    sk.stroke(pts, closed=True, color=color, width=width, amp=1.0)
    sk.ellipse(cx, cy, r * 0.32, color=color, width=2)


def magnifier(sk, cx, cy, r=48, color=INK, width=3):
    sk.ellipse(cx, cy, r, color=color, width=width)
    sk.line((cx + r * 0.72, cy + r * 0.72), (cx + r * 1.5, cy + r * 1.5), color=color, width=width + 1)


def paper_stack(sk, cx, cy, w=150, n=3, color=INK, width=3, lines=3):
    h = w * 1.25
    for i in range(n - 1, -1, -1):
        off = i * 12
        sk.rect(cx - w / 2 + off, cy - h / 2 - off, w, h, color=color, width=width if i == 0 else 2)
    for i in range(lines):
        y = cy - h / 4 + i * 26
        sk.line((cx - w / 2 + 22, y), (cx + w / 2 - (22 if i % 2 == 0 else 56), y),
                color=color, width=2, amp=0.7)


def golden_circle(sk, cx, cy, r=250, color=INK, width=3):
    """골든서클 3중원 — 바깥 WHAT / 가운데 HOW / 안쪽 WHY (문자는 편집에서 오버레이)."""
    sk.ellipse(cx, cy, r, color=color, width=width)
    sk.ellipse(cx, cy, r * 0.66, color=color, width=width)
    sk.ellipse(cx, cy, r * 0.32, color=ORANGE, width=width + 1)


def stop_hand(sk, cx, cy, s=1.0, color=INK, width=3):
    w, h = 96 * s, 118 * s
    sk.stroke([(cx - w / 2, cy + h / 2), (cx - w / 2, cy - h * 0.18),
               (cx - w * 0.28, cy - h * 0.55)], color=color, width=width)
    for i, dx in enumerate((-0.14, 0.06, 0.26)):
        sk.line((cx + w * dx, cy - h * (0.42 + 0.06 * (1 - abs(i - 1)))),
                (cx + w * dx, cy + h * 0.1), color=color, width=width)
    sk.stroke([(cx + w * 0.4, cy - h * 0.3), (cx + w / 2, cy + h * 0.1),
               (cx + w * 0.3, cy + h / 2), (cx - w / 2, cy + h / 2)], color=color, width=width)


def scribble_tangle(sk, cx, cy, w=240, h=170, color=INK, width=3, seed=3):
    """엉킨 실타래 — '복잡해진다'를 표현."""
    rng = random.Random(seed)
    pts = []
    for i in range(46):
        t = i / 45
        a = t * math.pi * 7.5
        rr = 0.18 + 0.82 * abs(math.sin(a * 0.6))
        pts.append((cx + math.cos(a) * w / 2 * rr + rng.uniform(-8, 8),
                    cy + math.sin(a * 1.35) * h / 2 * rr + rng.uniform(-8, 8)))
    sk.stroke(pts, color=color, width=width, amp=2.2)


def zigzag_path(sk, x0, y0, x1, y1, steps=5, color=INK, width=3):
    pts = [(x0, y0)]
    for i in range(1, steps + 1):
        t = i / steps
        x = _lerp(x0, x1, t)
        y = _lerp(y0, y1, t) + (28 if i % 2 else -28)
        pts.append((x, y))
    pts.append((x1, y1))
    sk.stroke(pts, color=color, width=width)


def spark(sk, cx, cy, r=30, color=ORANGE, width=3, n=5):
    for i in range(n):
        a = math.radians(360 * i / n - 90)
        sk.line((cx + math.cos(a) * r * 0.35, cy + math.sin(a) * r * 0.35),
                (cx + math.cos(a) * r, cy + math.sin(a) * r), color=color, width=width, amp=0.4)


def target(sk, cx, cy, r=70, color=INK, width=3, accent=RED):
    sk.ellipse(cx, cy, r, color=color, width=width)
    sk.ellipse(cx, cy, r * 0.62, color=color, width=2)
    sk.ellipse(cx, cy, r * 0.24, color=accent, width=width)


def calendar_grid(sk, cx, cy, w=180, color=INK, width=3):
    h = w * 0.86
    sk.rect(cx - w / 2, cy - h / 2, w, h, color=color, width=width)
    sk.line((cx - w / 2, cy - h / 2 + 30), (cx + w / 2, cy - h / 2 + 30), color=color, width=2)
    sk.line((cx - w * 0.26, cy - h / 2 - 14), (cx - w * 0.26, cy - h / 2 + 8), color=color, width=width)
    sk.line((cx + w * 0.26, cy - h / 2 - 14), (cx + w * 0.26, cy - h / 2 + 8), color=color, width=width)
    for i in (1, 2):
        sk.line((cx - w / 2 + i * w / 3, cy - h / 2 + 30), (cx - w / 2 + i * w / 3, cy + h / 2),
                color=color, width=2, amp=0.6)
    for i in (1, 2):
        sk.line((cx - w / 2, cy - h / 2 + 30 + i * (h - 30) / 3),
                (cx + w / 2, cy - h / 2 + 30 + i * (h - 30) / 3), color=color, width=2, amp=0.6)
