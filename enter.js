import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getDatabase,
  ref,
  update,
  get,
  child,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAWWeIHatcjbZJ_G4qTGE5AIib0uLkcJHc",
  authDomain: "pard-shortkathon.firebaseapp.com",
  databaseURL: "https://pard-shortkathon-default-rtdb.firebaseio.com",
  projectId: "pard-shortkathon",
  storageBucket: "pard-shortkathon.appspot.com",
  messagingSenderId: "859662382781",
  appId: "1:859662382781:web:a2be9af9ac9118c988a9d4",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const teams = [
  {
    name: "1조",
    members: ["최수원", "장주영", "김우현", "유수민", "김세현", "이수인"],
  },
  {
    name: "2조",
    members: [
      "김지안",
      "강서영",
      "김수빈",
      "강신엽",
      "정민찬",
      "지석영",
      "김하진",
    ],
  },
  {
    name: "3조",
    members: [
      "김규리",
      "이채정",
      "김민준",
      "이유현",
      "김도원",
      "조성준",
      "김민규",
    ],
  },
  {
    name: "4조",
    members: [
      "김희민",
      "김하경",
      "박경민",
      "도현학",
      "최준영",
      "현승훈",
      "김나임",
    ],
  },
  {
    name: "5조",
    members: [
      "이지환",
      "김규희",
      "이서현",
      "김도경",
      "김지원",
      "김사랑",
      "김민제",
    ],
  },
];

window.submitName = async function submitName() {
  const nameInput = document.getElementById("participantName");
  const name = nameInput.value.trim();
  const messageElement = document.getElementById("message");

  if (name) {
    const teamIndex = teams.findIndex((team) => team.members.includes(name));

    if (teamIndex !== -1) {
      const teamRef = ref(database, `teams/${teamIndex}/currentMembers`);

      try {
        const snapshot = await get(teamRef);
        const currentMembers = snapshot.val()
          ? Object.values(snapshot.val())
          : [];

        if (!currentMembers.includes(name)) {
          // 이름이 없을 경우에만 추가
          const updates = { [`${Date.now()}`]: name };
          await update(teamRef, updates);
          messageElement.textContent = `${teams[teamIndex].name}에 성공적으로 등록되었습니다!`;
          nameInput.value = ""; // 입력 필드 비우기
        } else {
          messageElement.textContent = "이미 등록된 이름입니다.";
        }
      } catch (error) {
        console.error("Error reading current members", error);
        messageElement.textContent =
          "등록 중 오류가 발생했습니다. 다시 시도하세요.";
      }
    } else {
      messageElement.textContent = "입력한 이름이 팀 멤버 목록에 없습니다.";
    }
  } else {
    messageElement.textContent = "이름을 입력하세요.";
  }
};
