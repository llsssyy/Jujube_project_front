## React와 Node.js를 이용한 SNS 프로그램 Project

---

![image14.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4b5586b7-f187-4e65-8bba-cb9af3b94c07/ad4800ac-ca0e-4160-8aa8-3212f05fe7b9/image14.png)

## 1️⃣ 프로젝트 개요

1. **주제:**
    - **SNS** 서비스 구현
2. **선정 배경 및 기획 의도:**
    - 다양한 관심사를 지닌 동시에 **레트로**와 **트랜디함**을 좋아하는 **MZ세대에게 어필하는 SNS서비스**를 만들고 싶었다.
3. **프로젝트 내용**:
    - **친구 중심**으로 **소통**할 수 있는 **SNS**서비스
4. **활용 방안 및 기대 효과:**
    - 새로운 **커뮤니케이션** 및 **소통 채널**을 제공한다.
    - **온라인 커뮤니티 활성화** 및 **사회적 소통** 증진에도 기여할 것으로 기대된다.

## 2️⃣ 프로젝트 구성

![제목 없음.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4b5586b7-f187-4e65-8bba-cb9af3b94c07/d3e6e282-7db0-4d32-acca-2149cd6e5e54/%EC%A0%9C%EB%AA%A9_%EC%97%86%EC%9D%8C.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/4b5586b7-f187-4e65-8bba-cb9af3b94c07/2fcd810d-0689-49af-b4dc-8b02202455c3/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/4b5586b7-f187-4e65-8bba-cb9af3b94c07/f46724fc-a5fb-4413-bdf3-73dd358a295c/Untitled.png)

- **클라이언트**에게 요청을 받은 후 **React-Router로 매핑처리**, **서비스 로직**을 구현하는 기본적인 **MVC 구조**로 프로젝트를 설계하였음.

## 3️⃣ 핵심기능

### 1. Inquirer 라이브러리를 이용한 CLI프로그램

![캡처.PNG](https://prod-files-secure.s3.us-west-2.amazonaws.com/4b5586b7-f187-4e65-8bba-cb9af3b94c07/19c7fc97-1399-413f-b6cb-f89d5c5dc6b9/%EC%BA%A1%EC%B2%98.png)

- **포스트맨 API**를 사용하는 대신, 간단한 **CLI프로그램**을 개발하여 **데이터베이스 서버 연결을 테스트** 하였음
    - **Inquirere** 라이브러리를 이용하여 **회원정보 CRUD 기능**을 구현.

### 2. 멤버 서비스

![image13.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4b5586b7-f187-4e65-8bba-cb9af3b94c07/74bd04b2-7cc5-45a3-b426-997fc8660857/image13.png)

- **일반 로그인**과 **구글 인증 로그인**을 구현하였음.
- **JWT인증 및 인가** 기능을 구현하여 **Token**의 **유효시간**이 만료되면 서비스를 이용할 수 없고, **재 로그 인** 후 서비스를 이용 할 수 있게끔 구현하였음.

### 3. 스토리(게시글) 관련 기능

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/4b5586b7-f187-4e65-8bba-cb9af3b94c07/4c5e9878-0dcc-417d-8e06-f26084788b5c/Untitled.png)

- 스토리 **작성**
    - 원하는 **사진**을 선택 후, **공개여부**를 전체공개, 일촌공개, 비공개(나만보기) **세가지**로 나누어서 스토리를 작성하는 기능 구현.
    
    ![image16.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4b5586b7-f187-4e65-8bba-cb9af3b94c07/985ae56a-1ba3-47f7-b977-59af00fd58a2/image16.png)
    
- 스토리 **가져오기**
    - **로그인된 ID**를 기준으로 **본인의 게시물**과 **친구들**의 전체공개 게시물 및 일촌공개 게시물이 게시물 작성 날짜 기준 **내림차순**으로 정렬되게 하였음.
    
    ![image19.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4b5586b7-f187-4e65-8bba-cb9af3b94c07/f720e67f-a7bc-4696-a733-0b83c637f83d/image19.png)
    
- 스토리 **수정**
    - 내 스토리의 사진 및 글 내용, 공개여부를 수정할 수 있다.
    
    ![image20.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4b5586b7-f187-4e65-8bba-cb9af3b94c07/1c349e65-cc3d-4a0d-85e6-79670cf2daf0/image20.png)
    
    - 또한 기능을 구현 할 때, **fs_extra module**을 이용하여 게시글의 사진 **삭제** 및 **추가** 시 **서버에 저장된 디렉토리에**서도 사진이 **저장** 및 **삭제** 되게 구현하였음.
- 스토리 **삭제**
    - 추후에 **휴지통** 기능을 구현하기 위해 **데이터베이스**에서 스토리가 삭제 되지 않고 **table**에 **column**값을 추가해 **삭제 대기 상태**로 들어가게 설계하였음.

### 3. 댓글 및 좋아요 기능

![image16.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4b5586b7-f187-4e65-8bba-cb9af3b94c07/985ae56a-1ba3-47f7-b977-59af00fd58a2/image16.png)

- **좋아요 버튼**을 눌렀을 시 **실시간**으로 하트 아이콘이 빨갛게 변경되어 친구의 스토리에 **좋아요**를 눌렀는지 간편하게 확인 가능.
    
    ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/4b5586b7-f187-4e65-8bba-cb9af3b94c07/4ac0b1cd-3943-4f7a-be2b-f66bb9592462/Untitled.png)
    
    ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/4b5586b7-f187-4e65-8bba-cb9af3b94c07/44466b02-e233-4ecb-b963-71641c8243fd/Untitled.png)
    
    ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/4b5586b7-f187-4e65-8bba-cb9af3b94c07/257ccf9b-ac1b-48d5-85fb-d54e5d54ac69/Untitled.png)
    
    ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/4b5586b7-f187-4e65-8bba-cb9af3b94c07/b383064c-0bb1-4bdf-8c6f-f291be712c1e/Untitled.png)
    
- **댓글** 및 **대댓글** 작성 기능
    - **axios** 비동기 통신을 사용하여 모든 **댓글** 및 **좋아요** **이벤트**마다 **실시간**으로 **컴포넌트**가 **렌더링** 되게 설계하였음.

### 3. 일촌(친구) 관련 서비스

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/4b5586b7-f187-4e65-8bba-cb9af3b94c07/89fa0ee2-e524-4431-897c-f6836b3ec420/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/4b5586b7-f187-4e65-8bba-cb9af3b94c07/be45b9bf-dc80-4da4-bfa2-8f4cfec7d530/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/4b5586b7-f187-4e65-8bba-cb9af3b94c07/3e2faae3-657e-443c-9678-e06478f3a583/Untitled.png)

- **친구 검색** 및 **친구신청** 기능 구현.
    - 원하는 일촌명(별명)을 입력하여 친구 신청을 할 수 있다.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/4b5586b7-f187-4e65-8bba-cb9af3b94c07/0c7fd1d2-c7c7-4f0d-92ce-afc31d0c978b/Untitled.png)

- **친구들**의 **목록** 확인 및 내가 **보낸 신청**, **받은 신청**을 확인할 수 있음

## 4️⃣ 프로젝트 파일

[jujube_back.zip](https://drive.google.com/file/d/1d0jVj5-03J2esYr7OTKiZmkeRmxt-F2Y/view?usp=sharing)

[jujube_front.zip](https://drive.google.com/file/d/1Ti3kADJUkStQ9IQr1Y_xv2TnWotSCHkL/view?usp=sharing)

[4조 3차 프로젝트 결과보고서.pptx](https://drive.google.com/file/d/1qmev737MtkmbmRpsh9HxTRCenc57hIg8/view?usp=sharing)

## 5️⃣ 시연 영상

https://youtu.be/vazF5oswtJk

## 6️⃣ 맡은 역할

- **스토리(게시글)** 및 **좋아요**, **댓글** 관련 **전체 Back-end 작업**, **DB작업**

## 7️⃣ 프로젝트를 진행하면서 느꼈던 점

- **JWT 인증**에 대하여 공부할 수 있는 시간이 되었고, **트랜젝션**을 이용한 설계는 **복잡한 시스템**에서도 **안정성과 신뢰성**을 높이는 데 매우 유용하다는 것을 깨달았다. 이 경험을 통해 **데이터베이스** **설계** 및 **운영**에 대한 자신감을 얻게 되었고, 앞으로도 **데이터 일관성**과 **무결성**이 중요한 프로젝트에서 **트랜젝션**을 적극 활용할 계획이다.
