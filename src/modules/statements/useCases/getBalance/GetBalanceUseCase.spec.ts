import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { CreateTransferUseCase } from "../createTransfer/CreateTransferUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let createStatementUseCase: CreateStatementUseCase;
let createTransferUseCase: CreateTransferUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe('Get Balance', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
    createTransferUseCase = new CreateTransferUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
  });

  it('should be able return an list all operations off the user list', async () => {
    const user = await createUserUseCase.execute({
      name: 'Name',
      email: 'test@example.com',
      password: '123456'
    });

    const favored = await createUserUseCase.execute({
      name: 'User test',
      email: 'mail1@example.com',
      password: '123456'
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 750.00,
      type: 'deposit' as OperationType,
      description: 'Deposit de cash'
    });

    await createStatementUseCase.execute({
      user_id: favored.id as string,
      amount: 1250.00,
      type: 'deposit' as OperationType,
      description: 'Create website'
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 250.00,
      type: 'withdraw' as OperationType,
      description: 'Withdraw de cash'
    });

    await createTransferUseCase.execute({
      user_id: user.id as string,
      sender_id: favored.id as string,
      amount: 250.00,
      description: 'Favored transfer de cash'
     });

    const balance = await getBalanceUseCase.execute({
      user_id: user.id as string
    });

    expect(balance).toHaveProperty('balance');
    expect(balance.balance).toBe(750);
  })

})
