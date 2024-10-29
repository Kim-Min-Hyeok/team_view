// Firebase SDK 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, update, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Firebase 구성 정보
const firebaseConfig = {
  apiKey: "AIzaSyAWWeIHatcjbZJ_G4qTGE5AIib0uLkcJHc",
  authDomain: "pard-shortkathon.firebaseapp.com",
  projectId: "pard-shortkathon",
  storageBucket: "pard-shortkathon.appspot.com",
  messagingSenderId: "859662382781",
  appId: "1:859662382781:web:a2be9af9ac9118c988a9d4",
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const teams = [
  { name: "1조", members: ["최수원", "장주영", "김우현", "유수민", "김세현", "이수인"], currentMembers: [] },
  { name: "2조", members: ["김지안", "강서영", "김수빈", "강신엽", "정민찬", "지석영", "김하진"], currentMembers: [] },
  { name: "3조", members: ["김규리", "이채정", "김민준", "이유현", "김도원", "조성준", "김민규"], currentMembers: [] },
  { name: "4조", members: ["김희민", "김하경", "박경민", "도현학", "최준영", "현승훈", "김나임"], currentMembers: [] },
  { name: "5조", members: ["이지환", "김규희", "이서현", "김도경", "김지원", "김사랑", "김민제"], currentMembers: [] },
];

function displayTeams() {
  teams.forEach((team, index) => {
    const teamDiv = document.getElementById(`team${index + 1}`);
    teamDiv.innerHTML = `<h2>${team.name}</h2><p>${team.currentMembers.join(", ") || ""}</p>`;
  });
}

function openModal() {
  document.getElementById("entryModal").style.display = "flex";
  document.getElementById("entryInput").focus();
  document.getElementById("warningText").style.visibility = "hidden";
}

function closeModal() {
  document.getElementById("entryModal").style.display = "none";
  document.getElementById("entryInput").value = "";
}

function submitNames() {
  const input = document.getElementById("entryInput").value;
  const newMembers = input.split(",").map((name) => name.trim()).filter((name) => name);

  newMembers.forEach((member) => {
    const teamIndex = teams.findIndex((team) => team.members.includes(member));
    if (teamIndex !== -1 && !teams[teamIndex].currentMembers.includes(member)) {
      const teamRef = ref(database, `teams/${teamIndex}/currentMembers`);
      update(teamRef, {
        [teams[teamIndex].currentMembers.length]: member,
      });
    }
  });
  alert("참가자 이름이 등록되었습니다!");
  closeModal();
}

// 실시간 데이터 수신
teams.forEach((team, index) => {
  const teamRef = ref(database, `teams/${index}/currentMembers`);
  onValue(teamRef, (snapshot) => {
    teams[index].currentMembers = snapshot.val() ? Object.values(snapshot.val()) : [];
    displayTeams();
  });
});

displayTeams();
