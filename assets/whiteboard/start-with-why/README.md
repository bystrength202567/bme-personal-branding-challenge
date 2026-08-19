# 『스타트 위드 와이』 추천 영상 — 화이트보드 애니메이션

대본(20씬 / 7분 00초)을 [geeklee/srt-whiteboard-animation](https://github.com/geeklee/srt-whiteboard-animation)
파이프라인으로 손그림 화이트보드 영상으로 만든 결과물입니다.

## 산출물

| 파일 | 설명 |
|---|---|
| `start-with-why.srt` | 대본 전체 자막 75큐 · 00:00–07:00 |
| `scene-NN-*.png` | 장면별 라인아트 (1920×1080, 흰 보드면 + 굵은 검정 마커) |
| `scene-NN-*.annotation.json` | 분구 주석 — 그리는 순서·시각·대응 자막 |
| `scene-NN-*-whiteboard.mp4` | 장면별 성편 (1920×1080 / 30fps) |
| `start-with-why-whiteboard.mp4` | **19장면 합본 · 07:00 최종 영상** (보드 세트에 합성) |
| `../board-stage.png` | 화이트보드 세트 배경 — 벽·알루미늄 프레임·마커 트레이 |
| `../drawing-hand.png` | 펜대 표기를 지운 손 소재 |

## 이 영상의 성격

**무음 비주얼 트랙입니다.** 손이 펜으로 그림을 그려 나가는 화면만 들어 있고,
스텔라 보이스오버·자막·타이포그래피는 편집에서 얹습니다.

### 보드 위 글자 vs 편집 자막

레퍼런스 영상처럼 **핵심 영문 키워드는 보드에 직접 손글씨로 써집니다** —
`START WITH WHY`, `WHAT / HOW / WHY`, `THINK DIFFERENT`, `SO WHAT?`,
`PEOPLE BUY WHY YOU DO IT`, `WHY FIRST` 등. 획 애니메이션으로 한 글자씩 써지는
것처럼 보이도록 굵은 콘덴스드 서체(Boldonse)를 씁니다.

**한글은 보드에 넣지 않았습니다.** 이 환경에 한글 폰트가 없기도 하고, 대본의
한글 문구는 원래 "자막" 지시로 적혀 있어 편집 오버레이가 맞습니다.

### 스타일

- 흰 보드면, 굵은 검정 보드마커 선
- 표정이 있는 만화풍 대표(걱정·시큰둥·환한 표정, 머리 긁는 포즈, 셔츠와 넥타이)
- 휴대폰 앱 그리드, 메일, @, 좋아요, 말풍선, 생각 구름, 성장 화살표, 막대그래프,
  달러, 전구 같은 낙서 아이콘을 빽빽하게 배치
- 강조는 빨강만 아주 드물게 (WHY, 취소선, THINK DIFFERENT)

## 대본 20씬 → 화이트보드 19장면 매핑

| 대본 씬 | 시간 | 화이트보드 장면 | 그려지는 것 |
|---|---|---|---|
| 01+02 | 0:00–0:20 | `scene-01-hook-overload` | 머리 긁는 대표 → 휴대폰·메일·@·좋아요·DM → AI 구름 → 성장 화살표·그래프·달러 → 엉킨 실타래 |
| 03 | 0:20–0:30 | `scene-02-stop` | 으쓱한 대표 → 엉킴 → 물음표 → **STOP** |
| 04 | 0:30–0:50 | `scene-03-intro-stella` | 스텔라 → **17 YEARS** → 자료 더미 → 헤매는 대표·미로 → 과녁 → **EASY** |
| 05 | 0:50–1:05 | `scene-04-the-book` | 권하는 스텔라 → **START WITH WHY** 책 → 반짝임 → 전구 → **WHY** |
| 06 | 1:05–1:40 | `scene-05-know-what-not-why` | 대표 → 할 일 목록 → 릴스·블로그·검색·광고비 → **SO WHAT?** → AI → 흐려짐 → **MORE?** |
| 07 | 1:40–2:10 | `scene-06-different-question` | 펼친 책 → **WHAT** 취소 → **WHY** → 동전 → **RESULT** → 전구·믿음·중심 |
| 08 | 2:10–2:30 | `scene-07-three-questions` | 대표 → 물음표 ×3 → **WHY** → 책 → **READ THIS** |
| 09 | 2:30–3:05 | `scene-08-golden-circle` | **GOLDEN CIRCLE** → **WHAT** 원 → **HOW** 원 → **WHY** 원(빨강) → **INSIDE OUT** |
| 10 | 3:05–3:30 | `scene-09-people-buy-why` | 고객들 → **NOT WHAT** 취소 → 화살표 → 골든서클 → **PEOPLE BUY WHY YOU DO IT** |
| 11 | 3:30–3:55 | `scene-10-what-first-vs-why-first` | **WHAT WE SELL** / 구분선 / **WHY WE EXIST** 대비 |
| 12 | 3:55–4:30 | `scene-11-apple-case` | 책 → 사과 → **WE MAKE GREAT COMPUTERS** → 노트북 → **MEH...** → **THINK DIFFERENT** → **PROOF** |
| 13 | 4:30–4:55 | `scene-12-methods-change-why-stays` | 책 → 바뀌는 방법들 → **CHANGES** → 닻 → **STAYS** → **WHY** 과녁 |
| 14 | 4:55–5:20 | `scene-13-clear-why-decides` | **WHY** → **CONTENT** → **CUSTOMER** → **PRODUCT** → **NOT TO DO** → **CLEAR WHY, CLEAR CHOICES** |
| 15 | 5:20–5:35 | `scene-14-find-why-first` | 엉킴 → **LEARN MORE?** 취소 → 나침반 → **WHY FIRST** |
| 16 | 5:35–5:55 | `scene-15-more-in-the-book` | 밑줄 책 → **JUST A PART** → 비행기 → 신뢰 → 조직도 → **AND MORE** |
| 17 | 5:55–6:15 | `scene-16-who-should-read` | 시작하는 대표 → **JUST STARTED** → 흔들림 → 체크리스트 → 책 → **FOR YOU** |
| 18 | 6:15–6:35 | `scene-17-cta-book` | 스텔라 → **ONLY ONE** → 책 → 화살표 → **LINK BELOW** |
| 19 | 6:35–6:50 | `scene-18-one-question` | 대표 → 덜어내기 → **JUST ONE** → 큰 물음표 → **WHY DO I DO THIS?** |
| 20 | 6:50–7:00 | `scene-19-outro` | 다음 책들 → 인사 → **WHY** 마크 → **STELLA BOOK CLUB** |

## 편집에서 얹을 것

1. **보이스오버** — `start-with-why.srt` 의 타임코드가 그림 순서와 맞춰져 있습니다.
   각 요소는 해당 자막이 나오는 순간에 그려지기 시작합니다.
2. **자막** — SRT를 그대로 유튜브에 올리거나 편집기에서 번인.
3. **한글 타이포 오버레이** — 영문 키워드는 보드에 이미 써지므로, 한글 문구만 얹으면 됩니다:
   - 0:00 `마케팅 공부할수록 더 어려워진다면?`
   - 0:05–0:20 `릴스 ↓ 네이버 ↓ 스레드 ↓ AI ↓ 대행사`
   - 0:26 `잠깐. 공부를 멈춰주세요.`
   - 0:30 `광고학 전공 / 17년차 대기업 마케터 출신`
   - 1:45 `WHAT이 아니라 WHY를 먼저`
   - 2:13–2:25 질문 3줄 (물음표가 그려지는 타이밍에 맞춰 하나씩)
   - 3:05 `People don't buy what you do; they buy why you do it.`
   - 3:36 `❌ WHAT` / 3:47 `⭕ WHY`
   - 4:49 `방법은 바뀌지만 WHY는 쉽게 바뀌지 않는다.`
   - 5:27 `더 배우기 전에 WHY부터.`
   - 6:26 하단 고정 — 쿠팡 파트너스 고지
   - 6:50 `STELLA BOOK CLUB / 마케팅보다 먼저, WHY.`
4. **실사 컷** — 대본의 촬영 체크리스트(정면 토크 / 책 B-roll / 마케팅 B-roll)를
   화이트보드 트랙과 교차 편집. 정면 토크가 필요한 구간(0:20–0:30, 2:10–2:30,
   4:30–4:55, 5:20–5:35)은 화이트보드를 배경으로 깔거나 잠깐 컷어웨이 하세요.

## 저작권 주의

- 사이먼 시넥 TED 강연 클립은 **삽입하지 않았습니다** (CC BY-NC-ND — 수익 링크가
  있는 영상에는 부적합, Content ID 클레임 위험). 핵심 문구만 자막으로 인용하고
  원본 링크는 설명란에 두세요.
- 애플 로고·제품 이미지도 쓰지 않았습니다. 사과와 노트북은 개념 스케치입니다.

## 다시 만들기

```bash
# 1) 렌더 환경 (opencv / numpy / av / Pillow)
python scripts/prepare_env.py            # srt-whiteboard-animation 저장소에서

# 2) 라인아트 + 주석 생성
python tools/build_scenes.py

# 3) 화이트보드 세트 배경 (한 번만)
python tools/stage_board.py assets/whiteboard/board-stage.png

# 4) 전 장면 렌더 → 보드에 합성 → 합본
SW=/path/to/srt-whiteboard-animation JOBS=4 ./tools/render_all.sh
```

장면 구성·타이밍을 바꾸려면 `tools/build_scenes.py` 의 `SCENES` 를 고치거나,
`srt-whiteboard-animation/assets/preview.html` 프리뷰 툴에서 주석을 조정한 뒤 다시 렌더하세요.
