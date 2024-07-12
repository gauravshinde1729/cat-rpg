async function simulateBattle(playerParty, enemyParty) {
    const battleLog = [];
    let currentRound = 1;

    // Initialize character stats for battle
    playerParty = initializeCharactersForBattle(playerParty, true);
    enemyParty = initializeCharactersForBattle(enemyParty, false);

    while (!isBattleOver(playerParty, enemyParty)) {
        battleLog.push(`Round ${currentRound}:`);

        // Determine turn order based on speed
        const allCharacters = [...playerParty, ...enemyParty].sort((a, b) => b.battleStats.spd - a.battleStats.spd);

        for (const attacker of allCharacters) {
            if (attacker.battleStats.hp <= 0) continue; // Skip defeated characters

            const defenderParty = attacker.isPlayer ? enemyParty : playerParty;
            const attackType = selectAttackType(attacker, defenderParty);
            const targets = selectTargets(attacker, attackType, defenderParty);

            for (const defender of targets) {
                const damage = calculateDamage(attacker, defender, attackType, defenderParty);
                defender.battleStats.hp -= damage;
                battleLog.push(`${attacker.name} uses ${attackType} on ${defender.name} for ${damage} damage.`);

                if (defender.battleStats.hp <= 0) {
                    battleLog.push(`${defender.name} is defeated!`);
                }
            }
        }

        currentRound++;
    }

    const result = determineWinner(playerParty, enemyParty);
    battleLog.push(`Result: ${result}`);
    return { log: battleLog, result };
}



function initializeCharactersForBattle(party, isPlayerParty) {
    return party.map(char => {
        const rarityMultiplier = {
            'R': 1, 'R+': 1.05, 'SR': 1.15, 'SR+': 1.3, 'SSR': 1.5, 'SSR+': 1.75, 'UR': 2.05, 'UR+': 2.5, 'LR': 3
        }[char.rarity];

        return {
            ...char,
            battleStats: {
                spd: Math.round(char.baseStats.spd * char.level * rarityMultiplier),
                pAtk: Math.round(char.baseStats.pAtk * char.level * rarityMultiplier),
                pDef: Math.round(char.baseStats.pDef * char.level * rarityMultiplier),
                mAtk: Math.round(char.baseStats.mAtk * char.level * rarityMultiplier),
                mDef: Math.round(char.baseStats.mDef * char.level * rarityMultiplier),
                critC: char.baseStats.critC, // Crit chance doesn't scale with level/rarity
                critR: char.baseStats.critR, // Crit resistance doesn't scale with level/rarity
                hp: Math.round(char.baseStats.hp * char.level * rarityMultiplier),
                maxHp: Math.round(char.baseStats.hp * char.level * rarityMultiplier) // Store max HP for healing
            },
            isPlayer: isPlayerParty // Flag to identify player vs. enemy characters
        };
    });
}



function selectAttackType(attacker, defenderParty) {
    const attackOptions = [];
    const attackWeights = [];

    // Define attack options and weights based on character class and battle conditions
    switch (attacker.class) {
        case 'Fighter':
            attackOptions.push('Attack Solo');
            attackWeights.push(1);
            if (defenderParty.length >= 2) {
                attackOptions.push('Attack Spread');
                attackWeights.push(1);
            }
            break;
        case 'Mage':
            attackOptions.push('Attack Solo');
            attackWeights.push(1);
            if (defenderParty.length >= 3) {
                attackOptions.push('Attack Spread');
                attackWeights.push(2);
            }
            const lowHpAllies = attacker.isPlayer
                ? playerParty.filter(char => char.battleStats.hp <= 0.25 * char.battleStats.maxHp)
                : enemyParty.filter(char => char.battleStats.hp <= 0.25 * char.battleStats.maxHp);
            if (lowHpAllies.length > 0) {
                attackOptions.push('Heal Solo');
                attackWeights.push(2);
            }
            const moderateHpAllies = attacker.isPlayer
                ? playerParty.filter(char => char.battleStats.hp <= 0.5 * char.battleStats.maxHp)
                : enemyParty.filter(char => char.battleStats.hp <= 0.5 * char.battleStats.maxHp);
            if (moderateHpAllies.length > 1) {
                attackOptions.push('Heal Spread');
                attackWeights.push(1);
            }
            break;
        case 'Archer':
            attackOptions.push('Attack Solo');
            attackWeights.push(2);
            if (defenderParty.length >= 3) {
                attackOptions.push('Attack Spread');
                attackWeights.push(1);
            }
            break;
    }

    // Randomly select an attack type based on weights
    const totalWeight = attackWeights.reduce((sum, weight) => sum + weight, 0);
    const randomIndex = Math.floor(Math.random() * totalWeight);
    let weightSum = 0;
    for (let i = 0; i < attackOptions.length; i++) {
        weightSum += attackWeights[i];
        if (randomIndex < weightSum) {
            return attackOptions[i];
        }
    }
}


function selectTargets(attacker, attackType, defenderParty) {
    if (attackType.includes('Solo')) {
        // Randomly select one target
        const randomIndex = Math.floor(Math.random() * defenderParty.length);
        return [defenderParty[randomIndex]];
    } else if (attackType.includes('Spread')) {
        // Target all enemies
        return defenderParty;
    } else if (attackType.includes('Heal')) {
        // Filter allies based on HP thresholds (25% for Solo, 50% for Spread)
        const hpThreshold = attackType === 'Heal Solo' ? 0.25 : 0.5;
        return attacker.isPlayer
            ? playerParty.filter(char => char.battleStats.hp <= hpThreshold * char.battleStats.maxHp)
            : enemyParty.filter(char => char.battleStats.hp <= hpThreshold * char.battleStats.maxHp);
    }
}


function calculateDamage(attacker, defender, attackType, defenderParty) {
    const isCrit = Math.random() < attacker.battleStats.critC / defender.battleStats.critR / 16;
    const critModifier = isCrit ? 2 : 1;
    const damageModifier = 2; // From the document
    const attackStat = attacker.class === 'Mage' ? attacker.battleStats.mAtk : attacker.battleStats.pAtk;
    const defenseStat = attacker.class === 'Mage' ? defender.battleStats.mDef : defender.battleStats.pDef;
    const numTargets = attackType.includes('Spread') ? selectTargets(attacker, attackType, defenderParty).length : 1;

    const damage = Math.round(((attackStat * damageModifier * critModifier * (1 / numTargets)) / defenseStat) * attackStat);
    return damage;
}


function determineWinner(playerParty, enemyParty) {
    if (allCharactersDefeated(playerParty)) return "Defeat";
    if (allCharactersDefeated(enemyParty)) return "Victory";
    return "Ongoing";
}

function allCharactersDefeated(party) {
    return party.every(char => char.hp <= 0);
}


function isBattleOver(playerParty, enemyParty) {
    return allCharactersDefeated(playerParty) || allCharactersDefeated(enemyParty);
}

module.exports = {
    simulateBattle,
    determineWinner,
    calculateDamage,
    selectAttackType,
    initializeCharactersForBattle
}