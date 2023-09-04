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
}

function interpretRedDice(result, player) {
    switch (result) {
        case 1:
        case 2:
            player.score += 1;
            if (player.coins >= 3) {
                askForDecision([
                    { value: 'move', text: 'Move an additional space' },
                    { value: 'stay', text: 'Stay' }
                ], decision => {
                    if (decision === 'move') {
                        player.score += 1;
                        player.coins -= 3;
                    }
                    updateStats();
                });
            }
            break;
        case 3:
        case 4:
            player.score += 2;
            if (player.coins >= 2) {
                askForDecision([
                    { value: 'spend', text: 'Spend 2 coins to prevent an opponent from moving next turn' },
                    { value: 'stay', text: 'Stay' }
                ], decision => {
                    if (decision === 'spend') {
                        player.coins -= 2;
                    }
                    updateStats();
                });
            }
            break;
        case 5:
            askForDecision([
                { value: 'Mushroom', text: 'Mushroom' },
                { value: 'Fire Flower', text: 'Fire Flower' },
                { value: 'Feather', text: 'Feather' }
            ], decision => {
                player.powerups.push(decision);
                updateStats();
            });
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
            if (player.coins >= 2) {
                askForDecision([
                    { value: 'spend', text: 'Spend 2 coins to protect yourself from the Strong Current' },
                    { value: 'stay', text: 'Stay' }
                ], decision => {
                    if (decision === 'spend') {
                        player.coins -= 2;
                    } else {
                        player.score -= 1;
                    }
                    updateStats();
                });
            }
            break;
        case 6:
            askForDecision([
                { value: 'push', text: 'Push yourself back by 2 spaces' },
                { value: 'stay', text: 'Stay' }
            ], decision => {
                if (decision === 'push') {
                    player.score -= 2;
                }
                updateStats();
            });
            break;
    }
}

function interpretGreenDice(result, player) {
    switch (result) {
        case 1:
        case 2:
            askForDecision([
                { value: 'move', text: 'Move forward by 1 space' },
                { value: 'collect', text: 'Collect 3 coins' }
            ], decision => {
                if (decision === 'move') {
                    player.score += 1;
                } else {
                    player.coins += 3;
                }
                updateStats();
            });
            break;
        case 3:
        case 4:
            askForDecision([
                { value: 'move', text: 'Skip your next turn and then move 3 spaces' },
                { value: 'collect', text: 'Gain a power-up' }
            ], decision => {
                if (decision === 'move') {
                    player.score += 3;
                } else {
                    player.powerups.push('Choose a power-up');
                }
                updateStats();
            });
            break;
        case 5:
            askForDecision([
                { value: 'move', text: 'Skip 2 turns and then move 5 spaces' },
                { value: 'collect', text: 'Gain 2 power-ups' }
            ], decision => {
                if (decision === 'move') {
                    player.score += 5;
                } else {
                    player.powerups.push('Choose a power-up', 'Choose another power-up');
                }
                updateStats();
            });
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
            askForDecision([
                { value: 'move', text: 'Move back by 1 space' },
                { value: 'stay', text: 'Stay' }
            ], decision => {
                if (decision === 'move') {
                    player.score -= 1;
                }
                updateStats();
            });
            break;
        case 6:
            askForDecision([
                { value: 'lose', text: 'Lose half your coins' },
                { value: 'stay', text: 'Stay' }
            ], decision => {
                if (decision === 'lose') {
                    player.coins = Math.floor(player.coins / 2);
                }
                updateStats();
            });
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
