"""각 장면에서 영역(region) 밖으로 삐져나간 잉크를 찾는다.

렌더러는 요소의 region 안쪽만 그리므로, region 밖의 획은 완성본에서 잘려 나간다.
글자가 영역을 넘치는 경우를 잡기 위한 검사.
"""

import json
import os
import sys

import numpy as np
from PIL import Image

DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                   "assets", "whiteboard", "start-with-why")


def main():
    bad = 0
    for png in sorted(f for f in os.listdir(DIR) if f.endswith(".png")):
        stem = png[:-4]
        ann_path = os.path.join(DIR, stem + ".annotation.json")
        if not os.path.exists(ann_path):
            continue
        ann = json.load(open(ann_path, encoding="utf-8"))
        img = np.array(Image.open(os.path.join(DIR, png)).convert("L"))
        ink = img < 170

        covered = np.zeros_like(ink)
        for el in ann["elements"]:
            r = el["region"]
            p = el["reveal"].get("maskPaddingPx", 0)
            y0, y1 = max(0, r["y"] - p), min(ink.shape[0], r["y"] + r["height"] + p)
            x0, x1 = max(0, r["x"] - p), min(ink.shape[1], r["x"] + r["width"] + p)
            covered[y0:y1, x0:x1] = True

        outside = ink & ~covered
        n = int(outside.sum())
        if n > 40:
            bad += 1
            ys, xs = np.nonzero(outside)
            print("[!] %-42s 영역 밖 잉크 %6d px  x %d..%d  y %d..%d"
                  % (stem, n, xs.min(), xs.max(), ys.min(), ys.max()))
            # 어느 요소 근처인지 힌트
            for el in ann["elements"]:
                r = el["region"]
                near = ((xs >= r["x"] - 140) & (xs <= r["x"] + r["width"] + 140) &
                        (ys >= r["y"] - 140) & (ys <= r["y"] + r["height"] + 140)).sum()
                if near > n * 0.3:
                    print("      ↳ %s (%s)" % (el["id"], el["label"]))
    print("문제 장면 %d개" % bad)
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
