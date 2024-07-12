const {
    simulateBattle,
    determineWinner,
    calculateDamage,
    selectAttackType,
    initializeCharactersForBattle
} = require('../../routes/api/battle.logic');

// Character data from the example combat
const partyA = [
    { name: 'Fighter1', class: 'Fighter', level: 1, rarity: 'R', baseStats: { spd: 100, pAtk: 150, pDef: 90, mAtk: 60, mDef: 50, critC: 100, critR: 100, hp: 1500 } },
    { name: 'Mage1', class: 'Mage', level: 1, rarity: 'R', baseStats: { spd: 40, pAtk: 50, pDef: 80, mAtk: 150, mDef: 150, critC: 50, critR: 40, hp: 1500 } },
    { name: 'Archer1', class: 'Archer', level: 1, rarity: 'R', baseStats: { spd: 150, pAtk: 120, pDef: 140, mAtk: 90, mDef: 100, critC: 150, critR: 60, hp: 1350 } }
];

const partyB = [
    { name: 'Enemy1', class: 'Archer', level: 1, rarity: 'R', baseStats: { spd: 60, pAtk: 100, pDef: 100, mAtk: 100, mDef: 100, critC: 100, critR: 100, hp: 1200 } },
    { name: 'Boss1', class: 'Fighter', level: 1, rarity: 'R+', baseStats: { spd: 126, pAtk: 147, pDef: 105, mAtk: 105, mDef: 126, critC: 210, critR: 105, hp: 3150 } }
];



describe('Battle Simulation', () => {
    let playerParty, enemyParty;

    beforeEach(() => {
        playerParty = initializeCharactersForBattle(partyA);
        enemyParty = initializeCharactersForBattle(partyB);
    });

    // Round 1 Tests
    it('Archer1 attacks Enemy1 with Attack Solo (no crit)', () => {
        const attacker = playerParty[2]; // Archer1
        const defenderParty = attacker.isPlayer ? enemyParty : playerParty;
        const defender = enemyParty[0]; // Enemy1
        
        jest.spyOn(global.Math, 'random').mockReturnValue(0); // Simulate a 0 (always crit)
        expect(calculateDamage(attacker, defender, 'Attack Solo' , defenderParty)).toBe(288);
        defender.battleStats.hp -= 288;
    });


    

    it('Boss1 attacks Mage1 with Attack Solo', () => {
        const attacker = enemyParty[1]; // Boss1
        const defender = playerParty[1]; // Mage1

        const defenderParty = attacker.isPlayer ? enemyParty : playerParty;

          // Mock the random number generator to force a critical hit
         jest.spyOn(global.Math, 'random').mockReturnValue(0); // Simulate a 0 (always crit)

        expect(calculateDamage(attacker, defender, 'Attack Solo' , defenderParty)).toBe(1186);
        defender.battleStats.hp -= 1186;
    });


    it('Fighter1 attacks both enemies with Attack Spread (no crits)', () => {
        const attacker = playerParty[0]; // Fighter1

        const defenderParty = attacker.isPlayer ? enemyParty : playerParty;

        // Mock the random number generator to force a critical hit
       jest.spyOn(global.Math, 'random').mockReturnValue(0); // Simulate a 0 (always crit)

        const enemy1Damage = calculateDamage(attacker, enemyParty[0], 'Attack Spread');
        const boss1Damage = calculateDamage(attacker, enemyParty[1], 'Attack Spread');
        expect(enemy1Damage).toBe(225);
        expect(boss1Damage).toBe(214);
        enemyParty[0].battleStats.hp -= enemy1Damage;
        enemyParty[1].battleStats.hp -= boss1Damage;
    });
}
)

