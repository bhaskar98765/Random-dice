let fixNumber = null;      // user-selected fix number
let fixActive = false;     // fix mode on/off

const dice = document.getElementById("dice");

// Roll function
function rollDice() {
    let result;

    if (fixActive && fixNumber !== null) {
        result = fixNumber; // show reserved fix number
        fixActive = false;  // reset after one use
    } else {
        result = Math.floor(Math.random() * 6) + 1; // random
    }

    // Random 3D rotation
    const xRotation = Math.floor(Math.random() * 360);
    const yRotation = Math.floor(Math.random() * 360);

    dice.style.transform = `rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;

    // Show face after rotation
    setTimeout(() => {
        dice.setAttribute("data-value", result);
    }, 300);

    return result;
}

// Fix number select
function setFixNumber(num) {
    fixNumber = num;
    alert(`Fix number ${num} select ho gaya. Use karne ke liye Activate Fix dabao.`);
}

// Activate fix mode
function activateFix() {
    if (fixNumber === null) {
        alert("Pehle fix number select karo!");
        return;
    }
    fixActive = true;
    alert(`Fix mode active! Next roll par ${fixNumber} aayega.`);
}

// Event listeners
document.getElementById("rollBtn").addEventListener("click", rollDice);
document.querySelectorAll(".fix-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        setFixNumber(parseInt(btn.dataset.value));
    });
});
document.getElementById("fixActivateBtn").addEventListener("click", activateFix);
