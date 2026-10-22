# Our-Frequency · 과제 제출판

질문 응답과 사주 입력을 바탕으로 결과를 시각화하고, 두 결과의 궁합을 살펴보는 웹 프로젝트입니다.

## 본 프로젝트와의 관계

이 저장소는 과제 제출을 위해 다시 만든 버전입니다. 본 프로젝트는 [Our-Frequency_org](https://github.com/K-Lunatic/Our-Frequency_org)에서 관리하며, 원본 저장소가 비공개라면 접근 권한이 필요합니다. 이 저장소는 제출 범위의 구현과 구조를 설명합니다.

## 사용 흐름

홈 → 질문 응답 또는 사주 입력 → 결과 리포트 → 궁합 비교

- 홈의 3D 장면과 결과 시각화로 탐색 경험을 구성합니다.
- 사주·결과·궁합 계산을 화면 컴포넌트와 별도 엔진으로 나눴습니다.
- 결과 공유에 사용하는 코드 변환 로직을 공통 훅으로 분리했습니다.

## 구조

| 경로 | 역할 |
|---|---|
| [src/pages](src/pages) | 홈·입력·결과·궁합 페이지 |
| [src/features/saju](src/features/saju) | 사주 입력과 계산 |
| [src/features/test](src/features/test) | 질문 진행과 응답 분석 |
| [src/features/result](src/features/result) | 결과 리포트 |
| [src/features/synergy](src/features/synergy) | 궁합 입력과 비교 |
| [src/shared](src/shared) | 공통 UI·시각화·계산 도구 |

**기술:** React · TypeScript · Vite · React Three Fiber · Three.js

## 실행

```bash
npm ci
npm run dev
```

터미널에 표시되는 로컬 주소로 접속합니다.

## 확인 방법

```bash
npm run build
npm run lint
```

위 명령은 확인 방법이며, 이 문서 정리에서 통과 결과를 새로 측정한 것은 아닙니다.

질문 완료, 사주 입력, 결과 이동, 궁합 비교, 새로고침 후 상태를 각각 확인합니다. 해석 결과는 서비스의 콘텐츠이며 과학적 예측 정확도를 검증한 결과가 아닙니다.
