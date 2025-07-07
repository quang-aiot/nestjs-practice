import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { Task } from './entities/task.entity';
import { GetTasksQueryDto } from './dtos/get-tasks-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'src/config/storage.config';
import { imageFileFilter } from 'src/common/filters/image-file.filter';
import { Request } from 'express';
import { PaginatedTasks } from 'src/common/interfaces/pagination-task.interface';
import { TaskResponseDto } from 'src/domain/tasks/dtos/task-response.dto';
import { PaginatedTasksDto } from 'src/domain/tasks/dtos/paginated-task-response.dto';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiCreatedResponse({
    description: 'Create task is successfully',
    type: TaskResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input or task is exist',
  })
  @UseGuards(JwtAuthGuard)
  @Post('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskService.createTask(createTaskDto);
  }

  @ApiOperation({ summary: 'Get task by id' })
  @ApiCreatedResponse({
    description: 'Get task by id',
    type: TaskResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Task is not found',
  })
  @Get('/:taskId')
  async getTask(
    @Param('taskId', new ParseUUIDPipe({ version: '4' })) taskId: string,
  ): Promise<Task> {
    return await this.taskService.getTask(taskId);
  }

  @ApiOperation({ summary: 'Get tasks' })
  @ApiCreatedResponse({
    description: 'Get tasks',
    type: PaginatedTasksDto,
  })
  @Get('/')
  async getTasks(@Query() query: GetTasksQueryDto): Promise<PaginatedTasks> {
    return await this.taskService.getTasks(query);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload file for task' })
  @ApiCreatedResponse({
    description: 'Upload file for task is successfully',
    type: TaskResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input or task is exist',
  })
  @UseGuards(JwtAuthGuard)
  @Post('/:id/upload')
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: storageConfig('file'),
      fileFilter: imageFileFilter,
    }),
  )
  uploadFileForTask(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Req() req: Request,
  ): Promise<Task> {
    if (!file) {
      throw new BadRequestException(req.fileValidationError);
    }
    return this.taskService.uploadTaskImage(file.filename, id);
  }
}
