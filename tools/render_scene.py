"""장면 하나를 흰 보드면으로 렌더링한다.

srt-whiteboard-animation 의 render_stream_whiteboard.py 는 캔버스 바탕색이
`#F6F1E3`(미색 종이)로 고정되어 있고 이를 바꿀 CLI 옵션이 없다. 이 영상은 흰
화이트보드가 배경이므로, 렌더러가 Config 를 만들 때 흰색이 들어가도록 감싼다.

사용법은 원본 스크립트와 동일하다:
    SW=<스킬경로> python tools/render_scene.py <이미지> <주석> <출력mp4> <손PNG> [옵션...]
"""

import os
import sys

CANVAS_HEX = "#FFFFFF"


def main():
    sw = os.environ.get("SW")
    if not sw:
        print("[err] 환경변수 SW 에 srt-whiteboard-animation 경로를 지정하세요.",
              file=sys.stderr)
        return 2
    sys.path.insert(0, os.path.join(sw, "scripts"))

    import stream_render as sr
    import render_stream_whiteboard as rsw

    original = sr.Config

    def white_config(**kw):
        kw.setdefault("canvas_hex", CANVAS_HEX)
        return original(**kw)

    # rsw 는 호출 시점에 sr.Config 를 조회하므로 모듈 속성 교체로 충분하다.
    sr.Config = white_config
    return rsw.main(sys.argv[1:])


if __name__ == "__main__":
    sys.exit(main())
