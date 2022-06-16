export interface Command {
    execute(): void;
}

export abstract class AbstractCommand implements Command {
    abstract execute(): void;
}
