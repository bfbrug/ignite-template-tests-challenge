import { AppError } from '../../../../shared/errors/AppError';

export namespace CreateTransferError {
	export class SenderNotFound extends AppError {
		constructor () {
			super('Sender user not found!', 404);
		}
	}

	export class UserNotFound extends AppError {
    constructor() {
      super('User not found', 404);
    }
  }

	export class InsufficientFunds extends AppError {
		constructor () {
			super('Insufficient funds!', 400);
		}
	}
}
