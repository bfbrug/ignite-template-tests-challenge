
import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateTransferError } from "./CreateTransferErro";
import { ICreateTransferDTO } from "./ICreateTransferTDO";

@injectable()
class CreateTransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository

  ){}

  async execute({ user_id, sender_id, amount, description }:ICreateTransferDTO) {
    const user = await this.usersRepository.findById(user_id);

    if(!user) {
      throw new CreateTransferError.UserNotFound();
    }

    const sender = await this.usersRepository.findById(sender_id);

    if(!sender) {
      throw new CreateTransferError.SenderNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({
      user_id: sender_id as string
    });



    if (balance < amount) {
      throw new CreateTransferError.InsufficientFunds()
    }

    const transferOperation = await this.statementsRepository.transfer({
      user_id,
      sender_id: sender.id as string,
      amount,
      description
    });
    console.log(transferOperation);

    return transferOperation;

  }
}

export { CreateTransferUseCase }
