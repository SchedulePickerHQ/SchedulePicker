export type TypeOfValues<T> = T[keyof T];

export interface Command {
	execute(): void;
}
