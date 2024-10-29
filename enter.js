// Firebase 구성 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
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

// window 객체에 함수 추가
window.submitName = function submitName() {
  const nameInput = document.getElementById("participantName");
  const name = nameInput.value.trim();
  const messageElement = document.getElementById("message");

  if (name) {
    // Firebase Database에 참가자 이름 추가
    push(ref(database, "participants"), { name: name })
      .then(() => {
        messageElement.textContent = "이름이 성공적으로 등록되었습니다!";
        nameInput.value = ""; // 입력 필드 비우기
      })
      .catch((error) => {
        console.error("Error writing new participant to database", error);
        messageElement.textContent =
          "등록 중 오류가 발생했습니다. 다시 시도하세요.";
      });
  } else {
    messageElement.textContent = "이름을 입력하세요.";
  }
};
