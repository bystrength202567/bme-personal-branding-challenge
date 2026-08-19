"""『스타트 위드 와이』 추천 영상 — 화이트보드 장면 생성기.

대본 20씬을 19개 화이트보드 장면으로 매핑해서
  scene-NN-<이름>.png            (라인아트)
  scene-NN-<이름>.annotation.json (분구 주석)
을 만든다. 렌더링은 srt-whiteboard-animation 의 render_stream_whiteboard.py 가 담당.
"""

import json
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from whiteboard_lib import (  # noqa: E402
    BLUE, INK, ORANGE, RED, Sketch,
    anchor, apple_shape, arrow, book_closed, book_open, calendar_grid, checkbox,
    cloud, compass, gear, golden_circle, laptop, lightbulb, magnifier, paper_stack,
    person_bust, person_standing, phone, play_triangle, question_mark,
    scribble_tangle, spark, speech_bubble, stop_hand, target, zigzag_path,
)

W, H = 1920, 1080
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                   "assets", "whiteboard", "start-with-why")


# --- 장면 전용 보조 도형 -------------------------------------------------

def todo_list(sk, x, y, rows=4, gap=86, w=320):
    for i in range(rows):
        yy = y + i * gap
        checkbox(sk, x, yy, 36, checked=(i < rows - 1), accent=BLUE)
        sk.line((x + 56, yy + 20), (x + w - (0 if i % 2 else 60), yy + 20), width=3, amp=0.8)


def coin_stack(sk, cx, cy, r=74):
    for i in range(3):
        sk.ellipse(cx, cy + i * 30, r, r * 0.34, width=3)
    sk.line((cx - r, cy), (cx - r, cy + 60), width=3)
    sk.line((cx + r, cy), (cx + r, cy + 60), width=3)


def wave_line(sk, x0, x1, y, amp=34, n=4, color=INK):
    pts = []
    for i in range(81):
        t = i / 80
        pts.append((x0 + (x1 - x0) * t, y + math.sin(t * math.pi * n) * amp))
    sk.stroke(pts, color=color, width=3)


def biplane(sk, cx, cy, s=1.0):
    sk.bezier((cx - 120 * s, cy), (cx - 40 * s, cy - 26 * s),
              (cx + 60 * s, cy - 22 * s), (cx + 128 * s, cy), width=3)
    sk.bezier((cx - 120 * s, cy), (cx - 40 * s, cy + 30 * s),
              (cx + 60 * s, cy + 26 * s), (cx + 128 * s, cy), width=3)
    sk.line((cx - 70 * s, cy - 16 * s), (cx - 70 * s, cy - 62 * s), width=3)
    sk.line((cx + 60 * s, cy - 14 * s), (cx + 60 * s, cy - 60 * s), width=3)
    sk.line((cx - 96 * s, cy - 62 * s), (cx + 96 * s, cy - 62 * s), width=3)
    sk.ellipse(cx + 118 * s, cy + 2 * s, 8 * s, width=3)


def org_chart(sk, cx, top, bw=150, bh=64, gap=110):
    sk.rect(cx - bw / 2, top, bw, bh, width=3)
    y2 = top + gap
    for dx in (-110, 110):
        sk.rect(cx + dx - bw / 2, y2, bw, bh, width=3)
        sk.line((cx, top + bh), (cx + dx, y2), width=2)
    y3 = y2 + gap
    sk.rect(cx - bw / 2, y3, bw, bh, width=3)
    sk.line((cx - 110, y2 + bh), (cx, y3), width=2)
    sk.line((cx + 110, y2 + bh), (cx, y3), width=2)


def cross_mark(sk, cx, cy, r=62, color=RED):
    sk.ellipse(cx, cy, r, width=3)
    sk.line((cx - r * 0.5, cy - r * 0.5), (cx + r * 0.5, cy + r * 0.5), color=color, width=4)
    sk.line((cx + r * 0.5, cy - r * 0.5), (cx - r * 0.5, cy + r * 0.5), color=color, width=4)


def product_box(sk, cx, cy, w=200):
    h = w * 0.78
    sk.rect(cx - w / 2, cy - h / 2, w, h, width=3)
    sk.line((cx - w / 2, cy - h / 2 + 34), (cx + w / 2, cy - h / 2 + 34), width=2)
    sk.line((cx, cy - h / 2), (cx, cy - h / 2 + 34), width=2)
    gear(sk, cx, cy + 14, r=34, teeth=8, width=2)


def crossed_icon(sk, cx, cy):
    gear(sk, cx, cy, r=42, teeth=8, width=3)
    sk.line((cx - 46, cy - 46), (cx + 46, cy + 46), color=RED, width=4)


def link_box(sk, x, y, w, h):
    sk.rect(x, y, w, h, width=3)
    for i in range(2):
        sk.line((x + 26, y + 28 + i * 30), (x + w - (30 if i == 0 else 120), y + 28 + i * 30),
                width=3, amp=0.7)


def group_of_three(sk, xs, top, scale=1.2):
    for x in xs:
        person_standing(sk, x, top, scale)


# --- 장면 정의 -----------------------------------------------------------
# 각 요소: (id, label, narrativeRole, region(x,y,w,h), startMs, durationMs, subtitle, draw)

SCENES = [
    dict(
        num=1, name="hook-overload", start=0, end=20000,
        basis="공부할수록 어려워지는 대표님과, 사방에서 몰려오는 마케팅 채널들.",
        elements=[
            ("owner", "고민하는 대표", "장면 铺垫 — 이야기의 주인공",
             (200, 380, 300, 320), 0, 4200,
             "대표님들, 마케팅 공부할수록 더 어려워지시죠?",
             lambda sk: person_bust(sk, 330, 420, 1.6)),
            ("reels", "릴스 화면", "채널 나열 1",
             (600, 130, 210, 270), 5000, 1900,
             "릴스도 하고, 네이버도 하고, 스레드도 하고",
             lambda sk: (phone(sk, 700, 262, 92), play_triangle(sk, 700, 262, 26))),
            ("search", "검색 노출", "채널 나열 2",
             (870, 150, 290, 240), 7000, 1900,
             "릴스도 하고, 네이버도 하고, 스레드도 하고",
             lambda sk: magnifier(sk, 980, 250, 58)),
            ("ai", "AI 공부", "채널 나열 3 — 부담의 확대",
             (1250, 140, 350, 320), 9000, 3400,
             "요즘은 AI도 배워야 할 것 같고.",
             lambda sk: (cloud(sk, 1420, 238, 260), gear(sk, 1420, 386, 46))),
            ("agency", "대행사 상담", "채널 나열 4 — 외부에 맡겨봄",
             (560, 470, 760, 300), 13000, 2800,
             "그러다 대행사도 만나보고, 한 달 정도 맡겨보기도 하는데",
             lambda sk: (speech_bubble(sk, 760, 620, 300, 150, tail="left"),
                         speech_bubble(sk, 1120, 640, 300, 150, tail="right"))),
            ("tangle", "엉킨 실타래", "결과 — 더 복잡해짐",
             (1450, 460, 400, 330), 16000, 3300,
             "그러다 대행사도 만나보고, 한 달 정도 맡겨보기도 하는데",
             lambda sk: scribble_tangle(sk, 1640, 620, 300, 240, seed=11)),
        ]),

    dict(
        num=2, name="stop", start=20000, end=30000,
        basis="공부할수록 어려워진다 — 그러니 잠깐 멈춰야 한다.",
        elements=[
            ("confused", "어깨를 으쓱한 대표", "문제 확인",
             (360, 300, 340, 470), 0, 3200,
             "그런데 이상하게 공부하면 할수록 마케팅이 더 어려워집니다.",
             lambda sk: person_standing(sk, 520, 330, 1.6, arms="shrug")),
            ("mess", "머릿속의 엉킴", "감정 — 혼란",
             (760, 220, 420, 320), 3200, 1600,
             "그런데 이상하게 공부하면 할수록 마케팅이 더 어려워집니다.",
             lambda sk: scribble_tangle(sk, 970, 380, 340, 260, seed=5)),
            ("stop", "멈춤 손짓", "전환 — 잠깐 멈추세요",
             (1230, 380, 400, 350), 6200, 3200,
             "그렇다면 잠깐, 공부를 멈춰주세요.",
             lambda sk: stop_hand(sk, 1420, 545, 2.0)),
        ]),

    dict(
        num=3, name="intro-stella", start=30000, end=50000,
        basis="광고학 전공 17년차 마케터가, 헤매는 대표님들의 길을 잡아준다.",
        elements=[
            ("stella", "스텔라", "화자 소개",
             (240, 350, 380, 350), 0, 5200,
             "안녕하세요. 광고학 전공, 17년차 대기업 마케터 출신 스텔라입니다.",
             lambda sk: person_bust(sk, 420, 400, 1.9)),
            ("career", "쌓인 실무 자료", "경력의 근거",
             (700, 330, 300, 390), 6000, 3600,
             "지금은 브랜드를 시작한 대표님들이 마케팅 때문에 헤매지 않도록",
             lambda sk: paper_stack(sk, 850, 520, 180, 3)),
            ("wander", "헤매는 길", "문제 — 방향을 잃음",
             (1050, 330, 440, 390), 9800, 4200,
             "지금은 브랜드를 시작한 대표님들이 마케팅 때문에 헤매지 않도록",
             lambda sk: zigzag_path(sk, 1100, 660, 1440, 420, 5)),
            ("clarity", "잡힌 방향", "해결 — 쉽게 알려줌",
             (1540, 380, 300, 300), 14200, 4500,
             "브랜딩과 마케팅을 쉽게 알려드리고 있어요.",
             lambda sk: target(sk, 1690, 530, 92)),
        ]),

    dict(
        num=4, name="the-book", start=50000, end=65000,
        basis="오늘 소개할 책 한 권이 등장한다.",
        elements=[
            ("speaker", "책을 권하는 사람", "도입",
             (180, 380, 340, 340), 0, 4200,
             "오늘은 제가 이 책만큼은 꼭 읽어보세요 하고 싶은 책 한 권을 소개할게요.",
             lambda sk: person_bust(sk, 340, 410, 1.7)),
            ("book", "책", "핵심 대상 등장",
             (720, 320, 380, 480), 4600, 4400,
             "바로 이 책입니다.",
             lambda sk: book_closed(sk, 900, 545, 240, accent=RED)),
            ("shine", "반짝임", "강조",
             (1180, 330, 300, 300), 9400, 2200,
             "스타트 위드 와이.",
             lambda sk: (spark(sk, 1320, 470, 70), spark(sk, 1420, 600, 46))),
            ("idea", "전구", "책이 주는 통찰",
             (1520, 380, 320, 340), 11800, 2600,
             "스타트 위드 와이.",
             lambda sk: lightbulb(sk, 1660, 520, 62)),
        ]),

    dict(
        num=5, name="know-what-not-why", start=65000, end=100000,
        basis="할 일은 이미 다 안다. 문제는 '그래서 나는 뭘 해야 하지?' 이다.",
        elements=[
            ("owner", "대표", "문제의 주체",
             (140, 400, 300, 310), 0, 4400,
             "대표님들이 마케팅을 어려워하는 이유는 방법을 몰라서만은 아니에요.",
             lambda sk: person_bust(sk, 270, 430, 1.5)),
            ("todo", "할 일 목록", "이미 알고 있는 것들",
             (520, 130, 430, 430), 5500, 3600,
             "오히려 뭘 해야 하는지는 너무 많이 알고 있습니다.",
             lambda sk: todo_list(sk, 560, 170, 4, 86, 330)),
            ("reels", "릴스", "해야 할 일 1",
             (1000, 140, 200, 280), 9500, 2200,
             "릴스 해야 하고, 블로그 해야 하고, 검색 노출도 해야 하고, 광고도 해야 하고",
             lambda sk: (phone(sk, 1100, 272, 88), play_triangle(sk, 1100, 272, 24))),
            ("blog", "블로그", "해야 할 일 2",
             (1250, 150, 300, 250), 11800, 2200,
             "릴스 해야 하고, 블로그 해야 하고, 검색 노출도 해야 하고, 광고도 해야 하고",
             lambda sk: laptop(sk, 1400, 340, 220)),
            ("seo", "검색 노출", "해야 할 일 3",
             (1600, 150, 280, 250), 14000, 2000,
             "릴스 해야 하고, 블로그 해야 하고, 검색 노출도 해야 하고, 광고도 해야 하고",
             lambda sk: magnifier(sk, 1710, 255, 56)),
            ("question", "그래서 나는?", "핵심 질문",
             (520, 600, 350, 400), 16200, 4200,
             "그래서 나는 뭘 해야 하지?",
             lambda sk: question_mark(sk, 690, 790, 190)),
            ("ai", "AI 유행", "따라가기",
             (960, 600, 350, 350), 21000, 3000,
             "AI가 대세라고 하면 AI를 배우고",
             lambda sk: (cloud(sk, 1130, 700, 250), gear(sk, 1130, 850, 44))),
            ("blur", "흐려지는 브랜드", "결과",
             (1400, 600, 440, 390), 24500, 4200,
             "열심히는 하는데 브랜드는 점점 더 복잡해집니다.",
             lambda sk: scribble_tangle(sk, 1620, 800, 340, 280, seed=17)),
        ]),

    dict(
        num=6, name="different-question", start=100000, end=130000,
        basis="책은 WHAT이 아니라 WHY를 먼저 물으라고 한다. 돈은 결과일 뿐이다.",
        elements=[
            ("book", "펼친 책", "새 관점의 출처",
             (300, 270, 520, 330), 0, 5000,
             "그런데 이 책은 여기서 완전히 다른 질문을 던집니다.",
             lambda sk: book_open(sk, 560, 430, 420, accent=RED)),
            ("reverse", "방향을 뒤집는 화살표", "핵심 전환 — WHAT에서 WHY로",
             (880, 270, 620, 320), 5300, 4400,
             "WHAT이 아니라 WHY를 먼저 생각하라.",
             lambda sk: (arrow(sk, (940, 350), (1420, 350), curve=-46),
                         arrow(sk, (1420, 500), (940, 500), color=ORANGE, curve=-46))),
            ("money", "돈", "흔한 오해",
             (1560, 270, 340, 330), 10000, 3400,
             "이 책에서 말하는 WHY는 돈을 많이 벌고 싶다가 아닙니다.",
             lambda sk: coin_stack(sk, 1730, 400, 76)),
            ("result", "결과로 흐르는 화살표", "정정 — 돈은 결과",
             (1560, 630, 340, 300), 13600, 2600,
             "돈은 결과예요.",
             lambda sk: arrow(sk, (1730, 670), (1730, 890))),
            ("purpose", "전구 — 왜 하는가", "WHY 정의 1",
             (300, 640, 400, 350), 16400, 4600,
             "WHY는 왜 이 일을 하는지, 무엇을 믿는지,",
             lambda sk: lightbulb(sk, 500, 800, 82)),
            ("belief", "믿음을 든 사람", "WHY 정의 2",
             (790, 640, 380, 350), 21200, 4200,
             "WHY는 왜 이 일을 하는지, 무엇을 믿는지,",
             lambda sk: person_standing(sk, 980, 690, 1.3, arms="up")),
            ("exist", "브랜드의 중심", "WHY 정의 3",
             (1230, 640, 300, 330), 25600, 3400,
             "왜 이 브랜드가 존재하는지에 대한 질문입니다.",
             lambda sk: target(sk, 1380, 805, 108)),
        ]),

    dict(
        num=7, name="three-questions", start=130000, end=150000,
        basis="대표님께 던지는 세 개의 질문, 그리고 망설여진다면 이 책.",
        elements=[
            ("owner", "질문을 받는 대표", "청자 지목",
             (160, 380, 320, 330), 0, 2600,
             "대표님.",
             lambda sk: person_bust(sk, 300, 410, 1.6)),
            ("q1", "첫 번째 질문", "질문 1 — 왜 시작했는가",
             (620, 170, 280, 320), 3000, 2800,
             "나는 왜 이 일을 시작했는지, 지금 바로 이야기할 수 있으세요?",
             lambda sk: question_mark(sk, 760, 330, 155)),
            ("q2", "두 번째 질문", "질문 2 — 왜 존재하는가",
             (980, 170, 280, 320), 6200, 2400,
             "우리 브랜드는 왜 존재하는가?",
             lambda sk: question_mark(sk, 1120, 330, 155)),
            ("q3", "세 번째 질문", "질문 3 — 왜 선택해야 하는가",
             (1340, 170, 280, 320), 9000, 2400,
             "왜 고객은 우리를 선택해야 하는가?",
             lambda sk: question_mark(sk, 1480, 330, 155)),
            ("book", "책", "해답의 제안",
             (880, 620, 380, 420), 12000, 4400,
             "만약 조금 망설여진다면 이 책을 한번 읽어보셨으면 좋겠습니다.",
             lambda sk: book_closed(sk, 1070, 830, 210, accent=RED)),
            ("bridge", "대표에서 책으로", "연결",
             (480, 650, 360, 280), 16800, 2200,
             "만약 조금 망설여진다면 이 책을 한번 읽어보셨으면 좋겠습니다.",
             lambda sk: arrow(sk, (530, 790), (810, 810), curve=-34)),
        ]),

    dict(
        num=8, name="golden-circle", start=150000, end=185000,
        basis="골든서클 — 바깥 WHAT, 가운데 HOW, 가장 안쪽 WHY.",
        elements=[
            ("what", "바깥 원", "WHAT — 무엇을 파는지",
             (500, 80, 920, 920), 0, 7000,
             "WHAT은 우리가 무엇을 파는지.",
             lambda sk: sk.ellipse(960, 540, 400, width=4)),
            ("how", "가운데 원", "HOW — 어떻게 다르게 하는지",
             (696, 276, 528, 528), 7500, 6500,
             "HOW는 어떻게 다르게 하는지.",
             lambda sk: sk.ellipse(960, 540, 264, width=4)),
            ("why", "가장 안쪽 원", "WHY — 왜 하는지",
             (832, 412, 256, 256), 14500, 7500,
             "그리고 가장 안쪽에 있는 WHY는 왜 하는지입니다.",
             lambda sk: sk.ellipse(960, 540, 128, color=ORANGE, width=5)),
            ("legend", "세 겹의 요약", "정리 — 무엇을, 어떻게, 왜",
             (110, 280, 300, 500), 22500, 7000,
             "무엇을, 어떻게, 그리고 왜.",
             lambda sk: (sk.ellipse(260, 380, 58, width=3),
                         sk.ellipse(260, 540, 58, width=3),
                         sk.ellipse(260, 700, 58, color=ORANGE, width=4))),
        ]),

    dict(
        num=9, name="people-buy-why", start=185000, end=210000,
        basis="사람들은 WHAT이 아니라 WHY를 선택한다.",
        elements=[
            ("crowd", "사람들", "행위 주체 — 고객",
             (140, 380, 560, 430), 0, 6200,
             "사람들은 당신이 무엇을 하는지가 아니라",
             lambda sk: group_of_three(sk, (250, 410, 570), 420, 1.2)),
            ("toward", "향하는 화살표", "선택의 방향",
             (740, 420, 420, 260), 6600, 3200,
             "당신이 왜 하는지를 선택합니다.",
             lambda sk: arrow(sk, (780, 545), (1120, 545))),
            ("core", "브랜드의 WHY", "선택의 대상",
             (1210, 330, 440, 440), 10000, 5400,
             "당신이 왜 하는지를 선택합니다.",
             lambda sk: golden_circle(sk, 1430, 550, 190)),
            ("resonance", "공명", "감정 — 마음이 움직임",
             (1680, 340, 220, 260), 15600, 2400,
             "저는 이 말이 이 책의 핵심을 가장 잘 보여준다고 생각해요.",
             lambda sk: spark(sk, 1780, 470, 74)),
            ("book", "책의 핵심", "출처 재확인",
             (700, 720, 520, 330), 18200, 4600,
             "저는 이 말이 이 책의 핵심을 가장 잘 보여준다고 생각해요.",
             lambda sk: book_open(sk, 960, 880, 400, accent=ORANGE)),
        ]),

    dict(
        num=10, name="what-first-vs-why-first", start=210000, end=235000,
        basis="보통은 WHAT부터 말한다. 책은 WHY부터 말하라고 한다.",
        elements=[
            ("what-speaker", "WHAT부터 말하는 브랜드", "통념",
             (120, 290, 700, 350), 0, 5400,
             "우리는 보통 고객에게 WHAT부터 이야기합니다.",
             lambda sk: (person_bust(sk, 240, 330, 1.4),
                         speech_bubble(sk, 610, 430, 340, 170, tail="left"))),
            ("offer", "제품과 가격", "통념의 내용",
             (120, 700, 700, 330), 5800, 5400,
             "저희는 이런 제품을 판매합니다. 이런 서비스를 제공합니다.",
             lambda sk: (paper_stack(sk, 300, 870, 170), calendar_grid(sk, 630, 860, 190))),
            ("divide", "구분선", "대비의 축",
             (880, 210, 130, 830), 11400, 2200,
             "가격은 얼마고, 이런 혜택이 있습니다.",
             lambda sk: sk.line((945, 250), (945, 1000), width=3)),
            ("why-speaker", "WHY부터 말하는 브랜드", "책의 제안",
             (1060, 290, 760, 350), 13800, 5400,
             "그런데 이 책은 WHY부터 이야기하라고 합니다.",
             lambda sk: (person_bust(sk, 1180, 330, 1.4),
                         speech_bubble(sk, 1550, 430, 340, 170, tail="left"))),
            ("core", "안에서 바깥으로", "제안의 근거",
             (1060, 700, 760, 330), 19400, 4400,
             "그런데 이 책은 WHY부터 이야기하라고 합니다.",
             lambda sk: golden_circle(sk, 1440, 865, 140)),
        ]),

    dict(
        num=11, name="apple-case", start=235000, end=270000,
        basis="애플이 보통 회사처럼 말했다면? 애플은 믿음을 먼저 말하고 제품으로 증명한다.",
        elements=[
            ("book", "책 속 사례", "사례의 출처",
             (120, 310, 470, 310), 0, 3600,
             "책에서는 애플을 예로 들어요.",
             lambda sk: book_open(sk, 355, 470, 400)),
            ("apple", "사과", "사례의 주인공",
             (680, 290, 320, 350), 4000, 3800,
             "만약 애플이 이렇게 말했다면 어떨까요?",
             lambda sk: apple_shape(sk, 840, 470, 92)),
            ("pitch", "제품 설명", "가상의 WHAT 화법",
             (1090, 250, 740, 310), 8000, 5400,
             "우리는 훌륭한 컴퓨터를 만듭니다. 디자인이 예쁘고 사용하기 편합니다.",
             lambda sk: speech_bubble(sk, 1450, 400, 610, 210, tail="left", lines=3)),
            ("product", "컴퓨터", "설명의 대상",
             (1090, 620, 350, 290), 13600, 3400,
             "하나 사시겠어요?",
             lambda sk: laptop(sk, 1265, 790, 240)),
            ("meh", "시큰둥한 반응", "결과 — 마음이 안 움직임",
             (1490, 620, 350, 390), 17200, 4200,
             "글쎄요.",
             lambda sk: person_standing(sk, 1665, 660, 1.3, arms="shrug")),
            ("flip", "순서를 뒤집다", "전환",
             (120, 700, 430, 300), 21600, 3200,
             "그런데 애플은 제품부터 이야기하지 않죠.",
             lambda sk: arrow(sk, (180, 850), (500, 850), color=ORANGE)),
            ("belief", "다르게 생각하는 믿음", "먼저 말하는 WHY",
             (620, 700, 350, 330), 25000, 3600,
             "우리는 다르게 생각합니다.",
             lambda sk: lightbulb(sk, 795, 865, 84)),
        ]),

    dict(
        num=12, name="methods-change-why-stays", start=270000, end=295000,
        basis="방법은 계속 바뀌지만, 왜 하는지는 쉽게 바뀌지 않는다.",
        elements=[
            ("book", "책", "화자의 관점",
             (140, 330, 340, 430), 0, 5400,
             "그래서 저는 이 책을 단순한 마케팅 책이라고 생각하지 않아요.",
             lambda sk: book_closed(sk, 310, 550, 200)),
            ("methods", "계속 바뀌는 방법들", "변수",
             (600, 190, 900, 310), 5800, 6400,
             "릴스 만드는 방법도, 광고 세팅 방법도 계속 바뀝니다.",
             lambda sk: (gear(sk, 730, 345, 58), phone(sk, 1020, 345, 84),
                         cloud(sk, 1340, 335, 240))),
            ("shift", "출렁이는 흐름", "변화의 속성",
             (600, 560, 900, 190), 12400, 3000,
             "릴스 만드는 방법도, 광고 세팅 방법도 계속 바뀝니다.",
             lambda sk: wave_line(sk, 650, 1450, 655, 36, 4)),
            ("anchor", "닻", "상수 — 바뀌지 않는 것",
             (600, 780, 420, 290), 15600, 4200,
             "하지만 내가 왜 이 일을 하는지는 쉽게 바뀌지 않거든요.",
             lambda sk: anchor(sk, 810, 910, 92)),
            ("why", "변하지 않는 중심", "결론",
             (1120, 780, 400, 290), 20000, 4200,
             "방법은 바뀌지만 WHY는 쉽게 바뀌지 않는다.",
             lambda sk: target(sk, 1320, 915, 100)),
        ]),

    dict(
        num=13, name="clear-why-decides", start=295000, end=320000,
        basis="WHY가 선명하면 콘텐츠·고객·상품, 그리고 하지 않을 것까지 정해진다.",
        elements=[
            ("why", "선명한 WHY", "출발점",
             (110, 330, 540, 540), 0, 5400,
             "WHY가 선명하면 어떤 콘텐츠를 만들지,",
             lambda sk: golden_circle(sk, 380, 600, 232)),
            ("content", "콘텐츠", "결정 1",
             (750, 170, 350, 310), 5800, 4200,
             "WHY가 선명하면 어떤 콘텐츠를 만들지,",
             lambda sk: paper_stack(sk, 925, 330, 160)),
            ("customer", "고객", "결정 2",
             (750, 530, 350, 320), 10200, 4200,
             "어떤 고객을 만날지,",
             lambda sk: (person_standing(sk, 855, 570, 1.1),
                         person_standing(sk, 1005, 570, 1.1))),
            ("product", "상품", "결정 3",
             (1190, 170, 350, 310), 14600, 4200,
             "어떤 상품을 만들지,",
             lambda sk: product_box(sk, 1365, 325, 210)),
            ("not-do", "하지 않을 것", "결정 4 — 가장 중요한 것",
             (1190, 530, 350, 320), 18900, 4600,
             "심지어 무엇을 하지 않을지도 결정하기 쉬워집니다.",
             lambda sk: cross_mark(sk, 1365, 690, 78)),
        ]),

    dict(
        num=14, name="find-why-first", start=320000, end=335000,
        basis="복잡해지고 있다면, 더 배우기 전에 WHY부터.",
        elements=[
            ("complex", "복잡해진 상태", "현재 상태",
             (160, 290, 470, 390), 0, 4600,
             "마케팅을 계속 공부하는데도 점점 더 복잡해지고 있다면",
             lambda sk: scribble_tangle(sk, 395, 490, 380, 300, seed=23)),
            ("instead", "대신에", "전환",
             (690, 380, 320, 240), 5000, 2200,
             "마케팅을 계속 공부하는데도 점점 더 복잡해지고 있다면",
             lambda sk: arrow(sk, (730, 500), (970, 500), color=ORANGE)),
            ("compass", "나침반", "해법 — WHY부터",
             (1070, 270, 430, 440), 7600, 5200,
             "새로운 걸 하나 더 배우기 전에 내 브랜드의 WHY부터 찾아보세요.",
             lambda sk: compass(sk, 1285, 490, 155)),
            ("clear", "선명해짐", "결과",
             (1560, 300, 290, 270), 12900, 1400,
             "새로운 걸 하나 더 배우기 전에 내 브랜드의 WHY부터 찾아보세요.",
             lambda sk: spark(sk, 1700, 435, 72)),
        ]),

    dict(
        num=15, name="more-in-the-book", start=335000, end=355000,
        basis="밑줄은 일부일 뿐 — 라이트 형제, 신뢰의 원리, 조직 적용까지.",
        elements=[
            ("underlines", "밑줄 친 책", "보여준 것",
             (230, 290, 640, 390), 0, 6200,
             "제가 오늘 보여드린 건 이 책에 그어놓은 밑줄 중 정말 일부예요.",
             lambda sk: book_open(sk, 550, 490, 540, lines=4, accent=RED)),
            ("wright", "비행기", "책 속 이야기 1 — 라이트 형제",
             (970, 210, 430, 310), 6600, 5000,
             "라이트 형제 이야기부터 신뢰가 만들어지는 원리,",
             lambda sk: biplane(sk, 1185, 400, 1.0)),
            ("trust", "신뢰", "책 속 이야기 2",
             (970, 590, 430, 350), 11800, 4200,
             "라이트 형제 이야기부터 신뢰가 만들어지는 원리,",
             lambda sk: (person_standing(sk, 1080, 630, 1.2),
                         person_standing(sk, 1290, 630, 1.2),
                         spark(sk, 1185, 660, 44))),
            ("org", "조직 적용", "책 속 이야기 3",
             (1460, 280, 400, 520), 16200, 3200,
             "WHY를 조직에 어떻게 적용하는지까지 더 많은 이야기가 들어 있습니다.",
             lambda sk: org_chart(sk, 1660, 320)),
        ]),

    dict(
        num=16, name="who-should-read", start=355000, end=375000,
        basis="사업을 시작하는 분, 방향이 흔들리는 분에게 권한다.",
        elements=[
            ("starter", "시작하는 대표", "대상 1",
             (160, 370, 340, 430), 0, 3600,
             "특히 사업을 시작하시는 분,",
             lambda sk: person_standing(sk, 330, 400, 1.5)),
            ("wobble", "흔들리는 방향", "대상 2",
             (560, 380, 480, 310), 4000, 5400,
             "이미 사업을 하고 있지만 브랜드 방향이 자꾸 흔들리는 분이라면",
             lambda sk: zigzag_path(sk, 610, 610, 980, 470, 6)),
            ("checklist", "추천 체크리스트", "정리 — 이런 분께",
             (1110, 230, 720, 430), 9800, 5600,
             "이미 사업을 하고 있지만 브랜드 방향이 자꾸 흔들리는 분이라면",
             lambda sk: todo_list(sk, 1160, 270, 4, 90, 600)),
            ("book", "권하는 책", "행동 제안",
             (1110, 720, 400, 330), 15600, 3600,
             "한번 읽어보셨으면 좋겠어요.",
             lambda sk: book_closed(sk, 1300, 885, 180, accent=RED)),
        ]),

    dict(
        num=17, name="cta-book", start=375000, end=395000,
        basis="딱 한 권만 추천한다면 이 책. 구매 링크는 설명란에.",
        elements=[
            ("stella", "스텔라", "추천 주체",
             (160, 380, 340, 350), 0, 5400,
             "저는 마케팅 책을 딱 한 권만 추천해달라고 하면 이 책을 추천하겠습니다.",
             lambda sk: person_bust(sk, 320, 410, 1.6)),
            ("book", "스타트 위드 와이", "추천 대상",
             (690, 230, 470, 620), 5800, 5400,
             "스타트 위드 와이.",
             lambda sk: book_closed(sk, 925, 540, 300, accent=RED)),
            ("shine", "강조", "감정 — 확신",
             (1230, 250, 270, 270), 11400, 1800,
             "스타트 위드 와이.",
             lambda sk: spark(sk, 1365, 385, 74)),
            ("link", "설명란 링크", "행동 유도",
             (1230, 590, 620, 420), 13600, 5200,
             "책 구매 링크는 영상 설명란에 남겨둘게요.",
             lambda sk: (arrow(sk, (1450, 640), (1450, 850)),
                         link_box(sk, 1280, 880, 500, 110))),
        ]),

    dict(
        num=18, name="one-question", start=395000, end=410000,
        basis="새 방법을 배우는 대신, 딱 하나만 — 나는 왜 이 일을 하고 있지?",
        elements=[
            ("owner", "대표", "청자",
             (180, 380, 340, 350), 0, 4200,
             "그리고 오늘은 새로운 마케팅 방법 하나 더 배우는 대신",
             lambda sk: person_bust(sk, 340, 410, 1.6)),
            ("skip", "덜어내기", "제안 — 하나 더 배우지 말고",
             (620, 300, 420, 300), 4600, 2400,
             "딱 하나만 생각해보세요.",
             lambda sk: crossed_icon(sk, 830, 450)),
            ("question", "나는 왜 이 일을 하고 있지?", "핵심 질문",
             (1100, 210, 400, 540), 7400, 4200,
             "나는 왜 이 일을 하고 있지?",
             lambda sk: question_mark(sk, 1300, 470, 250)),
            ("answer", "답의 실마리", "여운",
             (1560, 300, 300, 350), 11800, 2600,
             "나는 왜 이 일을 하고 있지?",
             lambda sk: lightbulb(sk, 1700, 460, 72)),
        ]),

    dict(
        num=19, name="outro", start=410000, end=420000,
        basis="직접 읽고 추천하는 책만 가져오겠다는 약속과 인사.",
        elements=[
            ("books", "다음 책들", "약속",
             (250, 330, 460, 430), 0, 4200,
             "다음에도 제가 직접 읽어보고 정말 추천하고 싶은 책만 가져올게요.",
             lambda sk: (book_closed(sk, 400, 560, 150), book_closed(sk, 570, 600, 150))),
            ("wave", "인사하는 스텔라", "마무리 인사",
             (820, 330, 400, 430), 4600, 3200,
             "다음 영상에서 만나요.",
             lambda sk: person_standing(sk, 1020, 380, 1.5, arms="up")),
            ("mark", "브랜드 마크", "여운 — WHY",
             (1360, 350, 400, 400), 7900, 1500,
             "다음 영상에서 만나요.",
             lambda sk: golden_circle(sk, 1560, 550, 170)),
        ]),
]


def build():
    os.makedirs(OUT, exist_ok=True)
    made = []
    for sc in SCENES:
        stem = "scene-%02d-%s" % (sc["num"], sc["name"])
        sk = Sketch(W, H, seed=100 + sc["num"])
        for el in sc["elements"]:
            el[7](sk)
        png = os.path.join(OUT, stem + ".png")
        sk.save(png)

        elements = []
        for i, (eid, label, role, region, start, dur, sub, _fn) in enumerate(sc["elements"], 1):
            x, y, w, h = region
            assert 0 <= x and 0 <= y and x + w <= W and y + h <= H, (stem, eid, region)
            elements.append({
                "id": eid,
                "label": label,
                "sequence": i,
                "narrativeRole": role,
                "subtitle": sub,
                "type": "structure",
                "region": {"x": int(x), "y": int(y), "width": int(w), "height": int(h)},
                "reveal": {
                    "direction": "top_to_bottom",
                    "startMs": int(start),
                    "durationMs": int(dur),
                    "maskPaddingPx": 18,
                    "protectedRegions": [],
                },
                "handPath": {
                    "start": [int(x + w / 2), int(y)],
                    "end": [int(x + w / 2), int(y + h)],
                    "easing": "easeInOut",
                },
            })
        last_end = max(e["reveal"]["startMs"] + e["reveal"]["durationMs"] for e in elements)
        scene_ms = sc["end"] - sc["start"]
        assert last_end + 500 <= scene_ms, (stem, last_end, scene_ms)
        ann = {
            "sceneId": "scene-%02d" % sc["num"],
            "canvas": {"width": W, "height": H},
            "storyBasis": sc["basis"],
            "sceneDurationMs": scene_ms,
            "srtRange": {"startMs": sc["start"], "endMs": sc["end"]},
            "elements": elements,
        }
        with open(os.path.join(OUT, stem + ".annotation.json"), "w", encoding="utf-8") as f:
            json.dump(ann, f, ensure_ascii=False, indent=2)
        made.append((stem, scene_ms, len(elements)))
    total = sum(m[1] for m in made)
    for stem, ms, n in made:
        print("%-42s %6.1fs  요소 %d" % (stem, ms / 1000, n))
    print("장면 %d개 · 합계 %.1fs" % (len(made), total / 1000))


if __name__ == "__main__":
    build()
