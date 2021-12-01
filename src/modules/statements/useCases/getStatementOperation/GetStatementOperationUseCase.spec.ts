import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { CreateTransferUseCase } from "../createTransfer/CreateTransferUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createTransferUseCase: CreateTransferUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe('Get On Operation', () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createTransferUseCase = new CreateTransferUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);

    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  });

  it('should be get on operation for id off the statement', async () => {
    const user = await createUserUseCase.execute({
      name: 'Name',
      email: 'test@example.com',
      password: '123456'
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 1250.00,
      type: 'deposit' as OperationType,
      description: 'Deposit de cash'
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 250.00,
      type: 'withdraw' as OperationType,
      description: 'Withdraw de cash'
    });

    const operation = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string,
    });

    expect(operation).toHaveProperty('id');
    expect(operation.amount).toBe(1250);
    expect(operation.type).toBe('deposit');

  });


  it('should show a transfer operation', async () => {
    const user = await createUserUseCase.execute({
      name: 'Name',
      email: 'test@example.com',
      password: '123456'
    });

    const sender = await createUserUseCase.execute({
      name: 'User test',
      email: 'mail1@example.com',
      password: '123456'
    });

    await createStatementUseCase.execute({
      user_id: sender.id as string,
      amount: 1250.00,
      type: 'deposit' as OperationType,
      description: 'Deposit de cash'
    });

    const transfer = await createTransferUseCase.execute({
      user_id: user.id as string,
      sender_id: sender.id as string,
      amount: 250.00,
      description: 'Favored transfer de cash'
     });

    const operation = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: transfer[0].id as string,
    });

    expect(operation).toHaveProperty('id');
    expect(operation.type).toBe('transfer');

  });

});
