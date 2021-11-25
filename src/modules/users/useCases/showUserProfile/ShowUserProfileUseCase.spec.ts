import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Show User', () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository;
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it('should be able to show authenticate user', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'Name Test',
      email: 'email@example.com',
      password: 'password teste'
    });

    const profile = await showUserProfileUseCase.execute(user.id as string);

    expect(profile).toEqual(user);

  });

})
