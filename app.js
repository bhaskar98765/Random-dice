const dice = document.getElementById("dice");
const magicDot = document.getElementById("magicDot");

let fixNumber = null;       // saved number from setup
let fixActive = false;      // true only after long press
let setupTapCount = 0;
let longPressTimer = null;

// 🎲 Roll dice animation
function rollDice(forcedNumber = null) {
  let result = forcedNumber || Math.floor(Math.random() * 6) + 1;

  const xRot = [0, -90, 90, 0, 0, 180];
  const yRot = [0, 0, 0, -90, 90, 0];

  dice.style.transform =
    `rotateX(${xRot[result-1]}deg) rotateY(${yRot[result-1]}deg) rotateZ(${Math.random()*360}deg)`;

  return result;
}

// 👆 5 taps to enter setup mode
document.body.addEventListener("click", () => {
  setupTapCount++;
  if (setupTapCount >= 5) {
    setupTapCount = 0;
    const num = prompt("Choose fix number (1-6):");
    if (num >= 1 && num <= 6) {
      fixNumber = parseInt(num);
      alert("Fix number saved!");
    }
  }
});

// ✋ Long press = activate fix
document.body.addEventListener("mousedown", () => {
  longPressTimer = setTimeout(() => {
    if (fixNumber !== null) {
      fixActive = true;
      magicDot.style.display = "block";
    }
  }, 3000);
});

document.body.addEventListener("mouseup", () => {
  clearTimeout(longPressTimer);
});

// 🎲 Roll on swipe / click
dice.addEventListener("click", () => {
  let result;
  if (fixActive) {
    result = rollDice(fixNumber);
    fixActive = false;
    magicDot.style.display = "none";
  } else {
    result = rollDice();
  }
  console.log("Rolled:", result);
});
