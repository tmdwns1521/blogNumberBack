# 쇼핑몰 웹 서비스 프로젝트

제품들을 조회하고, 장바구니에 추가하고, 또 주문을 할 수 있는 쇼핑몰 웹 서비스 제작 프로젝트입니다. <br />

### http://kdt-sw2-seoul-team08.elicecoding.com/

<br>

1. 회원가입, 로그인, 회원정보 수정 등 **유저 정보 관련 CRUD** 
2. **제품 목록**을 조회 및, **제품 상세 정보**를 조회 가능함. 
3. 장바구니에 제품을 추가할 수 있으며, **장바구니에서 CRUD** 작업이 가능함.
4. 장바구니는 서버 DB가 아닌, 프론트 단에서 저장 및 관리됨 (localStorage)
5. 장바구니에서 주문을 진행하며, **주문 완료 후 조회 및 삭제**가 가능함.
6. **카테고리 별 상품 목록** 확인 가능함.
7. **제품별 리뷰** 기능(제품 구매자만 리뷰 가능함)
8. **인피니티 스크롤**
9. **검색** 기능
10. **소셜 로그인** 기능
11. **회원가입시 이메일 인증** 기능
12. **비밀번호 찾기시** 이메일로 임시 비밀번호를 보내주는 기능
13. 기타 여러 숨은 기능들이 존재합니다..

## 주요 사용 기술

### 1. 프론트엔드

- **Vanilla javascript**, html, css (**Bulma css**)
- Font-awesome 
- Daum 도로명 주소 api 

### 2. 백엔드 

- **Express** (nodemon, babel-node로 실행됩니다.)
- Mongodb, Mongoose
- cors
- passport
- amazon S3
- Google Outh
- kakao Outh

## 폴더 구조
- 프론트: `src/views` 폴더 
- 백: src/views 이외 폴더 전체
- 실행: **프론트, 백 동시에, express로 실행**



## 설치 방법

1. **.env 파일 설정 (MONGODB_URL 환경변수를, 개인 로컬 혹은 Atlas 서버 URL로 설정해야 함)**

2. express 실행

```bash
# npm 을 쓰는 경우 
npm install
npm run start

# yarn 을 쓰는 경우
yarn
yarn start
```

<br>

---

본 프로젝트에서 제공하는 모든 코드 등의는 저작권법에 의해 보호받는 ㈜엘리스의 자산이며, 무단 사용 및 도용, 복제 및 배포를 금합니다.
Copyright 2022 엘리스 Inc. All rights reserved.

# sslPage
# sslPage
# sslPage
# sslPage
