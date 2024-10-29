import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

const firebaseConfig = { /* Firebase 구성 정보 */ };
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const teams = [
  { name: "1조", members: ["최수원", "장주영", "김우현", "유수민", "김세현", "이수인"] },
  // 다른 팀들도 동일하게 정의
];

window.submitName = function submitName() {
  const nameInput = document.getElementById("participantName");
  const name = nameInput.value.trim();
  const messageElement = document.getElementById("message");

  if (name) {
    const teamIndex = teams.findIndex((team) => team.members.includes(name));

    if (teamIndex !== -1) {
      const teamRef = ref(database, `teams/${teamIndex}/currentMembers`);
      
      // 현재 팀의 멤버 목록을 가져온 후 중복 확인
      get(teamRef).then((snapshot) => {
        const currentMembers = snapshot.val() ? Object.values(snapshot.val()) : [];
        if (!currentMembers.includes(name)) {
          currentMembers.push(name);
          set(teamRef, currentMembers).then(() => {
            messageElement.textContent = `${teams[teamIndex].name}에 성공적으로 등록되었습니다!`;
            nameInput.value = ""; // 입력 필드 비우기
          });
        } else {
          messageElement.textContent = "이미 등록된 이름입니다.";
        }
      }).catch((error) => {
        console.error("Error reading current members", error);
        messageElement.textContent = "등록 중 오류가 발생했습니다. 다시 시도하세요.";
      });
    } else {
      messageElement.textContent = "입력한 이름이 팀 멤버 목록에 없습니다.";
    }
  } else {
    messageElement.textContent = "이름을 입력하세요.";
  }
};
