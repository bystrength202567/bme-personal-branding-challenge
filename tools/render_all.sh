#!/usr/bin/env bash
# 19개 장면을 1920x1080 / 30fps 로 렌더링하고 한 편으로 합친다.
set -euo pipefail
SW="${SW:?srt-whiteboard-animation 경로를 SW 로 지정하세요}"
PY="$SW/.venv/bin/python"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIR="$ROOT/assets/whiteboard/start-with-why"
HAND="$ROOT/assets/whiteboard/drawing-hand.png"  # 펜대 표기를 지운 사본
JOBS="${JOBS:-4}"

render_one() {
  local png="$1"
  local stem="${png%.png}"
  "$PY" "$SW/scripts/render_stream_whiteboard.py" \
      "$png" "$stem.annotation.json" "$stem-whiteboard.mp4" \
      "$HAND" \
      --ink-path skeleton --color-fill contour-wipe \
      --cap-long-edge 1920 --fps 30 >"$stem.renderlog" 2>&1 \
    && echo "[ok] $(basename "$stem")" \
    || { echo "[FAIL] $(basename "$stem")"; tail -5 "$stem.renderlog"; return 1; }
}
export -f render_one
export PY SW HAND

ls "$DIR"/scene-*.png | sort | xargs -P "$JOBS" -I{} bash -c 'render_one "$@"' _ {}

mapfile -t MP4S < <(ls "$DIR"/scene-*-whiteboard.mp4 | sort)
echo "합칠 장면: ${#MP4S[@]}개"
# merge_scenes.py 는 이 환경에서 실패한다(ffmpeg 없음 + PyAV pts 미설정) → 자체 병합 사용
"$PY" "$ROOT/tools/merge_video.py" --inputs "${MP4S[@]}" \
    --output "$DIR/start-with-why-whiteboard.mp4"
