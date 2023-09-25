import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.model';
// import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  // private tasks: Task[] = [];

  // getAllTasks(): Task[] {
  //     return this.tasks;
  // }

  // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //     const { status, search } = filterDto;

  //     let tasks = this.getAllTasks();

  //     if(status){
  //         tasks = tasks.filter((task) => task.status === status);
  //     }

  //     if(search){
  //         tasks = tasks.filter((task) => {
  //             if(task.title.includes(search) || task.description.includes(search)){
  //                 return true;
  //             }
  //             return false;
  //         });
  //     }

  //     return tasks;
  // }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = this.tasksRepository.findOne({
      select: [],
      where: { id, user },
    });

    if (!found) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }

    return found;
  }

  // getTaskById(id: string): Task {
  //     const found = this.tasks.find((task) => task.id === id);

  //     if(!found){
  //         throw new NotFoundException(`Task with id "${id}" not found`);
  //     }

  //     return found;
  // }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    // const { title, description } = createTaskDto;

    // const task = this.tasksRepository.create({
    //     title,
    //     description,
    //     status: TaskStatus.OPEN
    // });
    // await this.tasksRepository.save(task);
    // return task;
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  // createTask(createTaskDto: CreateTaskDto): Task {
  //     const { title, description } = createTaskDto;

  //     const task: Task = {
  //         id: uuid(),
  //         title,
  //         description,
  //         status: TaskStatus.OPEN
  //     };
  //     this.tasks.push(task);
  //     return task;
  // }

  async deleteTask(id: string, user: User): Promise<void> {
    const response = await this.tasksRepository.delete({ id, user });

    if (response.affected === 0) {
      throw new NotFoundException(`Tas with id "${id}" not found`);
    }
  }

  // deleteTask(id: string): void {
  //     const found: Task = this.getTaskById(id);
  //     this.tasks = this.tasks.filter((task) => task.id !== found.id);
  // }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    this.tasksRepository.save(task);
    return task;
  }

  // updateTaskStatus(id: string, status: TaskStatus): Task {
  //     const task: Task = this.getTaskById(id);
  //     task.status = status;
  //     return task;
  // }
}
