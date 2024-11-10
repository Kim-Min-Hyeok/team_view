import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getDatabase,
  ref,
  update,
  get,
  onValue,
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
    currentMembers: [],
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
    currentMembers: [],
  },
  {
    name: "3조",
    members: [
      "김규리",
      "이채정",
      "김민준",
      "이유현",
      "최준영",
      "조성준",
      "김민규",
    ],
    currentMembers: [],
  },
  {
    name: "4조",
    members: [
      "김희민",
      "김하경",
      "박경민",
      "도현학",
      "김도원",
      "현승훈",
      "김나임",
    ],
    currentMembers: [],
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
    currentMembers: [],
  },
];

// 함수들을 window 객체에 추가하여 전역에서 접근 가능하도록 설정
window.displayTeams = function displayTeams() {
  teams.forEach((team, index) => {
    const teamDiv = document.getElementById(`team${index + 1}`);
    const membersDiv = teamDiv.querySelector(".team-members");

    membersDiv.innerHTML = team.currentMembers
      .map((member) => `<p>${member}</p>`)
      .join("");
  });
};

window.openModal = function openModal() {
  document.getElementById("entryModal").style.display = "flex";
  document.getElementById("entryInput").focus();
  document.getElementById("warningText").style.visibility = "hidden";
};

window.closeModal = function closeModal(event) {
  const modal = document.getElementById("entryModal");
  // 모달 외부를 클릭했을 때 닫기
  if (event && event.target === modal) {
    modal.style.display = "none";
    document.getElementById("entryInput").value = "";
  }
};

window.submitNames = async function submitNames() {
  const input = document.getElementById("entryInput").value;
  const newMembers = input
    .split(",")
    .map((name) => name.trim())
    .filter((name) => name);

  let nameExists = false;
  let unregisteredNames = []; // 등록되지 않은 이름들을 저장할 배열

  for (const name of newMembers) {
    const teamIndex = teams.findIndex((team) => team.members.includes(name));

    if (teamIndex !== -1) {
      const teamRef = ref(database, `teams/${teamIndex}/currentMembers`);

      try {
        const snapshot = await get(teamRef);
        const currentMembers = snapshot.val()
          ? Object.values(snapshot.val())
          : [];

        if (currentMembers.includes(name)) {
          nameExists = true;
          break; // 중복 이름 발견 시 루프 중단
        }
      } catch (error) {
        console.error("Error checking current members", error);
        alert("오류가 발생했습니다. 다시 시도하세요.");
        return;
      }
    } else {
      unregisteredNames.push(name); // 등록되지 않은 이름 추가
    }
  }

  if (nameExists) {
    alert("이미 등록된 이름입니다.");
  } else if (unregisteredNames.length > 0) {
    alert(`다음 이름은 등록되지 않았습니다: ${unregisteredNames.join(", ")}`);
  } else {
    for (const name of newMembers) {
      const teamIndex = teams.findIndex((team) => team.members.includes(name));

      if (teamIndex !== -1) {
        const teamRef = ref(database, `teams/${teamIndex}/currentMembers`);

        try {
          const updates = { [`${Date.now()}`]: name };
          await update(teamRef, updates);
        } catch (error) {
          console.error("Error updating current members", error);
          alert("등록 중 오류가 발생했습니다. 다시 시도하세요.");
          return;
        }
      }
    }

    alert("참가자 이름이 등록되었습니다!");
    document.getElementById("entryInput").value = ""; // 입력 필드 비우기
    closeModal();
  }
};

// 실시간 데이터 수신
teams.forEach((team, index) => {
  const teamRef = ref(database, `teams/${index}/currentMembers`);
  onValue(teamRef, (snapshot) => {
    teams[index].currentMembers = snapshot.val()
      ? Object.values(snapshot.val())
      : [];
    displayTeams();
  });
});

displayTeams();

document.getElementById("entryModal").addEventListener("click", closeModal);