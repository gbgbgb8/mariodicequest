let players = [
    { score: 0, coins: 3, powerups: [], heldBlackDice: null },
    { score: 0, coins: 3, powerups: [], heldBlackDice: null }
];
let currentPlayer = 0;
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
}
function interpretRedDice(result, player) {
    switch (result) {
        case 1:
        case 2:
            player.score += 1;
            if (player.coins >= 3 && confirm("Do you want to spend 3 coins to move an additional space?")) {
                player.score += 1;
                player.coins -= 3;
            }
            break;
        case 3:
        case 4:
            player.score += 2;
            if (player.coins >= 2 && confirm("Spend 2 coins to prevent an opponent from moving next turn?")) {
                player.coins -= 2;
            }
            break;
        case 5:
            let chosenPowerUp = prompt("Choose a power-up: Mushroom, Fire Flower, Feather", "Mushroom");
            player.powerups.push(chosenPowerUp);
            break;
        case 6:
            player.coins += roll(6);
            break;
    }
}
function interpretYellowDice(result, player) {
    if (result >= 1 && result <= 4) {
        player.coins += result;
    } else {
        player.coins += 3;
    }
}
function interpretBlueDice(result, player) {
    switch (result) {
        case 4:
        case 5:
            if (player.coins >= 2 && confirm("Strong Current detected! Do you want to spend 2 coins to protect yourself?")) {
                player.coins -= 2;
            } else {
                player.score -= 1;
            }
            break;
        case 6:
            if (confirm("You got a Blue Shell! Do you want to push yourself back by 2 spaces?")) {
                player.score -= 2;
            }
            break;
    }
}
function interpretGreenDice(result, player) {
    switch (result) {
        case 1:
        case 2:
            let decision = prompt("You found a Short Pipe! Do you want to 'move' forward by 1 space or 'collect' 3 coins?", "move");
            if (decision === "move") {
                player.score += 1;
            } else {
                player.coins += 3;
            }
            break;
        case 3:
        case 4:
            let mediumChoice = prompt("Medium pipe: Choose to skip your next turn and then move 3 spaces or gain a power-up.", "move");
            if (mediumChoice === "move") {
                player.score += 3;
            } else {
                player.powerups.push("Choose a power-up");
            }
            break;
        case 5:
            let longChoice = prompt("Long pipe: Choose to skip 2 turns and then move 5 spaces or gain 2 power-ups.", "move");
            if (longChoice === "move") {
                player.score += 5;
            } else {
                player.powerups.push("Choose a power-up", "Choose another power-up");
            }
            break;
        case 6:
            player.score = 0;
            break;
    }
}
function interpretBlackDice(result, player) {
    switch (result) {
        case 1:
        case 2:
        case 3:
            if (player.heldBlackDice === null) {
                player.heldBlackDice = result;
            }
            break;
        case 4:
        case 5:
            let decision = confirm("Bowser's Minion spotted! Do you want to move back by 1 space?");
            if (decision) {
                player.score -= 1;
            }
            break;
        case 6:
            let wrathDecision = confirm("Bowser's Wrath! Do you want to lose half your coins?");
            if (wrathDecision) {
                player.coins = Math.floor(player.coins / 2);
            }
            break;
    }
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
