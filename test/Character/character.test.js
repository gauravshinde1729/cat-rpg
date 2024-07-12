const request = require('supertest');
const mongoose = require('mongoose');
const config = require("config");
const app  = require('../../server');
const Character = require("../../schema/CharacterSchema")


const db = config.get("MONGO_URI");
describe('Character API', () => {
  beforeAll(async () => {
    // Connect to the test database
    await mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterEach(async () => {
    // Clear the test database after each test
    await Character.deleteMany({});
  });

  afterAll(async () => {
    // Disconnect from the test database
    await mongoose.disconnect();
  });

  it('should create a new character', async () => {
    const newCharacter = {
      name: 'Whiskers',
      class: 'Fighter',
      heart: 'Beauty',
      baseStats: { spd: 100, pAtk: 80, pDef: 50, mAtk: 20, mDef: 30, critC: 5, critR: 10, hp: 500 },
    };

    const response = await request(app)
      .post('/characters')
      .send(newCharacter);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe(newCharacter.name);
    // Add more assertions to check other properties if needed
  });

  it('should return an error for invalid input', async () => {
    const invalidCharacter = { name: 'Whiskers', class: 'InvalidClass' }; // Missing heart and baseStats

    const response = await request(app)
      .post('/characters')
      .send(invalidCharacter);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
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
});
