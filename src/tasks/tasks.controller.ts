import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { stringify } from 'querystring';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-tast-status.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');
  constructor(
    private tasksService: TasksService,
    private configService: ConfigService,
  ) {}

  @Get()
  getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(
        filterDto,
      )}`,
    );
    return this.tasksService.getTasks(filterDto, user);
  }

  // @Get()
  // getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
  //     if(Object.keys(filterDto).length) {
  //         return this.tasksService.getTasksWithFilters(filterDto);
  //     }else{
  //         return this.tasksService.getAllTasks();
  //     }
  // }

  @Get('/:id')
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  // @Get('/:id')
  // getTaskById(@Param('id') id: string): Task {
  //     return this.tasksService.getTaskById(id);
  // }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User "${user.username}" creating a new task. Data: ${JSON.stringify(
        createTaskDto,
      )}`,
    );
    return this.tasksService.createTask(createTaskDto, user);
  }

  // // @Post()
  // // createTask(@Body('title') title: string, @Body('description') description: string): Task {
  // //     return this.tasksService.createTask(title, description);
  // // }
  // @Post()
  // createTask(@Body() createTaskDto: CreateTaskDto): Task {
  //     return this.tasksService.createTask(createTaskDto);
  // }

  @Delete('/:id')
  deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.tasksService.deleteTask(id, user);
  }

  // @Delete('/:id')
  // deleteTask(@Param('id') id: string){
  //     return this.tasksService.deleteTask(id);
  // }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status, user);
  }

  // // @Patch('/:id/status')
  // // updateTaskStatus(@Param('id') id: string, @Body('status') status: TaskStatus): Task {
  // //     return this.tasksService.updateTaskStatus(id, status);
  // // }
  // @Patch('/:id/status')
  // updateTaskStatus(@Param('id') id: string, @Body() updateTaskStatusDto: UpdateTaskStatusDto): Task {
  //     const { status } = updateTaskStatusDto;
  //     return this.tasksService.updateTaskStatus(id, status);
  // }
}
