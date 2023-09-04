let players = [
    { score: 0, coins: 3, powerups: [], heldBlackDice: null },
    { score: 0, coins: 3, powerups: [], heldBlackDice: null }
];
let currentPlayer = 0;
let currentDecisionFunction = null;

function rollDice() {
    const roll = (sides) => Math.floor(Math.random() * sides) + 1;
    let redResult = roll(6);
    let yellowResult = roll(6);
    let blueResult = roll(6);
    let greenResult = roll(6);
    let blackResult = roll(6);
    interpretRedDice(redResult, players[currentPlayer]);
    interpretYellowDice(yellowResult, players[currentPlayer]);
    interpretBlueDice(blueResult, players[currentPlayer]);
    interpretGreenDice(greenResult, players[currentPlayer]);
    interpretBlackDice(blackResult, players[currentPlayer]);
    updateStats();
    displayResults(redResult, yellowResult, blueResult, greenResult, blackResult);
    currentPlayer = (currentPlayer + 1) % 2;
    let emoji = (currentPlayer === 0) ? "🔴" : "🔵";
    document.getElementById('currentPlayerTurn').innerText = `Player ${currentPlayer + 1}'s Turn ${emoji}`;
    document.getElementById('rollExplanation').innerHTML = '';
}

function interpretRedDice(result, player) {
    let explanation = "Red (Mario): ";
    switch (result) {
        case 1:
        case 2:
            player.score += 1;
            explanation += "Move 1 space. ";
            if (player.coins >= 3) {
                explanation += "Option to spend 3 coins to move an additional space.";
            }
            break;
        case 3:
        case 4:
            player.score += 2;
            explanation += "Move 2 spaces. ";
            if (player.coins >= 2) {
                explanation += "Option to spend 2 coins to prevent an opponent from moving next turn.";
            }
            break;
        case 5:
            explanation += "Gain a power-up.";
            break;
        case 6:
            player.coins += roll(6);
            explanation += "Roll the Yellow dice again for bonus coins.";
            break;
    }
    document.getElementById('rollExplanation').innerHTML += explanation + "<br>";
}

function interpretYellowDice(result, player) {
    let explanation = "Yellow (Coins): ";
    if (result >= 1 && result <= 4) {
        player.coins += result;
        explanation += `Collect ${result} coins.`;
    } else {
        player.coins += 3;
        explanation += "Steal up to 3 coins from an opponent.";
    }
    document.getElementById('rollExplanation').innerHTML += explanation + "<br>";
}

function interpretBlueDice(result, player) {
    let explanation = "Blue (Water): ";
    switch (result) {
        case 4:
        case 5:
            if (player.coins >= 2) {
                explanation += "Strong Current. Option to spend 2 coins to protect yourself.";
            } else {
                player.score -= 1;
                explanation += "Strong Current. Lost 1 space.";
            }
            break;
        case 6:
            explanation += "Blue Shell. Choose to push back any player by 2 spaces.";
            break;
        default:
            explanation += "Calm Waters. No effect.";
            break;
    }
    document.getElementById('rollExplanation').innerHTML += explanation + "<br>";
}

function interpretGreenDice(result, player) {
    let explanation = "Green (Pipes): ";
    switch (result) {
        case 1:
        case 2:
            explanation += "Short pipe. Option to move forward 1 space or collect 3 coins.";
            break;
        case 3:
        case 4:
            explanation += "Medium pipe. Option to skip your next turn and then move 3 spaces or gain a power-up.";
            break;
        case 5:
            explanation += "Long pipe. Option to skip 2 turns and then move 5 spaces or gain 2 power-ups.";
            break;
        case 6:
            player.score = 0;
            explanation += "Warp pipe. Reset score to 0.";
            break;
    }
    document.getElementById('rollExplanation').innerHTML += explanation + "<br>";
}

function interpretBlackDice(result, player) {
    let explanation = "Black (Bowser): ";
    switch (result) {
        case 1:
        case 2:
        case 3:
            if (player.heldBlackDice === null) {
                player.heldBlackDice = result;
                explanation += "Plan ahead. Held the Black dice result for a future turn.";
            } else {
                explanation += "Plan ahead. Already holding a Black dice result.";
            }
            break;
        case 4:
        case 5:
            explanation += "Bowser's Minion. Option to go back 1 space or force another player to go back 1 space.";
            break;
        case 6:
            explanation += "Bowser's Wrath. Lose half your coins or choose another player to lose half of theirs.";
            break;
    }
    document.getElementById('rollExplanation').innerHTML += explanation + "<br>";
}

function updateStats() {
    document.getElementById('score1').textContent = players[0].score;
    document.getElementById('coins1').textContent = players[0].coins;
    document.getElementById('powerups1').textContent = players[0].powerups.join(", ") || "None";
    document.getElementById('score2').textContent = players[1].score;
    document.getElementById('coins2').textContent = players[1].coins;
    document.getElementById('powerups2').textContent = players[1].powerups.join(", ") || "None";
    updateBoardPosition();
}

function updateBoardPosition() {
    const terrains = ["🌲", "🏞️", "🏖️", "🌋", "🏔️", "🏜️", "🏙️", "🌉", "🚀", "🌌", "🌕", "🌠", "🪐", "🌌", "🚀", "🌉", "🏙️", "🏜️", "🎡", "🏰"];
    for (let i = 0; i < 20; i++) {
        document.getElementById('space' + i).textContent = terrains[i];
    }
    if (players[0].score === players[1].score) {
        document.getElementById('space' + players[0].score).textContent += "🔴🔵";
    } else {
        document.getElementById('space' + players[0].score).textContent += "🔴";
        document.getElementById('space' + players[1].score).textContent += "🔵";
    }
}

function displayResults(red, yellow, blue, green, black) {
    document.getElementById('results').innerHTML = `
        Red (Mario): ${red} <br>
        Yellow (Coins): ${yellow} <br>
        Blue (Water): ${blue} <br>
        Green (Pipes): ${green} <br>
        Black (Bowser): ${black}
    `;
}

function askForDecision(options, callback) {
    currentDecisionFunction = callback;
    const decisionSelect = document.getElementById('decisionOptions');
    decisionSelect.innerHTML = '';
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option.value;
        opt.innerText = option.text;
        decisionSelect.appendChild(opt);
    });
    document.getElementById('decisionBox').style.display = 'block';
}

function confirmDecision() {
    const selectedValue = document.getElementById('decisionOptions').value;
    if (currentDecisionFunction) {
        currentDecisionFunction(selectedValue);
        currentDecisionFunction = null;
    }
    document.getElementById('decisionBox').style.display = 'none';
}
