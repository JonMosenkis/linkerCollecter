import { timeoutPromise } from "../utils"
import { TaskQueue } from "./queue"

export class Coordinator {
    readonly workerPool: Array<Worker>
    readonly taskQueue: TaskQueue

    constructor(queue: TaskQueue, numWorkers: number, delay: number = 0) {
        this.workerPool = Array.from({length: numWorkers}).map(() => {return new Worker(this, delay)});
        this.taskQueue = queue;
    }
    async start() {
        await Promise.all(this.workerPool.map(worker => worker.start()));
    }
    async success(url: string) {}
    async retry(url: string) {}
    async failed(url: string) {}
    async getNextTask(): Promise<object|null> {
        return {}
    }
}

class Worker {
    coordinator: Coordinator
    delay: number
    
    constructor(coordinator: Coordinator, delay: number = 0) {
        this.coordinator = coordinator;
        this.delay = 0;
    }

    private getNextTask = async (): Promise<object> => {
        return await this.coordinator.getNextTask()
    }
    protected executeTask = async (taskDescription: object) => {

    }
    public start = async () => {
        let currentTask = await this.getNextTask();
        let waitBeforeNextTask: Promise<null>;

        while (currentTask) {
            waitBeforeNextTask = timeoutPromise(this.delay); // start timer before task begins
            await this.executeTask(currentTask);
            await waitBeforeNextTask;
        }
    }
}



