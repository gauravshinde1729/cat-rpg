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


    it('Boss1 attacks Mage1 with Attack Solo', () => {
        const attacker = enemyParty[1]; // Boss1
        const defender = playerParty[1]; // Mage1
        expect(calculateDamage(attacker, defender, 'Attack Solo')).toBe(540);
        defender.battleStats.hp -= 540;
    });
    
    it('Fighter1 attacks both enemies with Attack Spread (no crits)', () => {
        const attacker = playerParty[0]; // Fighter1
        const enemy1Damage = calculateDamage(attacker, enemyParty[0], 'Attack Spread');
        const boss1Damage = calculateDamage(attacker, enemyParty[1], 'Attack Spread');
        expect(enemy1Damage).toBe(225);
        expect(boss1Damage).toBe(214);
        enemyParty[0].battleStats.hp -= enemy1Damage;
        enemyParty[1].battleStats.hp -= boss1Damage;
    });
    
    it('Enemy1 attacks Archer1 with Attack Solo (crit)', () => {
        const attacker = enemyParty[0];
        const defender = playerParty[2];
        expect(calculateDamage(attacker, defender, 'Attack Solo')).toBe(286); // Assuming crit
        defender.battleStats.hp -= 286;
    });
    
    it('Mage1 attacks Boss1 with Attack Solo', () => {
        const attacker = playerParty[1];
        const defender = enemyParty[1];
        expect(calculateDamage(attacker, defender, 'Attack Solo')).toBe(357);
        defender.battleStats.hp -= 357;
    });
    
    // Round 2 Tests
    it('Archer1 attacks Enemy1 with Attack Solo', () => {
        const attacker = playerParty[2];
        const defender = enemyParty[0];
        expect(calculateDamage(attacker, defender, 'Attack Solo')).toBe(288);
        defender.battleStats.hp -= 288;
    });
    
    it('Boss1 attacks all players with Attack Spread (crit on Mage1)', () => {
        const attacker = enemyParty[1];
        const mage1Damage = calculateDamage(attacker, playerParty[1], 'Attack Spread');
        const fighter1Damage = calculateDamage(attacker, playerParty[0], 'Attack Spread');
        const archer1Damage = calculateDamage(attacker, playerParty[2], 'Attack Spread');
        expect(mage1Damage).toBe(360); // Crit
        expect(fighter1Damage).toBe(160);
        expect(archer1Damage).toBe(103);
        playerParty[0].battleStats.hp -= fighter1Damage;
        playerParty[1].battleStats.hp -= mage1Damage; // Mage1 is already defeated, but we still calculate damage
        playerParty[2].battleStats.hp -= archer1Damage;
    });
    
    it('Fighter1 attacks both enemies with Attack Spread', () => {
        const attacker = playerParty[0];
        const enemy1Damage = calculateDamage(attacker, enemyParty[0], 'Attack Spread');
        const boss1Damage = calculateDamage(attacker, enemyParty[1], 'Attack Spread');
        expect(enemy1Damage).toBe(225);
        expect(boss1Damage).toBe(214);
        enemyParty[0].battleStats.hp -= enemy1Damage;
        enemyParty[1].battleStats.hp -= boss1Damage;
    });
    
    // Enemy1 is defeated in this round, so no attack
    
    it('Mage1 heals self with Heal Solo', () => {
        const healer = playerParty[1];
        const initialHp = healer.battleStats.hp;
        selectAttackType(healer, playerParty); // Trigger heal selection
        expect(healer.battleStats.hp).toBe(initialHp + healer.battleStats.maxHp * 0.5);
    });
    
    // Round 3 Tests
    it('Archer1 attacks Boss1 with Attack Solo', () => {
        const attacker = playerParty[2];
        const defender = enemyParty[1];
        expect(calculateDamage(attacker, defender, 'Attack Solo')).toBe(274);
        defender.battleStats.hp -= 274;
    });
    
    it('Boss1 attacks Mage1 with Attack Solo (crit)', () => {
        const attacker = enemyParty[1];
        const defender = playerParty[1];
        expect(calculateDamage(attacker, defender, 'Attack Solo')).toBe(1080); // Assuming crit
        defender.battleStats.hp -= 1080; // Mage1 is defeated
    });
    
    it('Fighter1 attacks Boss1 with Attack Spread', () => {
        const attacker = playerParty[0];
        const defender = enemyParty[1];
        expect(calculateDamage(attacker, defender, 'Attack Spread')).toBe(214);
        defender.battleStats.hp -= 214;
    });
    
    // Enemy1 is already defeated, so no attack
    
    // Mage1 is defeated, so no attack
    
    // Round 4 Tests
    it('Archer1 attacks Boss1 with Attack Solo', () => {
        const attacker = playerParty[2];
        const defender = enemyParty[1];
        expect(calculateDamage(attacker, defender, 'Attack Solo')).toBe(274);
        defender.battleStats.hp -= 274;
    });
    
    
    it('Boss1 attacks all players with Attack Spread (crit on Fighter1)', () => {
        const attacker = enemyParty[1]; // Boss1
      
        // Calculate damage for each player
        const fighter1Damage = calculateDamage(attacker, playerParty[0], 'Attack Spread');
        const mage1Damage = calculateDamage(attacker, playerParty[1], 'Attack Spread');
        const archer1Damage = calculateDamage(attacker, playerParty[2], 'Attack Spread');
      
        // Assertions
        expect(fighter1Damage).toBe(320); // Crit on Fighter1
        expect(mage1Damage).toBe(180);
        expect(archer1Damage).toBe(103);
      
        // Update HP of players (even if defeated)
        playerParty[0].battleStats.hp -= fighter1Damage;
        playerParty[1].battleStats.hp -= mage1Damage;
        playerParty[2].battleStats.hp -= archer1Damage;
      });
}
)

