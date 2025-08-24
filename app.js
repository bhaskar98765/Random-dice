let fixNumber = null;      // user-selected fix number
let fixActive = false;     // fix mode on/off

// dice element
const dice = document.getElementById("dice");

// Roll function
function rollDice() {
    let result;

    if (fixActive && fixNumber !== null) {
        // agar fix active hai to wahi number show karega
        result = fixNumber;
        fixActive = false; // ek bar ke liye
    } else {
        // random number
        result = Math.floor(Math.random() * 6) + 1;
    }

    // 3D rotation effect
    const xRotation = Math.floor(Math.random() * 360);
    const yRotation = Math.floor(Math.random() * 360);

    dice.style.transform = `rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;

    // dice face update
    setTimeout(() => {
        dice.setAttribute("data-value", result);
    }, 300);

    return result;
}

// fix number select karne ka function
function setFixNumber(num) {
    fixNumber = num;      // bas reserve karega
    alert(`Fix number ${num} select ho gaya. Use karne ke liye Fix Mode ON karo.`);
}

// fix mode activate
function activateFix() {
    if (fixNumber === null) {
        alert("Pehle fix number select karo!");
        return;
    }
    fixActive = true;
    alert(`Fix mode active! Next roll par ${fixNumber} aayega.`);
}

// roll button event
document.getElementById("rollBtn").addEventListener("click", rollDice);

// example: fix number select buttons
document.querySelectorAll(".fix-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        setFixNumber(parseInt(btn.dataset.value));
    });
});

// fix activate button
document.getElementById("fixActivateBtn").addEventListener("click", activateFix);
