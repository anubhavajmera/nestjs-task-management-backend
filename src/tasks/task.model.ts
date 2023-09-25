// Of no use once we have created en entity file for database. We can change the name of the file to task-status.enum.ts

// export interface Task {
//     id: string;
//     title: string;
//     description: string;
//     status: TaskStatus;
// }

export enum TaskStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE'
}
