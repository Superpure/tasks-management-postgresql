import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './tasks.repository';

const mockTaskRespository = () => ({
  getTasks: jest.fn(),
});

const mockUser = {
  id: 'someId',
  username: 'Felipe',
  password: 'somePassword',
  tasks: [],
};

describe('TasksService', () => {
  let service: TasksService;
  let tasksRepository: jest.Mocked<TaskRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRespository },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    tasksRepository = module.get(TaskRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and return the result', async () => {
      tasksRepository.getTasks.mockResolvedValue([]);
      const result = await service.getTasks(null, mockUser);
      expect(result).toEqual([]);
    });
  });
});
