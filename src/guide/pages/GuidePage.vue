<template>
  <div class="guide-container">
    <h1>설문조사 가이드라인</h1>
    <p>
      안녕하십니까? SK Networks Family AI Camp 1기 <strong>팀 🎯'AIM Sniper'</strong>입니다.<br />
      팀 AIM Sniper에서는 <strong>취준생 분들의 고충을 해소하는 서비스</strong>를 준비하고 있습니다.
    </p>

    <p>
      본 서비스는 9월 20일부터 9월 27일까지의 1차 개발 모습입니다.<br />
      서비스의 개괄적인 흐름을 보여드리고자, 러프한 웹 서비스를 오픈하여 제공해드린단 점 양해 말씀 드립니다.
    </p>
    <br>
    <h2>※ 서비스 가이드라인</h2>
    <ul class="guideline-list">
      <li>
        0️⃣ <strong>로그인을 하시면 더 다양한 기능을 이용하실 수 있습니다!</strong><br />
        로그인을 원하시면 회원가입 또는 <strong>💛카카오톡💛 소셜 로그인을 진행</strong>해주세요!
      </li>
      <li>
        1️⃣ 홈 화면에서 ☺️<strong>팀의 분위기</strong>☺️를 즐겨주세요!
      </li>
      <li>
        2️⃣ <strong>🏢기업 분석 보고서🏢 구경</strong>하기 버튼을 눌러서, 제공 서비스의 항목을 살펴보세요!
      </li>
      <li>
        3️⃣ 메뉴 바에서 원하시는 서비스를 이용해 보세요!
      </li>
    </ul>
    <br><br>
    <p>
      본 설문은 개발에 앞서, <strong>필요한 기능 및 UI에 대한 의견 조사를 목적</strong>으로 하고 있습니다.<br />
      설문 문항은 총 5개로, <strong>사용 경험을 있는 그대로 응답</strong>해주시면 됩니다.
    </p>

    <p>
      바쁘시더라도 잠시만 시간을 내주시어 ⭐<strong>설문⭐에 응답해 주시면 향후 개발된 서비스를 준비하는 데에 귀중한 자료로 활용</strong>하겠습니다.<br />
      귀중한 시간을 내어주심에 감사하여, 팀프로젝트를 하시면서 조사가 필요하실 때 요청주시면 저희 팀 구성원 모두가 적극 협조하겠습니다. 🙌
    </p>

    <p class="disclaimer">
      (※ 본 설문에서는 응답해주신 내용들은 통계법 제 33조와 제 34조에 의해 통계적인 목적으로만 사용됩니다.)
    </p>
  </div>
</template>

<style scoped>
.guide-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: #333;
}

h1 {
  text-align: center;
  font-size: 28px;
  margin-bottom: 20px;
}

h2 {
  font-size: 24px;
  margin-top: 20px;
  color: #1c1d1e;
}

/* 스타일을 추가한 부분 */
.guideline-list {
  background-color: #d7dada; /* 배경색 설정 */
  border-radius: 10px; /* 둥근 모서리 설정 */
  padding: 20px; /* 내부 패딩 설정 */
  margin-top: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  list-style-type: none; /* 기본 점 스타일 제거 */
}

.guideline-list li {
  margin-bottom: 15px; /* 리스트 항목 간 간격 설정 */
}

ul li:before {
  content: "• ";
  color: #2196F3;
}

p {
  margin-bottom: 16px;
}

.disclaimer {
  font-size: 14px;
  color: #666;
  margin-top: 30px;
}
</style>
