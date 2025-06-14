# 수면 기록 관리 애플리케이션

수면 시간을 기록하고 관리할 수 있는 모바일 친화적인 웹 애플리케이션입니다.

## 주요 기능

- 수면 시간 및 특이사항 기록
- 수면 기록 목록 조회
- 수면 기록 수정 및 삭제
- 수면 통계 및 분석
  - 최근 7일간 수면 시간 추이 그래프
  - 평균 수면 시간 표시
  - 수면 목표 달성률 (7-9시간 권장 수면 시간 기준)
- AI 기반 수면 진단 및 조언
  - 수면 패턴 분석
  - 개인화된 수면 개선 조언
  - 수면 품질 평가

## 현재 진행 상황

### 완료된 기능
1. 기본 CRUD 기능
   - 수면 기록 생성
   - 수면 기록 조회
   - 수면 기록 수정
   - 수면 기록 삭제

2. 수면 통계 기능 (구현 중)
   - 평균 수면 시간 계산
   - 최근 7일간 수면 시간 추이 그래프
   - 수면 목표 달성률 계산 (7-9시간 기준)
   - 도넛 차트를 통한 시각화

3. 프론트엔드 UI
   - 반응형 디자인 적용
   - Material-UI 컴포넌트 활용
   - Recharts를 통한 데이터 시각화
   - 로딩 상태 및 에러 처리

### 현재 이슈
1. 수면 통계 기능
   - API는 정상적으로 응답하나 프론트엔드에서 데이터가 제대로 표시되지 않음
   - 수면 목표 달성률 계산 로직 개선 필요
   - 통계 데이터 시각화 컴포넌트 최적화 필요

2. AI 분석 기능
   - 기본 API 엔드포인트 구현 (`/api/ai/analyze/:id`)
   - 프론트엔드 연동 준비
   - 에러 처리 및 폴백(fallback) 구현

### 남은 작업
1. 수면 통계 기능 개선
   - 데이터 처리 로직 수정
   - 프론트엔드-백엔드 데이터 동기화
   - 통계 컴포넌트 성능 최적화

2. AI 분석 기능 완성
   - Google AI Studio Gemini API 연동
   - 수면 패턴 분석 로직 구현
   - 개인화된 조언 생성 시스템 구축
   - 수면 품질 평가 알고리즘 개발

3. 성능 최적화
   - API 응답 시간 개선
   - 프론트엔드 렌더링 최적화
   - 데이터 캐싱 구현

4. 추가 기능
   - 알림 및 리마인더 기능
   - 수면 목표 설정 기능
   - 수면 패턴 분석 리포트
   - 데이터 내보내기/가져오기

5. 테스트 및 문서화
   - 단위 테스트 작성
   - 통합 테스트 구현
   - API 문서 작성
   - 사용자 가이드 작성

## 기술 스택

### Frontend
- **React**: 사용자 인터페이스 구축을 위한 라이브러리
- **TypeScript**: 타입 안정성을 위한 정적 타입 지원
- **Tailwind CSS**: 유틸리티 기반의 CSS 프레임워크
- **Vite**: 빠른 개발 환경과 빌드 도구
- **Recharts**: 데이터 시각화를 위한 차트 라이브러리
- **Material-UI**: UI 컴포넌트 라이브러리

### Backend
- **Node.js**: 서버 런타임 환경
- **Fastify**: 고성능 웹 프레임워크
- **Drizzle ORM**: TypeScript 기반의 데이터베이스 ORM
- **SQLite**: 경량 데이터베이스
- **Google AI Studio**: Gemini API를 통한 AI 기능 제공

## 프로젝트 구조

```
├── client/                 # 프론트엔드
│   ├── src/
│   │   ├── components/    # React 컴포넌트
│   │   ├── services/      # API 서비스
│   │   └── types/         # TypeScript 타입 정의
│   └── package.json
│
└── server/                 # 백엔드
    ├── src/
    │   ├── controllers/   # API 컨트롤러
    │   ├── services/      # 비즈니스 로직
    │   ├── db/           # 데이터베이스 설정
    │   ├── ai/           # AI 관련 로직
    │   └── index.ts      # 서버 진입점
    └── package.json
```

## API 엔드포인트

### 수면 기록
- GET /sleep-records - 모든 수면 기록 조회
- GET /sleep-records/:id - 특정 수면 기록 조회
- POST /sleep-records - 새로운 수면 기록 생성
- PUT /sleep-records/:id - 수면 기록 수정
- DELETE /sleep-records/:id - 수면 기록 삭제
- GET /sleep-records/stats - 수면 통계 조회

### AI 진단 및 조언
- POST /api/ai/analyze/:id - 수면 패턴 분석 및 조언 요청 (구현 중)
- GET /api/ai/advice - 저장된 AI 조언 조회 (예정)

## 다음 단계
1. AI 분석 기능 구현 완료
   - Gemini API 연동
   - 수면 패턴 분석 로직 구현
   - 개인화된 조언 생성

2. 테스트 작성
   - 단위 테스트
   - 통합 테스트
   - E2E 테스트

3. 성능 최적화
   - API 응답 시간 개선
   - 프론트엔드 렌더링 최적화
   - 데이터 캐싱 구현

4. 문서화
   - API 문서 작성
   - 사용자 가이드 작성
   - 개발자 문서 작성
