import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTransferUseCase } from "./CreateTransferUseCase";


class CreateTransferController {
  async execute(request: Request, response: Response): Promise<Response>{
    const { id: sender_id  } = request.user;
    const { user_id } = request.params;
    const { amount, description } = request.body;

    const createTransferUseCase = container.resolve(CreateTransferUseCase)

    const transfer = await createTransferUseCase.execute({
      user_id,
      sender_id: sender_id as string,
      amount,
      description
    });

    return response.json({transfer});
  }
}

export { CreateTransferController }
