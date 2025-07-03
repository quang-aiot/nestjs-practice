import { Task } from 'src/domain/tasks/entities/task.entity';

export interface PaginatedTasks {
  page: number;
  limit: number;
  total: number;
  data: Task[];
}
