import  request  from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";

import createConnection from "../../../../database/index";

let connection: Connection;
let token: string;

describe("Show Balance",  () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app)
    .post('/api/v1/users')
    .send({
      name: 'Test deposit',
      email: 'email@example.com',
      password: '123456'
    });

    const responseUser = await request(app)
    .post('/api/v1/sessions')
    .send({
      email: 'email@example.com',
      password: '123456'
    });

    token  = responseUser.body.token;

  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able list the balance", async () => {

    await request(app)
    .post('/api/v1/statements/deposit')
    .send({
      amount: 250.00,
      description: 'Deposit de cash'
    })
    .set({
      Authorization: `Bearer ${token}`
    });

    await request(app)
     .post('/api/v1/statements/withdraw')
     .send({
       amount: 250.00,
       description: 'Withdraw de cash'
     })
     .set({
       Authorization: `Bearer ${token}`
     });

     const balance = await request(app)
      .get('/api/v1/statements/balance')
      .set({
        Authorization: `Bearer ${token}`
     });

     expect(balance.body).toHaveProperty('balance');
     expect(balance.body.statement.length).toBe(2);
     expect(balance.body.balance).toBe(0);

  });

});

