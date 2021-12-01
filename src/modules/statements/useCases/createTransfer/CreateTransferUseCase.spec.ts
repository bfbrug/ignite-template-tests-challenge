import { OperationType } from "../../entities/Statement";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateTransferUseCase } from "./CreateTransferUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";

let createStatementUseCase: CreateStatementUseCase;
let createTransferUseCase: CreateTransferUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe('Create Statement', () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
    createTransferUseCase = new CreateTransferUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('should be able to make a transfer', async () => {

    const user = await createUserUseCase.execute({
      name: 'User test',
      email: 'mail1@example.com',
      password: '123456'
    });

    const sender = await createUserUseCase.execute({
      name: 'Sender test',
      email: 'mail2@example.com',
      password: '123456'
    });

    await createStatementUseCase.execute({
      user_id: sender.id as string,
      amount: 450.00,
      type: 'deposit' as OperationType,
      description: 'Deposit de cash'
     });


    const statement = await createTransferUseCase.execute({
      user_id: user.id as string,
      sender_id: sender.id as string,
      amount: 250.00,
      description: 'favored transfer de cash'
     });

     expect(statement[0]).toHaveProperty('id');
    });
  })
