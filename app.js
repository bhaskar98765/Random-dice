const dice = document.getElementById("dice");
const magicDot = document.getElementById("magicDot");

let fixNumber = null;    // setup ke baad yeh save hoga
let fixActive = false;   // long press ke baad ON hoga
let setupTapCount = 0;
let longPressTimer = null;

// 🎲 Dice roll function
function rollDice(forcedNumber = null) {
  let result = forcedNumber || Math.floor(Math.random() * 6) + 1;

  const rotations = {
    1: {x: 0, y: 0},
    2: {x: 0, y: 180},
    3: {x: 0, y: -90},
    4: {x: 0, y: 90},
    5: {x: -90, y: 0},
    6: {x: 90, y: 0}
  };

  dice.style.transform =
    `rotateX(${rotations[result].x}deg) rotateY(${rotations[result].y}deg) rotateZ(${Math.random()*360}deg)`;

  return result;
}

// 👆 5 taps = setup mode
document.body.addEventListener("click", () => {
  setupTapCount++;
  if (setupTapCount >= 5) {
    setupTapCount = 0;
    const num = prompt("Choose fix number (1-6):");
    if (num >= 1 && num <= 6) {
      fixNumber = parseInt(num);
      alert("Fix number saved: " + fixNumber);
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

// 🎲 Roll on click
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
