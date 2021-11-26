import  request  from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";

import createConnection from "../../../../database/index";

let connection: Connection;
let token: string;

describe("Create Statement Deposit",  () => {

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

  it("should be able an deposit", async () => {

    const statement = await request(app)
    .post('/api/v1/statements/deposit')
    .send({
      amount: 250.00,
      description: 'Deposit de cash'
    })
    .set({
      Authorization: `Bearer ${token}`
    });

    expect(statement.status).toBe(201);

  });

  it("should be able an withdraw", async () => {

     const statement = await request(app)
     .post('/api/v1/statements/withdraw')
     .send({
       amount: 250.00,
       description: 'Withdraw de cash'
     })
     .set({
       Authorization: `Bearer ${token}`
     });

     expect(statement.status).toBe(201);

   });

   it("should be not able an withdraw when the insufficient balance", async () => {

      const statement = await request(app)
      .post('/api/v1/statements/withdraw')
      .send({
        amount: 100,
        description: 'Withdraw de cash'
      })
      .set({
        Authorization: `Bearer ${token}`
      });

      expect(statement.status).toBe(400);
      expect(statement.body.message).toBe('Insufficient funds');


  });

});

