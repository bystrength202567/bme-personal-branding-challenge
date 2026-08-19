"""화이트보드 렌더용 손 소재에서 펜대의 문자를 지운다.

srt-whiteboard-animation 의 assets/drawing-hand.png 는 펜대에 저작자 표기가
찍혀 있다. 스킬 문서는 사용자가 명시적으로 요청한 경우에만 이 표기를 남기라고
하므로, 한국어 영상용으로는 지운 사본을 만들어 쓴다. 원본은 건드리지 않는다.
"""

import sys

import cv2
import numpy as np
from PIL import Image


def clean(src, dst):
    im = Image.open(src).convert("RGBA")
    rgba = np.array(im)
    rgb = rgba[..., :3]
    alpha = rgba[..., 3]

    mn = rgb.min(axis=2).astype(int)
    mx = rgb.max(axis=2).astype(int)
    # 펜대의 흰 몸통: 불투명 + 매우 밝음 + 무채색
    white = ((alpha > 0) & (mn > 185) & ((mx - mn) < 35)).astype(np.uint8)

    # 글자 구멍을 메워 몸통 전체를 하나의 영역으로
    closed = cv2.morphologyEx(white, cv2.MORPH_CLOSE,
                              cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (45, 45)))
    cnts, _ = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not cnts:
        raise SystemExit("[err] 펜대 몸통을 찾지 못했습니다.")
    body = np.zeros_like(white)
    cv2.drawContours(body, [max(cnts, key=cv2.contourArea)], -1, 1, thickness=cv2.FILLED)
    # 몸통 외곽선은 남기고 안쪽만 대상으로
    inner = cv2.erode(body, np.ones((7, 7), np.uint8), iterations=1)

    gray = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY)
    text = ((gray < 155) & (inner > 0)).astype(np.uint8)
    text = cv2.dilate(text, np.ones((5, 5), np.uint8), iterations=1)
    text = (text & inner).astype(np.uint8)
    print("지울 픽셀: %d" % int(text.sum()))

    fixed = cv2.inpaint(cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR), text * 255, 7, cv2.INPAINT_TELEA)
    rgba[..., :3] = cv2.cvtColor(fixed, cv2.COLOR_BGR2RGB)
    Image.fromarray(rgba).save(dst)
    print("저장: %s" % dst)


if __name__ == "__main__":
    clean(sys.argv[1], sys.argv[2])
