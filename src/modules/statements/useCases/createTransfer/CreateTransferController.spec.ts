import  request  from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";

import createConnection from "../../../../database/index";

let connection: Connection;
let token: string;

describe("Create Statement Transfer",  () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to make a transfer", async () => {

    await request(app)
    .post('/api/v1/users')
    .send({
      name: 'Test sender',
      email: 'sender@example.com',
      password: '123456'
    });

    await request(app)
    .post('/api/v1/users')
    .send({
      name: 'Test favored',
      email: 'favored@example.com',
      password: '123456'
    });

    const sender = await request(app)
    .post('/api/v1/sessions')
    .send({
      email: 'sender@example.com',
      password: '123456'
    });

    token  = sender.body.token;

    const favored = await request(app)
    .post('/api/v1/sessions')
    .send({
      email: 'favored@example.com',
      password: '123456'
    });

    await request(app)
    .post('/api/v1/statements/deposit')
    .send({
      amount: 350,
      description: 'Deposit de cash'
    })
    .set({
      Authorization: `Bearer ${token}`
    });

    const transfer = await request(app)
    .post(`/api/v1/statements/transfers/${favored.body.user.id}`)
    .send({
      amount: 250,
      description: 'Transfer'
    })
    .set({
      Authorization: `Bearer ${token}`
    });

    console.log(transfer.body);

    expect(transfer.status).toBe(200);

  });
});

