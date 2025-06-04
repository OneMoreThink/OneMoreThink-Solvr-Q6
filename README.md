# 수면 기록 관리 애플리케이션

수면 시간을 기록하고 관리할 수 있는 모바일 친화적인 웹 애플리케이션입니다.

## 주요 기능

- 수면 시간 및 특이사항 기록
- 수면 기록 목록 조회
- 수면 기록 수정 및 삭제

## 기술 스택

### Frontend
- **React**: 사용자 인터페이스 구축을 위한 라이브러리
- **TypeScript**: 타입 안정성을 위한 정적 타입 지원
- **Tailwind CSS**: 유틸리티 기반의 CSS 프레임워크
- **Vite**: 빠른 개발 환경과 빌드 도구

### Backend
- **Node.js**: 서버 런타임 환경
- **Fastify**: 고성능 웹 프레임워크
- **Drizzle ORM**: TypeScript 기반의 데이터베이스 ORM
- **SQLite**: 경량 데이터베이스

## 기술 스택 선택 이유

### Frontend
- **React**: 컴포넌트 기반 개발과 가상 DOM을 통한 효율적인 렌더링
- **TypeScript**: 타입 안정성으로 개발 시 발생할 수 있는 오류 사전 방지
- **Tailwind CSS**: 빠른 UI 개발과 일관된 디자인 시스템 구축
- **Vite**: 빠른 개발 서버와 최적화된 빌드 성능

### Backend
- **Fastify**: Express보다 빠른 성능과 낮은 메모리 사용량
- **Drizzle ORM**: TypeScript와의 완벽한 통합과 타입 안정성
- **SQLite**: 설정이 간단하고 파일 기반으로 관리가 용이

## 구현 사항

### Frontend
- React 컴포넌트 기반 UI 구현
  - 수면 기록 목록 컴포넌트
  - 수면 기록 입력/수정 폼 컴포넌트
  - 반응형 디자인 적용
- 데이터 유효성 검증
  - 수면 시간 24시간 제한
  - 미래 날짜 입력 제한
  - 필수 입력 필드 검증
- 사용자 경험 개선
  - 성공/에러 메시지 표시
  - 로딩 상태 표시
  - 직관적인 폼 레이아웃

### Backend
- RESTful API 구현
  - 수면 기록 CRUD 엔드포인트
  - 에러 처리 및 응답 포맷팅
- 데이터베이스 설계
  - SQLite 스키마 설계
  - Drizzle ORM을 통한 데이터 접근
- 비즈니스 로직 구현
  - 데이터 유효성 검증
  - 트랜잭션 처리
  - 에러 핸들링

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
