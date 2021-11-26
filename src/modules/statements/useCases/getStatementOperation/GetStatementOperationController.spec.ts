import  request  from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";

import createConnection from "../../../../database/index";

let connection: Connection;
let token: string;

describe("Show Operation Statement",  () => {

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

  it("should be able show on operation", async () => {

    const statement = await request(app)
    .post('/api/v1/statements/deposit')
    .send({
      amount: 250,
      description: 'Deposit de cash'
    })
    .set({
      Authorization: `Bearer ${token}`
    });

    await request(app)
     .post('/api/v1/statements/withdraw')
     .send({
       amount: 250,
       description: 'Withdraw de cash'
     })
     .set({
       Authorization: `Bearer ${token}`
     });

     const operation = await request(app)
      .get(`/api/v1/statements/${statement.body.id}`)
      .set({
        Authorization: `Bearer ${token}`
     });

     expect(operation.body).toHaveProperty('id');
     expect(operation.body.amount).toBe('250.00');
     expect(operation.body.type).toBe('deposit');

  });

});

