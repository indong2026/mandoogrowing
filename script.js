// ===========================
// 요소 가져오기
// ===========================

const moneyText = document.getElementById("money");
const levelText = document.getElementById("level");
const autoIncomeText = document.getElementById("autoIncome");

const clickLevelText = document.getElementById("clickLevel");
const autoLevelText = document.getElementById("autoLevel");

const character = document.getElementById("character");
const expBar = document.getElementById("expBar");
const effectContainer = document.getElementById("effectContainer");

const clickUpgradeBtn = document.getElementById("clickUpgradeBtn");
const autoUpgradeBtn = document.getElementById("autoUpgradeBtn");

const giftBox = document.getElementById("giftBox");

const achievementPanel = document.getElementById("achievementPanel");

const closeAchievement = document.getElementById("closeAchievement");

const achievementButtons = document.querySelectorAll(".rewardBtn");

const upgradeSection = document.getElementById("upgradeSection");

const shopBtn = document.getElementById("shopBtn");
const storePanel = document.getElementById("storePanel");
const closeStore = document.getElementById("closeStore");

const buyTotem1 = document.getElementById("buyTotem1");

const achievementList = {
  firstClick: {
    name: "첫 클릭",
    description: "1번 클릭하기",
    reward: 100,
  },

  click100: {
    name: "클릭 초보",
    description: "100번 클릭하기",
    reward: 500,
  },

  click1000: {
    name: "클릭 장인",
    description: "1000번 클릭하기",
    reward: 3000,
  },

  money10000: {
    name: "첫 부자",
    description: "10,000원 모으기",
    reward: 1000,
  },

  level10: {
    name: "성장 완료",
    description: "Lv.10 달성",
    reward: 5000,
  },

  critical100: {
    name: "운 좋은 사람",
    description: "치명타 100번 발생",
    reward: 10000,
  },
};

// ===========================
// 플레이어 데이터
// ===========================

const player = {
  money: 0,

  level: 1,

  exp: 0,

  maxExp: 100,

  clickPower: 1,

  autoIncome: 0,

  clickLevel: 1,

  autoLevel: 1,

  clickCost: 100,

  autoCost: 150,

  critChance: 5, // 치명타 확률(%)
  critMultiplier: 5, // 5배

  totalClicks: 0,
  criticalCount: 0,

  achievements: {},

  totem1: false,

  totemIncome: 0,
};

// ===========================
// UI 갱신
// ===========================

function updateUI() {
  moneyText.textContent = Math.floor(player.money).toLocaleString();

  levelText.textContent = player.level;

  autoIncomeText.textContent = player.autoIncome + player.totemIncome;

  clickLevelText.textContent = player.clickLevel;

  autoLevelText.textContent = player.autoLevel;

  clickUpgradeBtn.textContent = player.clickCost.toLocaleString() + "원";

  autoUpgradeBtn.textContent = player.autoCost.toLocaleString() + "원";

  expBar.style.width = (player.exp / player.maxExp) * 100 + "%";
}

// ===========================
// 경험치
// ===========================

function addExp(amount) {
  player.exp += amount;

  while (player.exp >= player.maxExp) {
    player.exp -= player.maxExp;

    player.level++;

    changeCharacter();

    // 레벨이 높아질수록 조금씩 더 어려워짐
    player.maxExp = Math.floor(player.maxExp * 1.15);

    
  }
}

// ===========================
// 사진 변경
// ===========================

function changeCharacter() {
  // 현재 레벨이 10 이하라면 해당 사진 사용
  if (player.level <= 10) {
    character.src = `images/player${player.level}.png`;
  }

  // 10레벨 이후는 마지막 사진 유지
  else {
    character.src = "images/player10.png";
  }
}

// ===========================
// 클릭
// ===========================

character.addEventListener("click", () => {
  let earn = player.clickPower;

  let critical = false;

  player.totalClicks++;

  if (Math.random() * 100 < player.critChance) {
    earn *= player.critMultiplier;

    critical = true;

    player.criticalCount++;
  }

  player.money += earn;

  addExp(1);

  createEffect(earn, critical);

  if (critical) {
    character.style.transform = "scale(1.15) rotate(-5deg)";

    setTimeout(() => {
      character.style.transform = "";
    }, 120);
  }

  updateUI();
  checkAchievements();
});

// ===========================
// 자동 수입
// ===========================

setInterval(() => {
  player.money += player.autoIncome + player.totemIncome;

  updateUI();
}, 1000);

// ===========================
// 클릭 업그레이드
// ===========================

clickUpgradeBtn.addEventListener("click", () => {
  if (player.money < player.clickCost) return;

  player.money -= player.clickCost;

  player.clickPower++;

  player.clickLevel++;

  player.clickCost = Math.floor(player.clickCost * 1.4);

  updateUI();
});

// ===========================
// 자동 수입 업그레이드
// ===========================

autoUpgradeBtn.addEventListener("click", () => {
  if (player.money < player.autoCost) return;

  player.money -= player.autoCost;

  player.autoLevel++;

  player.autoIncome += 10;

  player.autoCost = Math.floor(player.autoCost * 1.6);

  updateUI();
});

// ===========================
// +숫자 효과
// ===========================

function createEffect(value, critical = false) {
  const text = document.createElement("div");

  text.textContent = critical ? `💥 +${value}` : `+${value}`;

  text.style.position = "absolute";

  text.style.left = 80 + Math.random() * 80 + "px";

  text.style.top = 120 + Math.random() * 30 + "px";

  text.style.fontSize = critical ? "36px" : "28px";

  text.style.fontWeight = "bold";

  text.style.color = critical ? "#ff3b30" : "#ffd54f";

  text.style.textShadow = critical ? "0 0 15px red" : "0 0 8px gold";

  text.style.pointerEvents = "none";

  text.style.transition = "all .8s";

  effectContainer.appendChild(text);

  requestAnimationFrame(() => {
    text.style.transform = `translateY(-100px) scale(${critical ? 1.6 : 1.2})`;

    text.style.opacity = "0";
  });

  setTimeout(() => {
    text.remove();
  }, 800);
}

// ===========================
// 시작
// ===========================

updateUI();

let giftTimer;

// 선물 생성

function createGift() {
  if (giftBox.style.display === "block") return;

  giftBox.style.display = "block";

  // 위치 랜덤

  giftBox.style.left = Math.random() * 120 + 40 + "px";

  giftBox.style.top = Math.random() * 80 + 40 + "px";

  // 5초 후 사라짐

  giftTimer = setTimeout(() => {
    giftBox.style.display = "none";
  }, 5000);
}

// 일정 시간마다 생성

setInterval(() => {
  createGift();
}, 30000);

giftBox.addEventListener("click", () => {
  clearTimeout(giftTimer);

  const reward = Math.floor(Math.random() * 500) + 500;

  player.money += reward;

  createEffect(reward, true);

  giftBox.style.display = "none";

  updateUI();
});

function checkAchievements() {
  if (player.totalClicks >= 1) {
    unlockAchievement("firstClick");
  }

  if (player.totalClicks >= 100) {
    unlockAchievement("click100");
  }

  if (player.totalClicks >= 1000) {
    unlockAchievement("click1000");
  }

  if (player.money >= 10000) {
    unlockAchievement("money10000");
  }

  if (player.level >= 10) {
    unlockAchievement("level10");
  }

  if (player.criticalCount >= 100) {
    unlockAchievement("critical100");
  }
}

function unlockAchievement(id) {
  // 이미 달성한 업적이면 종료
  if (player.achievements[id]) return;

  player.achievements[id] = {
    completed: false,
  };

  console.log("업적 달성 가능:", achievementList[id].name);
}

function receiveAchievement(id) {
  if (!player.achievements[id]) return;

  if (player.achievements[id].completed) return;

  player.money += achievementList[id].reward;

  player.achievements[id].completed = true;

  updateUI();
  renderAchievements();
}

function renderAchievements() {
  const list = document.getElementById("achievementList");

  list.innerHTML = "";

  Object.keys(achievementList).forEach((id) => {
    const data = achievementList[id];

    const unlocked = player.achievements[id];

    const div = document.createElement("div");

    div.className = "achievement";

    if (unlocked?.completed) {
      div.classList.add("completed");
    }

    div.innerHTML = `

            <div>
                <h3>${data.name}</h3>

                <p>${data.description}</p>

                <p>보상: ${data.reward}원</p>
            </div>


            <button 
onclick="receiveAchievement('${id}')"
${!unlocked ? "disabled" : ""}>

${unlocked?.completed ? "완료" : "받기"}

</button>

        `;

    list.appendChild(div);
  });
}

achievementBtn.addEventListener("click", () => {
  achievementPanel.style.display = "block";

  checkAchievements();

  renderAchievements();
});

closeAchievement.addEventListener("click", () => {
  achievementPanel.style.display = "none";
});

shopBtn.addEventListener("click", () => {
  storePanel.style.display = "block";
});

closeStore.addEventListener("click", () => {
  storePanel.style.display = "none";
});

buyTotem1.addEventListener("click", () => {
  const price = 1000;

  if (player.totem1) {
    return;
  }

  if (player.money < price) {
    alert("돈이 부족합니다");

    return;
  }

  player.money -= price;

  player.totem1 = true;

  player.totemIncome = 5;

  document.getElementById("leftTotem").src = "images/totem1.png";

  document.getElementById("rightTotem").src = "images/totem1.png";

  buyTotem1.textContent = "보유중";

  updateUI();
});