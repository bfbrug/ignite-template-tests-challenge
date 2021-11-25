import { OperationType } from "../../entities/Statement";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementError } from "./CreateStatementError";

let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe('Create Statement', () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('should be able an deposit', async () => {
    const user = await createUserUseCase.execute({
      name: 'Name',
      email: 'test@example.com',
      password: '123456'
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 250.00,
      type: 'deposit' as OperationType,
      description: 'Deposit de cash'
     });

     expect(statement).toHaveProperty('id');
    });

    it('should be able an withdraw', async () => {
      expect(async () => {
        const user = await createUserUseCase.execute({
          name: 'Name',
          email: 'test@example.com',
          password: '123456'
        });

        await createStatementUseCase.execute({
          user_id: user.id as string,
          amount: 250.00,
          type: 'deposit' as OperationType,
          description: 'Deposit de cash'
        });

        await createStatementUseCase.execute({
          user_id: user.id as string,
          amount: 300.00,
          type: 'withdraw' as OperationType,
          description: 'Withdraw de cash'
        });

        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
    })
  })
