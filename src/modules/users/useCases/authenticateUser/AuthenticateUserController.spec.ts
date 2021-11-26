import  request  from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";

import createConnection from "../../../../database/index";

let connection: Connection;

describe("Authenticate User",  () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to authenticate user", async () => {

   await request(app)
    .post('/api/v1/users')
    .send({
      name: 'Test',
      email: 'email@example.com',
      password: '12345'
    });

    const response = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: 'email@example.com',
        password: '12345'
    });

    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.email).toBe('email@example.com');
  });
});

