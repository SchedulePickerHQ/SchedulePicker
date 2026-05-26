export type ValueOf<T> = T[keyof T];

export interface Command {
	execute(): Promise<void>;
}
