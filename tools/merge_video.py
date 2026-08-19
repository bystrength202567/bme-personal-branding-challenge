"""장면 MP4들을 한 편으로 합친다.

srt-whiteboard-animation 의 merge_scenes.py 는 이 환경에서 실패한다
(ffmpeg 바이너리가 없고, PyAV 경로는 출력 스트림의 time_base / 프레임 pts 를
설정하지 않아 mux 에서 EINVAL). 여기서는 프레임 pts 를 직접 매겨 다시 인코딩한다.
"""

import argparse
import os
import sys
from fractions import Fraction

import av


def merge(inputs, output, fps=30, crf="20", preset="medium"):
    probe = av.open(inputs[0])
    vs = probe.streams.video[0]
    w, h = vs.codec_context.width, vs.codec_context.height
    probe.close()

    tb = Fraction(1, fps)
    out = av.open(output, mode="w")
    ost = out.add_stream("libx264", rate=Fraction(fps, 1))
    ost.width, ost.height = w, h
    ost.pix_fmt = "yuv420p"
    ost.time_base = tb
    ost.options = {"crf": crf, "preset": preset}

    n = 0
    for path in inputs:
        cont = av.open(path)
        count = 0
        for frame in cont.decode(video=0):
            if frame.width != w or frame.height != h:
                frame = frame.reformat(width=w, height=h)
            frame.pts = n
            frame.time_base = tb
            n += 1
            count += 1
            for pkt in ost.encode(frame):
                out.mux(pkt)
        cont.close()
        print("  + %-52s %4d 프레임" % (os.path.basename(path), count))
    for pkt in ost.encode(None):
        out.mux(pkt)
    out.close()
    print("합계 %d 프레임 = %.2fs → %s (%.2f MB)"
          % (n, n / fps, output, os.path.getsize(output) / 1e6))


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--inputs", nargs="+", required=True)
    p.add_argument("--output", required=True)
    p.add_argument("--fps", type=int, default=30)
    a = p.parse_args()
    missing = [x for x in a.inputs if not os.path.exists(x)]
    if missing:
        print("[err] 없는 입력: %s" % ", ".join(missing), file=sys.stderr)
        return 1
    merge(a.inputs, a.output, a.fps)
    return 0


if __name__ == "__main__":
    sys.exit(main())
