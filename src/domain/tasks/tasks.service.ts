import {
  Injectable,
  ConflictException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTasksQueryDto } from './dtos/get-tasks-query.dto';
import Redis from 'ioredis';
import { PaginatedTasks } from 'src/common/interfaces/pagination-task.interface';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const taskExist = await this.taskRepository.findOne({
      where: { title: createTaskDto.title },
    });
    if (taskExist) {
      throw new ConflictException('Task is exist');
    }
    const task = this.taskRepository.create({
      ...createTaskDto,
    });
    await this.taskRepository.save(task);

    return task;
  }

  async getTask(taskId: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException('Task is not found');
    }

    return task;
  }

  async getTasks(query: GetTasksQueryDto): Promise<PaginatedTasks> {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const skip = (page - 1) * limit;
    const cacheKey = `tasks:page=${page}:limit=${limit}`;

    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached) as PaginatedTasks;

    const [data, total] = await this.taskRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const result = { page, limit, total, data };

    this.redis.set(cacheKey, JSON.stringify(result), 'EX', 600).catch(() => {});

    return result;
  }

  async uploadTaskImage(image: string, id: string) {
    await this.taskRepository.update(id, { image });

    return this.taskRepository.findOneOrFail({ where: { id } });
  }
}
