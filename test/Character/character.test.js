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

});
