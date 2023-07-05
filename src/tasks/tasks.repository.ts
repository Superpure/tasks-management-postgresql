import { Injectable } from '@nestjs/common';
import { Task } from './task.entity';
import { Brackets, DataSource, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { v4 as uuid } from 'uuid';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';

@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks(filterDto: GetTasksFilterDTO): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(task.title) LIKE LOWER(:search)', {
            search: `%${search}%`,
          }).orWhere('LOWER(task.description) LIKE LOWER(:search)', {
            search: `%${search}%`,
          });
        }),
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.save(task);
    return task;
  }
}
